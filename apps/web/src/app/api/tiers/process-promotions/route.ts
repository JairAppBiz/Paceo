// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { createTierPromotionNotification } from "@/app/api/utils/notificationHelpers";
import {
  TIERS,
  LOCATIONS,
  TIER_CATEGORIES,
  isTierCategory,
  STARTING_TIER,
  getUserTierForCategory,
  updateUserTier,
  recordTierPromotion,
  calculateTierFromRank,
  shouldPromoteToNextLocation,
  getNextLocation,
  determinePromotionType,
  getBadgeForPromotion,
  isUserExcludedFromCategory,
  awardPodiumMedal,
  getPodiumMedalType,
} from "@/app/api/utils/tierHelpers";

/**
 * Get unit for a category (used for medal display)
 */
function getCategoryUnit(category) {
  const units = {
    miles: "mi",
    runs: "runs",
    elevation: "ft",
    speed: "min/mi",
    time: "min",
    calories: "cal",
    steps: "steps",
    heat: "runs",
    icy: "runs",
    unstoppable: "runs",
    relaxed: "runs",
    grinding: "runs",
    focused: "runs",
    happy: "runs",
    meh: "runs",
    clearing: "runs",
    race: "runs",
  };
  return units[category] || "";
}

/**
 * Send notification for podium medal award
 */
async function sendPodiumMedalNotification(
  userId,
  category,
  location,
  rank,
  medalType,
  medalEmoji,
) {
  try {
    const locationNames = {
      [LOCATIONS.CITY]: "City",
      [LOCATIONS.STATE]: "State",
      [LOCATIONS.COUNTRY]: "Country",
      [LOCATIONS.GLOBAL]: "Global",
    };

    const categoryDisplay =
      category.charAt(0).toUpperCase() + category.slice(1);

    const rankText = rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd";

    const title = `${medalEmoji} ${rankText} Place!`;
    const message = `You earned ${rankText} place in ${locationNames[location]} ${categoryDisplay}!`;

    await sql`
      INSERT INTO notifications (user_id, type, title, message)
      VALUES (${userId}, 'medal_earned', ${title}, ${message})
    `;
  } catch (error) {
    console.error("Error sending podium medal notification:", error);
  }
}

/**
 * Process tier promotions/demotions for all users
 * This should be run at the end of each ranking period (weekly/monthly)
 */
export async function POST(request) {
  try {
    const { period, periodStart, periodEnd } = await request.json();

    if (!period || !periodStart || !periodEnd) {
      return Response.json(
        { error: "period, periodStart, and periodEnd are required" },
        { status: 400 },
      );
    }

    const results = {
      promotions: [],
      demotions: [],
      crossLocationPromotions: [],
      podiumMedals: [],
      errors: [],
    };

    // Process only tier categories (skip fun categories)
    for (const category of TIER_CATEGORIES) {
      console.log(`Processing category: ${category}`);

      try {
        // Process each location tier separately
        for (const location of Object.values(LOCATIONS)) {
          const locationResults = await processLocationTier(
            category,
            location,
            period,
            periodStart,
            periodEnd,
          );

          results.promotions.push(...locationResults.promotions);
          results.demotions.push(...locationResults.demotions);
          results.crossLocationPromotions.push(
            ...locationResults.crossLocationPromotions,
          );
          results.podiumMedals.push(...locationResults.podiumMedals);
        }
      } catch (error) {
        console.error(`Error processing category ${category}:`, error);
        results.errors.push({
          category,
          error: error.message,
        });
      }
    }

    return Response.json({
      success: true,
      summary: {
        promotions: results.promotions.length,
        demotions: results.demotions.length,
        crossLocationPromotions: results.crossLocationPromotions.length,
        podiumMedals: results.podiumMedals.length,
        errors: results.errors.length,
      },
      results,
    });
  } catch (error) {
    console.error("Error processing tier promotions:", error);
    return Response.json(
      { error: "Failed to process tier promotions" },
      { status: 500 },
    );
  }
}

