// @ts-nocheck
import sql from "@/app/api/utils/sql";
import {
  TIERS,
  LOCATIONS,
  CATEGORIES,
  STARTING_TIER,
  getUserTierForCategory,
  calculateTierFromRank,
  shouldPromoteToNextLocation,
  getNextLocation,
  determinePromotionType,
  getBadgeForPromotion,
  isUserExcludedFromCategory,
} from "@/app/api/utils/tierHelpers";

/**
 * Preview tier promotions/demotions without actually executing them
 * Useful for testing and seeing what would happen
 */
export async function POST(request) {
  try {
    const { period, periodStart, periodEnd, category, location } =
      await request.json();

    if (!period || !periodStart || !periodEnd) {
      return Response.json(
        { error: "period, periodStart, and periodEnd are required" },
        { status: 400 },
      );
    }

    const results = {
      wouldPromote: [],
      wouldDemote: [],
      wouldCrossLocationPromote: [],
      noChange: [],
    };

    // If specific category/location provided, only preview that
    const categoriesToProcess = category ? [category] : CATEGORIES;
    const locationsToProcess = location ? [location] : Object.values(LOCATIONS);

    for (const cat of categoriesToProcess) {
      for (const loc of locationsToProcess) {
        const locationResults = await previewLocationTier(
          cat,
          loc,
          periodStart,
          periodEnd,
        );

        results.wouldPromote.push(...locationResults.wouldPromote);
        results.wouldDemote.push(...locationResults.wouldDemote);
        results.wouldCrossLocationPromote.push(
          ...locationResults.wouldCrossLocationPromote,
        );
        results.noChange.push(...locationResults.noChange);
      }
    }

    return Response.json({
      success: true,
      summary: {
        wouldPromote: results.wouldPromote.length,
        wouldDemote: results.wouldDemote.length,
        wouldCrossLocationPromote: results.wouldCrossLocationPromote.length,
        noChange: results.noChange.length,
      },
      results,
    });
  } catch (error) {
    console.error("Error previewing tier promotions:", error);
    return Response.json(
      { error: "Failed to preview tier promotions" },
      { status: 500 },
    );
  }
}

async function previewLocationTier(category, location, periodStart, periodEnd) {
  const results = {
    wouldPromote: [],
    wouldDemote: [],
    wouldCrossLocationPromote: [],
    noChange: [],
  };

  // Get all users in this location
  const users = await getUsersInLocation(location);

  // Calculate stats for each user in this category
  const userStats = await calculateUserStats(
    users,
    category,
    periodStart,
    periodEnd,
  );

  // Filter out excluded users
  const eligibleUsers = [];
  for (const userStat of userStats) {
    const isExcluded = await isUserExcludedFromCategory(
      userStat.userId,
      category,
    );
    if (!isExcluded) {
      eligibleUsers.push(userStat);
    }
  }

  // Sort by value (descending) to get rankings
  eligibleUsers.sort((a, b) => b.value - a.value);

  // Preview each user's potential tier change
  for (let i = 0; i < eligibleUsers.length; i++) {
    const userStat = eligibleUsers[i];
    const rank = i + 1;
    const totalUsers = eligibleUsers.length;

    const currentTier = await getUserTierForCategory(userStat.userId, category);

    if (!currentTier || currentTier.location !== location) {
      continue;
    }

    const change = {
      userId: userStat.userId,
      username: userStat.username,
      category,
      location,
      currentTier: currentTier.tier,
      rank,
      totalUsers,
      value: userStat.value,
      percentile: ((rank / totalUsers) * 100).toFixed(2),
    };

    // Check for cross-location promotion first
    if (
      shouldPromoteToNextLocation(rank, totalUsers, currentTier.tier, location)
    ) {
      const nextLocation = getNextLocation(location);
      if (nextLocation) {
        const toTier = STARTING_TIER[nextLocation];
        results.wouldCrossLocationPromote.push({
          ...change,
          toLocation: nextLocation,
          toTier,
          badgeAwarded: getBadgeForPromotion(
            currentTier.tier,
            location,
            category,
          ),
        });
        continue;
      }
    }

    // Check tier change within current location
    const newTier = calculateTierFromRank(
      rank,
      totalUsers,
      currentTier.tier,
      location,
    );

    if (newTier !== currentTier.tier) {
      const promotionType = determinePromotionType(
        location,
        currentTier.tier,
        location,
        newTier,
      );

      change.newTier = newTier;
      change.promotionType = promotionType;
      change.badgeAwarded = promotionType.includes("promotion")
        ? getBadgeForPromotion(newTier, location, category)
        : null;

      if (promotionType.includes("promotion")) {
        results.wouldPromote.push(change);
      } else if (promotionType.includes("demotion")) {
        results.wouldDemote.push(change);
      }
    } else {
      change.newTier = currentTier.tier;
      results.noChange.push(change);
    }
  }

  return results;
}

