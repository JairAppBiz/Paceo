// @ts-nocheck
import sql from "@/app/api/utils/sql";
import {
  getUserTierForCategory,
  updateUserTier,
  recordTierPromotion,
  calculateTierFromRank,
  shouldPromoteToNextLocation,
  getNextLocation,
  determinePromotionType,
  getBadgeForPromotion,
  awardPodiumMedal,
  isUserExcludedFromCategory,
  CATEGORIES,
  LOCATIONS,
  LOCATION_TIERS,
  STARTING_TIER,
} from "@/app/api/utils/tierHelpers";

/**
 * Monthly cron job endpoint - processes tier promotions/demotions for the previous month
 * Protected by secret key for external cron services
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { secret } = body;

    // Protect with secret key
    if (secret !== process.env.CRON_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const period = "month";
    const results = {
      period,
      processedAt: new Date().toISOString(),
      totalPromotions: 0,
      totalDemotions: 0,
      totalPodiumMedals: 0,
      categoryResults: {},
    };

    // Calculate previous month dates
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const periodStart = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth(),
      1,
    );
    const periodEnd = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth() + 1,
      0,
    );
    periodEnd.setHours(23, 59, 59, 999);

    console.log(
      `Processing monthly tier changes for period: ${periodStart.toISOString()} to ${periodEnd.toISOString()}`,
    );

    // Process each category
    for (const category of CATEGORIES) {
      console.log(`\n--- Processing category: ${category} ---`);

      const categoryResults = {
        promotions: 0,
        demotions: 0,
        podiumMedals: 0,
        locations: {},
      };

      // Process each location level
      for (const location of Object.values(LOCATIONS)) {
        console.log(`Processing ${location} leaderboard for ${category}`);

        const locationResults = {
          totalUsers: 0,
          promotions: [],
          demotions: [],
          podiumMedals: [],
        };

        // Get all users in this location with stats
        const userStats = await calculateUserStats(
          location,
          category,
          periodStart.toISOString(),
          periodEnd.toISOString(),
        );

        locationResults.totalUsers = userStats.length;

        if (userStats.length === 0) {
          console.log(`No users found in ${location} for ${category}`);
          continue;
        }

        // Process tier changes for each user
        for (const userStat of userStats) {
          const { userId, value, rank } = userStat;

          // Get current tier
          const currentTierInfo = await getUserTierForCategory(
            userId,
            category,
          );
          if (!currentTierInfo) continue;

          const currentTier = currentTierInfo.tier;
          const currentLocation = currentTierInfo.location;

          // Check if should be promoted to next location
          if (
            shouldPromoteToNextLocation(
              rank,
              userStats.length,
              currentTier,
              location,
            )
          ) {
            const nextLocation = getNextLocation(location);
            if (nextLocation) {
              const newTier = STARTING_TIER[nextLocation];

              // Update tier
              await updateUserTier(
                userId,
                category,
                nextLocation,
                newTier,
                currentLocation,
                currentTier,
              );

              // Record promotion
              const promotionType = determinePromotionType(
                currentLocation,
                currentTier,
                nextLocation,
                newTier,
              );
              const badge = getBadgeForPromotion(
                newTier,
                nextLocation,
                category,
              );

              await recordTierPromotion({
                userId,
                category,
                fromLocation: currentLocation,
                fromTier: currentTier,
                toLocation: nextLocation,
                toTier: newTier,
                promotionType,
                badgeAwarded: badge,
                periodStart: periodStart.toISOString(),
                periodEnd: periodEnd.toISOString(),
              });

              locationResults.promotions.push({
                userId,
                from: `${currentLocation} ${currentTier}`,
                to: `${nextLocation} ${newTier}`,
                badge,
              });

              categoryResults.promotions++;
              results.totalPromotions++;

              console.log(
                `Cross-location promotion: User ${userId} from ${currentLocation} ${currentTier} to ${nextLocation} ${newTier}`,
              );

              // Create notification
              await sql`
                INSERT INTO notifications (
                  user_id, type, title, message
                )
                VALUES (
                  ${userId},
                  'tier_promotion',
                  'Tier Promotion! 🎉',
                  ${`You've been promoted from ${currentLocation} ${currentTier} to ${nextLocation} ${newTier} in ${category}!`}
                )
              `;
            }
          } else {
            // Calculate new tier within same location
            const newTier = calculateTierFromRank(
              rank,
              userStats.length,
              currentTier,
              location,
            );

            if (newTier !== currentTier) {
              // Update tier
              await updateUserTier(
                userId,
                category,
                location,
                newTier,
                location,
                currentTier,
              );

              // Record promotion/demotion
              const promotionType = determinePromotionType(
                location,
                currentTier,
                location,
                newTier,
              );
              const badge =
                promotionType === "promotion"
                  ? getBadgeForPromotion(newTier, location, category)
                  : null;

              await recordTierPromotion({
                userId,
                category,
                fromLocation: location,
                fromTier: currentTier,
                toLocation: location,
                toTier: newTier,
                promotionType,
                badgeAwarded: badge,
                periodStart: periodStart.toISOString(),
                periodEnd: periodEnd.toISOString(),
              });

              if (promotionType === "promotion") {
                locationResults.promotions.push({
                  userId,
                  from: `${location} ${currentTier}`,
                  to: `${location} ${newTier}`,
                  badge,
                });
                categoryResults.promotions++;
                results.totalPromotions++;

                // Create notification
                await sql`
                  INSERT INTO notifications (
                    user_id, type, title, message
                  )
                  VALUES (
                    ${userId},
                    'tier_promotion',
                    'Tier Promotion! 🎉',
                    ${`You've been promoted to ${newTier} in ${category}!`}
                  )
                `;
              } else {
                locationResults.demotions.push({
                  userId,
                  from: `${location} ${currentTier}`,
                  to: `${location} ${newTier}`,
                });
                categoryResults.demotions++;
                results.totalDemotions++;

                // Create notification
                await sql`
                  INSERT INTO notifications (
                    user_id, type, title, message
                  )
                  VALUES (
                    ${userId},
                    'tier_demotion',
                    'Tier Update',
                    ${`Your tier has changed to ${newTier} in ${category}.`}
                  )
                `;
              }

              console.log(
                `Tier ${promotionType}: User ${userId} from ${currentTier} to ${newTier} in ${location} ${category}`,
              );
            }
          }

          // Award podium medals (top 3)
          if (rank <= 3) {
            const medal = await awardPodiumMedal({
              userId,
              category,
              location,
              rank,
              value,
              unit: getCategoryUnit(category),
              periodStart: periodStart.toISOString(),
              periodEnd: periodEnd.toISOString(),
              period,
            });

            if (medal) {
              locationResults.podiumMedals.push({
                userId,
                rank,
                medalType: medal.tier,
              });
              categoryResults.podiumMedals++;
              results.totalPodiumMedals++;

              // Create notification
              const medalEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";
              await sql`
                INSERT INTO notifications (
                  user_id, type, title, message, related_medal_id
                )
                VALUES (
                  ${userId},
                  'medal_earned',
                  ${`${medalEmoji} Monthly Medal Earned!`},
                  ${`You finished #${rank} in ${category} for ${location}!`},
                  ${medal.id}
                )
              `;

              console.log(
                `Awarded ${medal.tier} medal to user ${userId} for rank ${rank} in ${location} ${category}`,
              );
            }
          }
        }

        categoryResults.locations[location] = locationResults;
      }

      results.categoryResults[category] = categoryResults;
    }

    console.log("\n=== Monthly Tier Processing Complete ===");
    console.log(`Total Promotions: ${results.totalPromotions}`);
    console.log(`Total Demotions: ${results.totalDemotions}`);
    console.log(`Total Podium Medals: ${results.totalPodiumMedals}`);

    return Response.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Error processing monthly tiers:", error);
    return Response.json(
      { error: "Failed to process monthly tiers", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * Calculate user stats for a category in a location
 */