/**
 * Process promotions for a specific location tier
 */
async function processLocationTier(
  category,
  location,
  period,
  periodStart,
  periodEnd,
) {
  const results = {
    promotions: [],
    demotions: [],
    crossLocationPromotions: [],
    podiumMedals: [],
  };

  // Get all users in this location who haven't excluded this category
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

  // Get unit for this category
  const unit = getCategoryUnit(category);

  // Process each user's tier
  for (let i = 0; i < eligibleUsers.length; i++) {
    const userStat = eligibleUsers[i];
    const rank = i + 1; // 1-indexed rank
    const totalUsers = eligibleUsers.length;

    // Award podium medal for top 3 (separate from tier promotions)
    if (rank <= 3) {
      const podiumMedal = await awardPodiumMedal({
        userId: userStat.userId,
        category,
        location,
        rank,
        value: userStat.value,
        unit,
        periodStart,
        periodEnd,
        period,
      });

      if (podiumMedal) {
        results.podiumMedals.push(podiumMedal);

        // Send notification for podium medal
        const medalType = getPodiumMedalType(rank);
        const medalEmoji =
          medalType === "gold" ? "🥇" : medalType === "silver" ? "🥈" : "🥉";
        await sendPodiumMedalNotification(
          userStat.userId,
          category,
          location,
          rank,
          medalType,
          medalEmoji,
        );
      }
    }

    // Get current tier
    const currentTier = await getUserTierForCategory(userStat.userId, category);

    if (!currentTier) {
      console.log(
        `No tier found for user ${userStat.userId} in ${category}, skipping`,
      );
      continue;
    }

    // Only process users currently in this location
    if (currentTier.location !== location) {
      continue;
    }

    // Check if user should be promoted to next location
    if (
      shouldPromoteToNextLocation(rank, totalUsers, currentTier.tier, location)
    ) {
      const nextLocation = getNextLocation(location);
      if (nextLocation) {
        const crossPromotion = await processCrossLocationPromotion(
          userStat.userId,
          category,
          location,
          nextLocation,
          currentTier.tier,
          periodStart,
          periodEnd,
          userStat.value,
          unit,
        );

        if (crossPromotion) {
          results.crossLocationPromotions.push(crossPromotion);
        }
        // Skip normal tier processing since they moved locations
        continue;
      }
    }

    // Calculate what tier they should be in based on rank (within current location)
    const newTier = calculateTierFromRank(
      rank,
      totalUsers,
      currentTier.tier,
      location,
    );

    // Check if tier changed
    if (newTier !== currentTier.tier) {
      const promotionType = determinePromotionType(
        currentTier.location,
        currentTier.tier,
        location,
        newTier,
      );

      // Award badge for promotion
      const badgeAwarded = promotionType.includes("promotion")
        ? getBadgeForPromotion(newTier, location, category)
        : null;

      // Update tier
      await updateUserTier(
        userStat.userId,
        category,
        location,
        newTier,
        currentTier.location,
        currentTier.tier,
      );

      // Record the promotion/demotion
      const promotion = await recordTierPromotion({
        userId: userStat.userId,
        category,
        fromLocation: currentTier.location,
        fromTier: currentTier.tier,
        toLocation: location,
        toTier: newTier,
        promotionType,
        badgeAwarded,
        periodStart,
        periodEnd,
        value: userStat.value,
        unit,
      });

      // Send notification to user
      await sendTierChangeNotification(
        userStat.userId,
        category,
        currentTier.tier,
        newTier,
        location,
        promotionType,
        promotion.id,
      );

      if (promotionType.includes("promotion")) {
        results.promotions.push(promotion);
      } else if (promotionType.includes("demotion")) {
        results.demotions.push(promotion);
      }
    }
  }

  return results;
}

/**
 * Get all users in a specific location
 */
