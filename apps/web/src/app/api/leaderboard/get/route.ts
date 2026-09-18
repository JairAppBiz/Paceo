// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { getUserTierForCategory, LOCATIONS } from "@/app/api/utils/tierHelpers";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "miles";
    const period = searchParams.get("period") || "week";
    const userId = parseInt(searchParams.get("userId")) || null;

    // Get user's location for filtering
    let userLocation = null;
    let userCity = null;
    if (userId) {
      const userResult =
        await sql`SELECT city, state, country FROM users WHERE id = ${userId}`;
      if (userResult.length > 0) {
        userLocation = userResult[0];
        userCity = userLocation.city;
      }
    }

    // Calculate date range based on period
    let dateFilter = "";
    if (period === "week") {
      dateFilter = "AND r.date >= NOW() - INTERVAL '7 days'";
    } else if (period === "month") {
      dateFilter = "AND r.date >= NOW() - INTERVAL '30 days'";
    } else if (period === "year") {
      dateFilter = "AND r.date >= NOW() - INTERVAL '365 days'";
    }

    // Build location filter - show users in the same city
    let locationFilter = "";
    if (userCity) {
      locationFilter = `AND u.city = '${userCity}' AND u.include_in_leaderboard = true`;
    }

    let query = "";
    let valueLabel = "";
    let unit = "";

    // Build query based on category
    switch (category) {
      case "miles":
        query = `
          SELECT 
            u.id,
            u.username,
            u.profile_image,
            SUM(r.distance) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE 1=1 ${dateFilter} ${locationFilter}
          GROUP BY u.id, u.username, u.profile_image
          ORDER BY value DESC, earliest_run_date ASC
          LIMIT 50
        `;
        valueLabel = "distance";
        unit = "mi";
        break;

      case "runs":
        query = `
          SELECT 
            u.id,
            u.username,
            u.profile_image,
            COUNT(r.id) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE 1=1 ${dateFilter} ${locationFilter}
          GROUP BY u.id, u.username, u.profile_image
          ORDER BY value DESC, earliest_run_date ASC
          LIMIT 50
        `;
        valueLabel = "runs";
        unit = "runs";
        break;

      case "steps":
        query = `
          SELECT 
            u.id,
            u.username,
            u.profile_image,
            SUM(r.steps) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE r.steps IS NOT NULL ${dateFilter} ${locationFilter}
          GROUP BY u.id, u.username, u.profile_image
          ORDER BY value DESC, earliest_run_date ASC
          LIMIT 50
        `;
        valueLabel = "steps";
        unit = "steps";
        break;

      case "earlybird":
        // Count runs that started before 6am
        query = `
          SELECT 
            u.id,
            u.username,
            u.profile_image,
            COUNT(r.id) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE EXTRACT(HOUR FROM r.date) < 6 ${dateFilter} ${locationFilter}
          GROUP BY u.id, u.username, u.profile_image
          ORDER BY value DESC, earliest_run_date ASC
          LIMIT 50
        `;
        valueLabel = "early_runs";
        unit = "runs";
        break;

      case "nightowl":
        // Count runs that started after 8pm (20:00)
        query = `
          SELECT 
            u.id,
            u.username,
            u.profile_image,
            COUNT(r.id) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE EXTRACT(HOUR FROM r.date) >= 20 ${dateFilter} ${locationFilter}
          GROUP BY u.id, u.username, u.profile_image
          ORDER BY value DESC, earliest_run_date ASC
          LIMIT 50
        `;
        valueLabel = "night_runs";
        unit = "runs";
        break;

      case "petpaced":
        // Sum total miles with pet
        query = `
          SELECT 
            u.id,
            u.username,
            u.profile_image,
            SUM(r.distance) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE r.with_pet = true ${dateFilter} ${locationFilter}
          GROUP BY u.id, u.username, u.profile_image
          ORDER BY value DESC, earliest_run_date ASC
          LIMIT 50
        `;
        valueLabel = "pet_miles";
        unit = "mi";
        break;

      case "speed":
        // Fastest average pace (lower is better)
        query = `
          SELECT 
            u.id,
            u.username,
            u.profile_image,
            AVG(r.pace) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE r.pace IS NOT NULL AND r.pace > 0 ${dateFilter} ${locationFilter}
          GROUP BY u.id, u.username, u.profile_image
          ORDER BY value ASC, earliest_run_date ASC
          LIMIT 50
        `;
        valueLabel = "pace";
        unit = "min/mi";
        break;

      case "time":
        query = `
          SELECT 
            u.id,
            u.username,
            u.profile_image,
            SUM(r.duration) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE 1=1 ${dateFilter} ${locationFilter}
          GROUP BY u.id, u.username, u.profile_image
          ORDER BY value DESC, earliest_run_date ASC
          LIMIT 50
        `;
        valueLabel = "duration";
        unit = "min";
        break;

      case "calories":
        query = `
          SELECT 
            u.id,
            u.username,
            u.profile_image,
            SUM(r.calories) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE r.calories IS NOT NULL ${dateFilter} ${locationFilter}
          GROUP BY u.id, u.username, u.profile_image
          ORDER BY value DESC, earliest_run_date ASC
          LIMIT 50
        `;
        valueLabel = "calories";
        unit = "kcal";
        break;

      case "elevation":
        query = `
          SELECT 
            u.id,
            u.username,
            u.profile_image,
            SUM(r.elevation_gain) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE r.elevation_gain IS NOT NULL ${dateFilter} ${locationFilter}
          GROUP BY u.id, u.username, u.profile_image
          ORDER BY value DESC, earliest_run_date ASC
          LIMIT 50
        `;
        valueLabel = "elevation";
        unit = "ft";
        break;

      case "icy":
        // Coldest temperature (lowest is best)
        query = `
          SELECT 
            u.id,
            u.username,
            u.profile_image,
            MIN(r.temperature) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE r.temperature IS NOT NULL ${dateFilter} ${locationFilter}
          GROUP BY u.id, u.username, u.profile_image
          ORDER BY value ASC, earliest_run_date ASC
          LIMIT 50
        `;
        valueLabel = "temperature";
        unit = "°F";
        break;

      case "heat":
        // Hottest temperature (highest is best)
        query = `
          SELECT 
            u.id,
            u.username,
            u.profile_image,
            MAX(r.temperature) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE r.temperature IS NOT NULL ${dateFilter} ${locationFilter}
          GROUP BY u.id, u.username, u.profile_image
          ORDER BY value DESC, earliest_run_date ASC
          LIMIT 50
        `;
        valueLabel = "temperature";
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
        // Calculate percentage of runs with this mood
        query = `
          SELECT 
            u.id,
            u.username,
            u.profile_image,
            COUNT(CASE WHEN r.mood = '${category}' THEN 1 END)::numeric as mood_count,
            COUNT(r.id)::numeric as total_count,
            (COUNT(CASE WHEN r.mood = '${category}' THEN 1 END)::numeric / COUNT(r.id)::numeric * 100) as value,
            MIN(r.date) as earliest_run_date
          FROM users u
          JOIN runs r ON u.id = r.user_id
          WHERE 1=1 ${dateFilter} ${locationFilter}
          GROUP BY u.id, u.username, u.profile_image
          HAVING COUNT(r.id) > 0
          ORDER BY value DESC, earliest_run_date ASC
          LIMIT 50
        `;
        valueLabel = "mood_percentage";
        unit = "%";
        break;

      default:
        return Response.json({ error: "Invalid category" }, { status: 400 });
    }

    // Execute query
    const results = await sql(query);

    // Add ranking and format values
    const leaderboard = results.map((row, index) => ({
      rank: index + 1,
      id: row.id,
      username: row.username,
      profileImage: row.profile_image,
      value:
        category === "time"
          ? Math.floor(parseFloat(row.value) / 60) // Convert seconds to minutes
          : unit === "%"
            ? parseFloat(row.value).toFixed(1) // One decimal for percentages
            : parseFloat(row.value).toFixed(
                category === "speed" ||
                  category === "miles" ||
                  category === "elevation"
                  ? 1
                  : 0,
              ),
      unit,
      isCurrentUser: userId ? row.id === userId : false,
    }));

    // Find current user's rank (always return if userId provided)
    let currentUserRank = null;
    if (userId) {
      const userInTop = leaderboard.find((u) => u.id === userId);
      if (userInTop) {
        // User is in top 50 - use their data from leaderboard
        currentUserRank = userInTop;
      } else {
        // User is NOT in top 50 - query for their specific rank
        const userQuery = query.replace("LIMIT 50", ""); // Remove limit to get all users

        const allResults = await sql(userQuery);
        const userIndex = allResults.findIndex((u) => u.id === userId);
        if (userIndex !== -1) {
          currentUserRank = {
            rank: userIndex + 1,
            id: allResults[userIndex].id,
            username: allResults[userIndex].username,
            profileImage: allResults[userIndex].profile_image,
            value:
              category === "time"
                ? Math.floor(parseFloat(allResults[userIndex].value) / 60)
                : unit === "%"
                  ? parseFloat(allResults[userIndex].value).toFixed(1)
                  : parseFloat(allResults[userIndex].value).toFixed(
                      category === "speed" ||
                        category === "miles" ||
                        category === "elevation"
                        ? 1
                        : 0,
                    ),
            unit,
            isCurrentUser: true,
          };
        }
      }
    }

    return Response.json({
      leaderboard,
      currentUserRank,
      totalUsers: results.length,
      category,
      period,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return Response.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