async function calculateUserStats(location, category, periodStart, periodEnd) {
  // Get users based on location
  let users;

  switch (location) {
    case LOCATIONS.CITY:
      users = await sql`
        SELECT u.id, u.city, u.state, u.country
        FROM users u
        INNER JOIN user_tiers ut ON u.id = ut.user_id
        WHERE ut.location = 'city'
        AND ut.category = ${category}
        AND u.city IS NOT NULL
        AND u.include_in_leaderboard = true
      `;
      break;
    case LOCATIONS.STATE:
      users = await sql`
        SELECT u.id, u.city, u.state, u.country
        FROM users u
        INNER JOIN user_tiers ut ON u.id = ut.user_id
        WHERE ut.location = 'state'
        AND ut.category = ${category}
        AND u.state IS NOT NULL
        AND u.include_in_leaderboard = true
      `;
      break;
    case LOCATIONS.COUNTRY:
      users = await sql`
        SELECT u.id, u.city, u.state, u.country
        FROM users u
        INNER JOIN user_tiers ut ON u.id = ut.user_id
        WHERE ut.location = 'country'
        AND ut.category = ${category}
        AND u.country IS NOT NULL
        AND u.include_in_leaderboard = true
      `;
      break;
    case LOCATIONS.GLOBAL:
      users = await sql`
        SELECT u.id, u.city, u.state, u.country
        FROM users u
        INNER JOIN user_tiers ut ON u.id = ut.user_id
        WHERE ut.location = 'global'
        AND ut.category = ${category}
        AND u.include_in_leaderboard = true
      `;
      break;
    default:
      return [];
  }

  // Group users by their actual location (city/state/country) for proper leaderboards
  const locationGroups = new Map();

  for (const user of users) {
    let locationKey;
    switch (location) {
      case LOCATIONS.CITY:
        locationKey = `${user.city}|${user.state}|${user.country}`;
        break;
      case LOCATIONS.STATE:
        locationKey = `${user.state}|${user.country}`;
        break;
      case LOCATIONS.COUNTRY:
        locationKey = user.country;
        break;
      case LOCATIONS.GLOBAL:
        locationKey = "global";
        break;
    }

    if (!locationGroups.has(locationKey)) {
      locationGroups.set(locationKey, []);
    }
    locationGroups.get(locationKey).push(user);
  }

  // Calculate stats for each location group
  const allUserStats = [];

  for (const [locationKey, locationUsers] of locationGroups) {
    const userStats = [];

    for (const user of locationUsers) {
      // Check if user excluded this category
      const isExcluded = await isUserExcludedFromCategory(user.id, category);
      if (isExcluded) continue;

      let value = 0;

      // Calculate based on category type
      value = await calculateCategoryValue(
        user.id,
        category,
        periodStart,
        periodEnd,
      );

      userStats.push({
        userId: user.id,
        value,
      });
    }

    // Sort by value descending
    userStats.sort((a, b) => b.value - a.value);

    // Add ranks within this location
    userStats.forEach((stat, index) => {
      stat.rank = index + 1;
    });

    allUserStats.push(...userStats);
  }

  return allUserStats;
}

