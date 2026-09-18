// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import {
  getUserTierForCategory,
  isUserExcludedFromCategory,
  isFunCategory,
} from "@/app/api/utils/tierHelpers";

/**
 * Get tier progress for a user in a specific category
 * Shows current rank, tier, and progress toward promotion/demotion
 *
 * NOTE: This uses the EXACT SAME SQL query as the leaderboard to ensure
 * rank and values match exactly
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const period = searchParams.get("period") || "week";
    const userIdParam = searchParams.get("userId");

    if (!category) {
      return Response.json({ error: "category is required" }, { status: 400 });
    }

    let userId;

    // If userId provided, use it (for mobile)
    if (userIdParam) {
      userId = parseInt(userIdParam);
    } else {
      // Otherwise use auth session (for web)
      const session = await auth();
      if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Get user's app user ID from auth
      const userResult = await sql`
        SELECT id FROM users WHERE auth_user_id = ${session.user.id}
      `;

      if (userResult.length === 0) {
        return Response.json({ error: "User not found" }, { status: 404 });
      }

      userId = userResult[0].id;
    }

    // Check if user excluded this category
    const isExcluded = await isUserExcludedFromCategory(userId, category);
    if (isExcluded) {
      return Response.json({
        excluded: true,
        message: "You have excluded this category from leaderboards",
      });
    }

    // Check if this is a fun category (city-only, no tiers)
    const isFun = isFunCategory(category);

    // Get user's location for filtering
    const userResult =
      await sql`SELECT city, state, country FROM users WHERE id = ${userId}`;
    if (userResult.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    const userLocation = userResult[0];
    const userCity = userLocation.city;

    // Calculate date range based on period - SAME AS LEADERBOARD
    let dateFilter = "";
    if (period === "week") {
      dateFilter = "AND r.date >= NOW() - INTERVAL '7 days'";
    } else if (period === "month") {
      dateFilter = "AND r.date >= NOW() - INTERVAL '30 days'";
    } else if (period === "year") {
      dateFilter = "AND r.date >= NOW() - INTERVAL '365 days'";
    }

    // Build location filter - SAME AS LEADERBOARD
    let locationFilter = "";
    if (userCity) {
      locationFilter = `AND u.city = '${userCity}' AND u.include_in_leaderboard = true`;
    }

    // Build query based on category - SAME AS LEADERBOARD
    let query = "";
    let unit = "";

    switch (category) {
      case "miles":
        query = `
          SELECT 
            u.id,
            SUM(r.distance) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE 1=1 ${dateFilter} ${locationFilter}
          GROUP BY u.id
          ORDER BY value DESC, earliest_run_date ASC
        `;
        unit = "mi";
        break;

      case "runs":
        query = `
          SELECT 
            u.id,
            COUNT(r.id) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE 1=1 ${dateFilter} ${locationFilter}
          GROUP BY u.id
          ORDER BY value DESC, earliest_run_date ASC
        `;
        unit = "runs";
        break;

      case "steps":
        query = `
          SELECT 
            u.id,
            SUM(r.steps) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE r.steps IS NOT NULL ${dateFilter} ${locationFilter}
          GROUP BY u.id
          ORDER BY value DESC, earliest_run_date ASC
        `;
        unit = "steps";
        break;

      case "speed":
        query = `
          SELECT 
            u.id,
            AVG(r.pace) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE r.pace IS NOT NULL AND r.pace > 0 ${dateFilter} ${locationFilter}
          GROUP BY u.id
          ORDER BY value ASC, earliest_run_date ASC
        `;
        unit = "min/mi";
        break;

      case "time":
        query = `
          SELECT 
            u.id,
            SUM(r.duration) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE 1=1 ${dateFilter} ${locationFilter}
          GROUP BY u.id
          ORDER BY value DESC, earliest_run_date ASC
        `;
        unit = "min";
        break;

      case "calories":
        query = `
          SELECT 
            u.id,
            SUM(r.calories) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE r.calories IS NOT NULL ${dateFilter} ${locationFilter}
          GROUP BY u.id
          ORDER BY value DESC, earliest_run_date ASC
        `;
        unit = "kcal";
        break;

      case "elevation":
        query = `
          SELECT 
            u.id,
            SUM(r.elevation_gain) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE r.elevation_gain IS NOT NULL ${dateFilter} ${locationFilter}
          GROUP BY u.id
          ORDER BY value DESC, earliest_run_date ASC
        `;
        unit = "ft";
        break;

      case "icy":
        query = `
          SELECT 
            u.id,
            MIN(r.temperature) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE r.temperature IS NOT NULL ${dateFilter} ${locationFilter}
          GROUP BY u.id
          ORDER BY value ASC, earliest_run_date ASC
        `;
        unit = "°F";
        break;

      case "heat":
        query = `
          SELECT 
            u.id,
            MAX(r.temperature) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE r.temperature IS NOT NULL ${dateFilter} ${locationFilter}
          GROUP BY u.id
          ORDER BY value DESC, earliest_run_date ASC
        `;
        unit = "°F";
        break;

      case "unstoppable":
      case "relaxed":
      case "grinding":
      case "focused":
      case "happy":
      case "meh":
      case "clearing":
      case "race":
        query = `
          SELECT 
            u.id,
            COUNT(CASE WHEN r.mood = '${category}' THEN 1 END)::numeric as mood_count,
            COUNT(r.id)::numeric as total_count,
            (COUNT(CASE WHEN r.mood = '${category}' THEN 1 END)::numeric / COUNT(r.id)::numeric * 100) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE 1=1 ${dateFilter} ${locationFilter}
          GROUP BY u.id
          HAVING COUNT(r.id) > 0
          ORDER BY value DESC, earliest_run_date ASC
        `;
        unit = "%";
        break;

      default:
        return Response.json({ error: "Invalid category" }, { status: 400 });
    }

    // Execute the EXACT SAME query as leaderboard
    const results = await sql(query);

    // Find current user's rank
    const userIndex = results.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      // User has no runs in this period
      return Response.json({
        tier: isFun
          ? null
          : (await getUserTierForCategory(userId, category))?.tier || "scout",
        location: isFun
          ? "city"
          : (await getUserTierForCategory(userId, category))?.location ||
            "city",
        category,
        rank: null,
        totalUsers: results.length,
        value: 0,
        unit,
        isFunCategory: isFun,
      });
    }

    const currentUserData = results[userIndex];
    const rank = userIndex + 1;

    // Format value the same way as leaderboard
    let formattedValue;
    if (category === "time") {
      formattedValue = Math.floor(parseFloat(currentUserData.value) / 60); // Convert seconds to minutes
    } else if (unit === "%") {
      formattedValue = parseFloat(currentUserData.value).toFixed(1);
    } else {
      formattedValue = parseFloat(currentUserData.value).toFixed(
        category === "speed" || category === "miles" || category === "elevation"
          ? 1
          : 0,
      );
    }

    // Calculate thresholds for promotion/demotion zones
    const promotionIndex = Math.ceil(results.length * 0.15) - 1;
    const promotionThreshold =
      promotionIndex >= 0 && promotionIndex < results.length
        ? parseFloat(results[promotionIndex].value).toFixed(
            category === "speed" ||
              category === "miles" ||
              category === "elevation"
              ? 1
              : 0,
          )
        : null;

    const demotionIndex = Math.floor(results.length * 0.9);
    const demotionThreshold =
      demotionIndex >= 0 && demotionIndex < results.length
        ? parseFloat(results[demotionIndex].value).toFixed(
            category === "speed" ||
              category === "miles" ||
              category === "elevation"
              ? 1
              : 0,
          )
        : null;

    // Get tier info for display (fun categories don't have tiers)
    let tierInfo = null;
    if (!isFun) {
      tierInfo = await getUserTierForCategory(userId, category);
    }

    return Response.json({
      tier: isFun ? null : tierInfo?.tier || "scout",
      location: isFun ? "city" : tierInfo?.location || "city",
      category,
      rank,
      totalUsers: results.length,
      value: formattedValue,
      unit,
      nextTierThreshold: promotionThreshold,
      demotionThreshold: demotionThreshold,
      isFunCategory: isFun,
    });
  } catch (error) {
    console.error("Error getting tier progress:", error);
    return Response.json(
      { error: "Failed to get tier progress" },
      { status: 500 },
    );
  }
}
