// @ts-nocheck
import sql from "@/app/api/utils/sql";

// Tier system constants
export const TIERS = {
  SCOUT: "scout",
  RANGER: "ranger",
  APEX: "apex",
  LEGEND: "legend",
};

export const LOCATIONS = {
  CITY: "city",
  STATE: "state",
  COUNTRY: "country",
  GLOBAL: "global",
};

// Tier structure by location
// CITY: Scout → Ranger → Apex → (promote to STATE Scout)
// STATE: Scout → Ranger → Apex → (promote to COUNTRY Ranger)
// COUNTRY: Ranger → Apex → (promote to GLOBAL Legend)
// GLOBAL: Legend (only tier)
export const LOCATION_TIERS = {
  [LOCATIONS.CITY]: [TIERS.SCOUT, TIERS.RANGER, TIERS.APEX],
  [LOCATIONS.STATE]: [TIERS.SCOUT, TIERS.RANGER, TIERS.APEX],
  [LOCATIONS.COUNTRY]: [TIERS.RANGER, TIERS.APEX],
  [LOCATIONS.GLOBAL]: [TIERS.LEGEND],
};

// Starting tier for each location
export const STARTING_TIER = {
  [LOCATIONS.CITY]: TIERS.SCOUT,
  [LOCATIONS.STATE]: TIERS.SCOUT,
  [LOCATIONS.COUNTRY]: TIERS.RANGER,
  [LOCATIONS.GLOBAL]: TIERS.LEGEND,
};

// Categories with tier promotions/demotions across all locations
export const TIER_CATEGORIES = [
  "miles",
  "runs",
  "elevation",
  "speed",
  "time",
  "calories",
  "steps",
];

// Fun categories - city-only leaderboards, no tier promotions/demotions
export const FUN_CATEGORIES = [
  "heat",
  "icy",
  "unstoppable",
  "relaxed",
  "grinding",
  "focused",
  "happy",
  "meh",
  "clearing",
  "race",
];

// All categories combined
export const CATEGORIES = [...TIER_CATEGORIES, ...FUN_CATEGORIES];

/**
 * Check if a category has tier promotions
 */
export function isTierCategory(category) {
  return TIER_CATEGORIES.includes(category);
}

/**
 * Check if a category is a fun category (city-only, no tiers)
 */
export function isFunCategory(category) {
  return FUN_CATEGORIES.includes(category);
}

/**
 * Initialize tiers for a new user - only tier categories start at City Scout
 * Fun categories don't have tiers
 */
export async function initializeUserTiers(userId) {
  try {
    // Only initialize tiers for tier categories
    const values = TIER_CATEGORIES.map((category) => ({
      userId,
      category,
      location: LOCATIONS.CITY,
      tier: TIERS.SCOUT,
    }));

    const insertQuery = `
      INSERT INTO user_tiers (user_id, category, location, tier)
      VALUES ${values.map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(", ")}
      ON CONFLICT (user_id, category) DO NOTHING
      RETURNING *
    `;

    const flatValues = values.flatMap((v) => [
      v.userId,
      v.category,
      v.location,
      v.tier,
    ]);

    const result = await sql(insertQuery, flatValues);
    return result;
  } catch (error) {
    console.error("Error initializing user tiers:", error);
    throw error;
  }
}

/**
 * Get all tiers for a user
 */
export async function getUserTiers(userId) {
  try {
    const tiers = await sql`
      SELECT * FROM user_tiers
      WHERE user_id = ${userId}
      ORDER BY category
    `;
    return tiers;
  } catch (error) {
    console.error("Error getting user tiers:", error);
    throw error;
  }
}

/**
 * Get tier for a specific category
 */
export async function getUserTierForCategory(userId, category) {
  try {
    const result = await sql`
      SELECT * FROM user_tiers
      WHERE user_id = ${userId} AND category = ${category}
      LIMIT 1
    `;
    return result[0] || null;
  } catch (error) {
    console.error("Error getting user tier for category:", error);
    throw error;
  }
}

/**
 * Update a user's tier for a category
 */
export async function updateUserTier(
  userId,
  category,
  newLocation,
  newTier,
  oldLocation = null,
  oldTier = null,
) {
  try {
    const result = await sql`
      UPDATE user_tiers
      SET 
        location = ${newLocation},
        tier = ${newTier},
        updated_at = NOW()
      WHERE user_id = ${userId} AND category = ${category}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error("Error updating user tier:", error);
    throw error;
  }
}

/**
 * Record a tier promotion/demotion
 */
export async function recordTierPromotion({
  userId,
  category,
  fromLocation,
  fromTier,
  toLocation,
  toTier,
  promotionType,
  badgeAwarded = null,
  periodStart,
  periodEnd,
  value = null,
  unit = null,
}) {
  try {
    const result = await sql`
      INSERT INTO tier_promotions (
        user_id, category, from_location, from_tier, 
        to_location, to_tier, promotion_type, badge_awarded,
        period_start, period_end, value, unit
      )
      VALUES (
        ${userId}, ${category}, ${fromLocation}, ${fromTier},
        ${toLocation}, ${toTier}, ${promotionType}, ${badgeAwarded},
        ${periodStart}, ${periodEnd}, ${value}, ${unit}
      )
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error("Error recording tier promotion:", error);
    throw error;
  }
}

/**
 * Get promotion history for a user
 */