/**
 * Calculate value for a category
 */
async function calculateCategoryValue(
  userId,
  category,
  periodStart,
  periodEnd,
) {
  let value = 0;

  switch (category) {
    case "miles":
      const milesResult = await sql`
        SELECT COALESCE(SUM(distance), 0) as total
        FROM runs
        WHERE user_id = ${userId}
        AND date >= ${periodStart}
        AND date <= ${periodEnd}
      `;
      value = parseFloat(milesResult[0]?.total || 0);
      break;

    case "runs":
      const runsResult = await sql`
        SELECT COUNT(*) as total
        FROM runs
        WHERE user_id = ${userId}
        AND date >= ${periodStart}
        AND date <= ${periodEnd}
      `;
      value = parseInt(runsResult[0]?.total || 0);
      break;

    case "elevation":
      const elevationResult = await sql`
        SELECT COALESCE(SUM(elevation_gain), 0) as total
        FROM runs
        WHERE user_id = ${userId}
        AND date >= ${periodStart}
        AND date <= ${periodEnd}
      `;
      value = parseFloat(elevationResult[0]?.total || 0);
      break;

    case "speed":
      const speedResult = await sql`
        SELECT COALESCE(MIN(pace), 999999) as best_pace
        FROM runs
        WHERE user_id = ${userId}
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
        WHERE user_id = ${userId}
        AND date >= ${periodStart}
        AND date <= ${periodEnd}
      `;
      value = parseInt(timeResult[0]?.total || 0);
      break;

    case "calories":
      const caloriesResult = await sql`
        SELECT COALESCE(SUM(calories), 0) as total
        FROM runs
        WHERE user_id = ${userId}
        AND date >= ${periodStart}
        AND date <= ${periodEnd}
      `;
      value = parseFloat(caloriesResult[0]?.total || 0);
      break;

    case "steps":
      const stepsResult = await sql`
        SELECT COALESCE(SUM(steps), 0) as total
        FROM runs
        WHERE user_id = ${userId}
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
        WHERE user_id = ${userId}
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
        WHERE user_id = ${userId}
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
        WHERE user_id = ${userId}
        AND temperature <= 32
        AND date >= ${periodStart}
        AND date <= ${periodEnd}
      `;
      value = parseInt(icyResult[0]?.total || 0);
      break;

    default:
      value = 0;
  }

  return value;
}

/**
 * Get unit for a category
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