async function getUsersInLocation(location) {
  try {
    let query;

    switch (location) {
      case LOCATIONS.CITY:
        query = sql`
          SELECT id, city, state, country
          FROM users
          WHERE city IS NOT NULL AND city != ''
          AND include_in_leaderboard = true
        `;
        break;
      case LOCATIONS.STATE:
        query = sql`
          SELECT id, city, state, country
          FROM users
          WHERE state IS NOT NULL AND state != ''
          AND include_in_leaderboard = true
        `;
        break;
      case LOCATIONS.COUNTRY:
        query = sql`
          SELECT id, city, state, country
          FROM users
          WHERE country IS NOT NULL AND country != ''
          AND include_in_leaderboard = true
        `;
        break;
      case LOCATIONS.GLOBAL:
        query = sql`
          SELECT id, city, state, country
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

/**
 * Calculate stats for users in a category for a time period
 */
async function calculateUserStats(users, category, periodStart, periodEnd) {
  const userStats = [];

  for (const user of users) {
    let value = 0;

    // Calculate based on category type
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
        // For speed, lower pace is better, so invert for ranking
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

      // Mood categories
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

      // Temperature categories
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
      value,
      location: user,
    });
  }

  return userStats;
}

/**
 * Process cross-location promotion (e.g., City Apex → State Scout)
 */
async function processCrossLocationPromotion(
  userId,
  category,
  fromLocation,
  toLocation,
  fromTier,
  periodStart,
  periodEnd,
  value,
  unit,
) {
  try {
    // Determine starting tier for new location
    const toTier = STARTING_TIER[toLocation];

    // Update to starting tier in the new location
    await updateUserTier(
      userId,
      category,
      toLocation,
      toTier,
      fromLocation,
      fromTier,
    );

    // Award badge for the cross-location promotion
    const badgeAwarded = getBadgeForPromotion(fromTier, fromLocation, category);

    // Record the promotion
    const promotion = await recordTierPromotion({
      userId,
      category,
      fromLocation,
      fromTier,
      toLocation,
      toTier,
      promotionType: "cross_location_promotion",
      badgeAwarded,
      periodStart,
      periodEnd,
      value,
      unit,
    });

    // Send notification about cross-location promotion
    await sendCrossLocationNotification(
      userId,
      category,
      fromLocation,
      fromTier,
      toLocation,
      toTier,
    );

    return promotion;
  } catch (error) {
    console.error("Error processing cross-location promotion:", error);
    return null;
  }
}

/**
 * Send notification for cross-location promotions
 */
async function sendCrossLocationNotification(
  userId,
  category,
  fromLocation,
  fromTier,
  toLocation,
  toTier,
) {
  try {
    const tierNames = {
      [TIERS.SCOUT]: "Scout",
      [TIERS.RANGER]: "Ranger",
      [TIERS.APEX]: "Apex",
      [TIERS.LEGEND]: "Legend",
    };

    const locationNames = {
      [LOCATIONS.CITY]: "City",
      [LOCATIONS.STATE]: "State",
      [LOCATIONS.COUNTRY]: "Country",
      [LOCATIONS.GLOBAL]: "Global",
    };

    const categoryDisplay =
      category.charAt(0).toUpperCase() + category.slice(1);

    const title = `🚀 Advanced to ${locationNames[toLocation]}!`;
    const message = `You've advanced from ${locationNames[fromLocation]} ${tierNames[fromTier]} to ${locationNames[toLocation]} ${tierNames[toTier]} in ${categoryDisplay}!`;

    await sql`
      INSERT INTO notifications (user_id, type, title, message)
      VALUES (${userId}, 'tier_change', ${title}, ${message})
    `;
  } catch (error) {
    console.error("Error sending cross-location notification:", error);
  }
}

/**
 * Send notification to user about tier change
 */
async function sendTierChangeNotification(
  userId,
  category,
  fromTier,
  toTier,
  location,
  promotionType,
  tierPromotionId,
) {
  try {
    // Use the helper function to create notification with tier_promotion_id
    await createTierPromotionNotification(userId, tierPromotionId);
  } catch (error) {
    console.error("Error sending tier change notification:", error);
    // Don't throw - notification failure shouldn't stop promotion
  }
}