export async function getUserPromotionHistory(userId, limit = 20) {
  try {
    const promotions = await sql`
      SELECT * FROM tier_promotions
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return promotions;
  } catch (error) {
    console.error("Error getting promotion history:", error);
    throw error;
  }
}

/**
 * Calculate what tier a user should be in based on their rank
 * Top 15% get promoted, bottom 10% get demoted
 */
export function calculateTierFromRank(rank, totalUsers, currentTier, location) {
  const tiers = LOCATION_TIERS[location];
  const currentTierIndex = tiers.indexOf(currentTier);

  if (currentTierIndex === -1) {
    return currentTier; // Invalid tier, no change
  }

  const percentile = (rank / totalUsers) * 100;

  // Top 15% get promoted (unless already at highest tier in location)
  if (percentile <= 15) {
    if (currentTierIndex < tiers.length - 1) {
      return tiers[currentTierIndex + 1]; // Promote to next tier
    }
    return currentTier; // Already at top tier
  }

  // Bottom 10% get demoted (unless at lowest tier)
  if (percentile > 90) {
    if (currentTierIndex > 0) {
      return tiers[currentTierIndex - 1]; // Demote to previous tier
    }
    return currentTier; // Already at lowest tier (can't go below City Scout)
  }

  // Middle 75% stay in current tier
  return currentTier;
}

/**
 * Check if user should be promoted to next location
 * Only happens if user is at top tier of current location AND in top 15%
 */
export function shouldPromoteToNextLocation(
  rank,
  totalUsers,
  currentTier,
  location,
) {
  const tiers = LOCATION_TIERS[location];
  const topTier = tiers[tiers.length - 1];

  // Must be at top tier of current location
  if (currentTier !== topTier) {
    return false;
  }

  // Must be in top 15%
  const percentile = (rank / totalUsers) * 100;
  return percentile <= 15;
}

/**
 * Get the next location in the hierarchy
 */
export function getNextLocation(currentLocation) {
  const locationOrder = [
    LOCATIONS.CITY,
    LOCATIONS.STATE,
    LOCATIONS.COUNTRY,
    LOCATIONS.GLOBAL,
  ];

  const currentIndex = locationOrder.indexOf(currentLocation);
  if (currentIndex >= 0 && currentIndex < locationOrder.length - 1) {
    return locationOrder[currentIndex + 1];
  }

  return null; // Already at global
}

/**
 * Determine promotion type based on tier/location changes
 */
export function determinePromotionType(
  fromLocation,
  fromTier,
  toLocation,
  toTier,
) {
  const tierOrder = [TIERS.SCOUT, TIERS.RANGER, TIERS.APEX, TIERS.LEGEND];
  const locationOrder = [
    LOCATIONS.CITY,
    LOCATIONS.STATE,
    LOCATIONS.COUNTRY,
    LOCATIONS.GLOBAL,
  ];

  const fromTierIndex = tierOrder.indexOf(fromTier);
  const toTierIndex = tierOrder.indexOf(toTier);
  const fromLocationIndex = locationOrder.indexOf(fromLocation);
  const toLocationIndex = locationOrder.indexOf(toLocation);

  // Same location tier changes
  if (fromLocation === toLocation) {
    if (toTierIndex > fromTierIndex) {
      return "promotion";
    } else if (toTierIndex < fromTierIndex) {
      return "demotion";
    }
  }

  // Cross-location changes
  if (toLocationIndex > fromLocationIndex) {
    // Moving to higher location
    if (toTierIndex >= fromTierIndex) {
      return "cross_location_promotion";
    } else {
      return "cross_location_demotion";
    }
  } else if (toLocationIndex < fromLocationIndex) {
    // Moving to lower location (usually with tier upgrade)
    return "cross_location_demotion";
  }

  return "no_change";
}

/**
 * Get badge name for a tier promotion
 */
export function getBadgeForPromotion(tier, location, category) {
  // Format: "scout_badge_miles_city" or "legend_badge_elevation_global"
  return `${tier}_badge_${category}_${location}`;
}

/**
 * Get podium medal type for top 3 ranks
 * Returns 'gold', 'silver', 'bronze', or null
 */
export function getPodiumMedalType(rank) {
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "bronze";
  return null;
}

/**
 * Award a podium medal (gold/silver/bronze) to a user
 * This is separate from tier promotion badges
 */
export async function awardPodiumMedal({
  userId,
  category,
  location,
  rank,
  value,
  unit,
  periodStart,
  periodEnd,
  period,
}) {
  try {
    const medalType = getPodiumMedalType(rank);
    if (!medalType) return null;

    const result = await sql`
      INSERT INTO medals (
        user_id, category, period, rank_achieved, 
        is_global, period_start_date, period_end_date, 
        value, unit, tier, location
      )
      VALUES (
        ${userId}, ${category}, ${period}, ${rank},
        ${location === LOCATIONS.GLOBAL}, ${periodStart}, ${periodEnd},
        ${value}, ${unit}, ${medalType}, ${location}
      )
      RETURNING *
    `;

    return result[0];
  } catch (error) {
    console.error("Error awarding podium medal:", error);
    throw error;
  }
}

/**
 * Check if user has excluded a category from leaderboard participation
 */
export async function isUserExcludedFromCategory(userId, category) {
  try {
    const result = await sql`
      SELECT excluded_categories FROM users
      WHERE id = ${userId}
    `;

    if (result.length === 0) return false;

    const excludedCategories = result[0].excluded_categories || [];
    return excludedCategories.includes(category);
  } catch (error) {
    console.error("Error checking category exclusion:", error);
    return false;
  }
}