// Helper functions (same as in process-promotions)
async function getUsersInLocation(location) {
  try {
    let query;

    switch (location) {
      case LOCATIONS.CITY:
        query = sql`
          SELECT id, city, state, country, username
          FROM users
          WHERE city IS NOT NULL AND city != ''
          AND include_in_leaderboard = true
        `;
        break;
      case LOCATIONS.STATE:
        query = sql`
          SELECT id, city, state, country, username
          FROM users
          WHERE state IS NOT NULL AND state != ''
          AND include_in_leaderboard = true
        `;
        break;
      case LOCATIONS.COUNTRY:
        query = sql`
          SELECT id, city, state, country, username
          FROM users
          WHERE country IS NOT NULL AND country != ''
          AND include_in_leaderboard = true
        `;
        break;
      case LOCATIONS.GLOBAL:
        query = sql`
          SELECT id, city, state, country, username
          FROM users
          WHERE include_in_leaderboard = true
        `;
        break;
      default:
        return [];
    }

    return await query;
  } catch (error) {
    console.error("Error getting users in location:", error);
    return [];
  }
}

async function calculateUserStats(users, category, periodStart, periodEnd) {
  const userStats = [];

  for (const user of users) {
    let value = 0;

    switch (category) {
      case "miles":
        const milesResult = await sql`
          SELECT COALESCE(SUM(distance), 0) as total
          FROM runs
          WHERE user_id = ${user.id}
          AND date >= ${periodStart}
          AND date <= ${periodEnd}
        `;
        value = parseFloat(milesResult[0]?.total || 0);
        break;

      case "runs":
        const runsResult = await sql`
          SELECT COUNT(*) as total
          FROM runs
          WHERE user_id = ${user.id}
          AND date >= ${periodStart}
          AND date <= ${periodEnd}
        `;
        value = parseInt(runsResult[0]?.total || 0);
        break;

      case "elevation":
        const elevationResult = await sql`
          SELECT COALESCE(SUM(elevation_gain), 0) as total
          FROM runs
          WHERE user_id = ${user.id}
          AND date >= ${periodStart}
          AND date <= ${periodEnd}
        `;
        value = parseFloat(elevationResult[0]?.total || 0);
        break;

      case "speed":
        const speedResult = await sql`
          SELECT COALESCE(MIN(pace), 999999) as best_pace
          FROM runs
          WHERE user_id = ${user.id}
          AND date >= ${periodStart}
          AND date <= ${periodEnd}
          AND pace IS NOT NULL AND pace > 0
        `;
        const bestPace = parseFloat(speedResult[0]?.best_pace || 999999);
        value = bestPace < 999999 ? 1000000 / bestPace : 0;
        break;

      case "time":
        const timeResult = await sql`
          SELECT COALESCE(SUM(duration), 0) as total
          FROM runs
          WHERE user_id = ${user.id}
          AND date >= ${periodStart}
          AND date <= ${periodEnd}
        `;
        value = parseInt(timeResult[0]?.total || 0);
        break;

      case "calories":
        const caloriesResult = await sql`
          SELECT COALESCE(SUM(calories), 0) as total
          FROM runs
          WHERE user_id = ${user.id}
          AND date >= ${periodStart}
          AND date <= ${periodEnd}
        `;
        value = parseFloat(caloriesResult[0]?.total || 0);
        break;

      case "steps":
        const stepsResult = await sql`
          SELECT COALESCE(SUM(steps), 0) as total
          FROM runs
          WHERE user_id = ${user.id}
          AND date >= ${periodStart}
          AND date <= ${periodEnd}
        `;
        value = parseInt(stepsResult[0]?.total || 0);
        break;

      case "unstoppable":
      case "relaxed":
      case "grinding":
      case "focused":
      case "happy":
      case "meh":
      case "clearing":
      case "race":
        const moodResult = await sql`
          SELECT COUNT(*) as total
          FROM runs
          WHERE user_id = ${user.id}
          AND mood = ${category}
          AND date >= ${periodStart}
          AND date <= ${periodEnd}
        `;
        value = parseInt(moodResult[0]?.total || 0);
        break;

      case "heat":
        const heatResult = await sql`
          SELECT COUNT(*) as total
          FROM runs
          WHERE user_id = ${user.id}
          AND temperature >= 80
          AND date >= ${periodStart}
          AND date <= ${periodEnd}
        `;
        value = parseInt(heatResult[0]?.total || 0);
        break;

      case "icy":
        const icyResult = await sql`
          SELECT COUNT(*) as total
          FROM runs
          WHERE user_id = ${user.id}
          AND temperature <= 32
          AND date >= ${periodStart}
          AND date <= ${periodEnd}
        `;
        value = parseInt(icyResult[0]?.total || 0);
        break;

      default:
        value = 0;
    }

    userStats.push({
      userId: user.id,
      username: user.username,
      value,
      location: user,
    });
  }

  return userStats;
}
