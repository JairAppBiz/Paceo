// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { createMedalNotification } from "@/app/api/utils/notificationHelpers";

/**
 * Award medals based on leaderboard standings
 * This endpoint should be called when a leaderboard period ends
 * (weekly, monthly, yearly, or all-time)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { period, category, isGlobal = false, location = null } = body;

    if (!period || !category) {
      return Response.json(
        { error: "Period and category are required" },
        { status: 400 },
      );
    }

    // Determine the date range for this period
    const now = new Date();
    let startDate, endDate;

    if (period === "Weekly") {
      // Get the start of last week (Monday)
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      const dayOfWeek = lastWeek.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
      startDate = new Date(lastWeek);
      startDate.setDate(lastWeek.getDate() - diff);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);
    } else if (period === "Monthly") {
      // Get last month
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      return Response.json(
        { error: "Invalid period - only Weekly and Monthly are supported" },
        { status: 400 },
      );
    }

    // Build the leaderboard query based on category
    let leaderboardQuery;
    let valueColumn;
    let unitColumn;

    switch (category) {
      case "miles":
        valueColumn = "SUM(distance)";
        unitColumn = "mi";
        break;
      case "runs":
        valueColumn = "COUNT(*)";
        unitColumn = "runs";
        break;
      case "elevation":
        valueColumn = "SUM(elevation_gain)";
        unitColumn = "ft";
        break;
      case "speed":
        valueColumn = "AVG(pace)";
        unitColumn = "mph";
        break;
      case "time":
        valueColumn = "SUM(duration)";
        unitColumn = "min";
        break;
      case "calories":
        valueColumn = "SUM(calories)";
        unitColumn = "kcal";
        break;
      case "steps":
        valueColumn = "SUM(steps)";
        unitColumn = "steps";
        break;
      case "heat":
        valueColumn = "AVG(temperature)";
        unitColumn = "°F";
        break;
      case "icy":
        valueColumn = "AVG(temperature)";
        unitColumn = "°F";
        break;
      // Mood-based categories
      case "unstoppable":
      case "relaxed":
      case "grinding":
      case "focused":
      case "happy":
      case "meh":
      case "clearing":
      case "race":
        valueColumn = "COUNT(*)";
        unitColumn = "runs";
        break;
      default:
        return Response.json({ error: "Invalid category" }, { status: 400 });
    }

    // Build WHERE clause for mood-based categories
    let moodFilter = "";
    const moodCategories = [
      "unstoppable",
      "relaxed",
      "grinding",
      "focused",
      "happy",
      "meh",
      "clearing",
      "race",
    ];
    if (moodCategories.includes(category)) {
      moodFilter = `AND mood = '${category}'`;
    }

    // Get leaderboard rankings
    const leaderboardQueryStr = `
      SELECT 
        user_id,
        ${valueColumn} as value,
        RANK() OVER (ORDER BY ${valueColumn} DESC) as rank
      FROM runs
      WHERE date >= $1 AND date < $2
      ${moodFilter}
      ${isGlobal ? "" : location ? `AND location LIKE '%${location}%'` : ""}
      GROUP BY user_id
      HAVING ${valueColumn} > 0
      ORDER BY value DESC
      LIMIT 100
    `;

    const leaderboard = await sql(leaderboardQueryStr, [startDate, endDate]);

    // Award medals to top 100
    const medalsAwarded = [];
    for (const entry of leaderboard) {
      if (entry.rank <= 100) {
        // Check if medal already exists
        const existingMedals = await sql`
          SELECT id FROM medals
          WHERE user_id = ${entry.user_id}
          AND category = ${category}
          AND period = ${period}
          AND period_start_date = ${startDate}
          AND period_end_date = ${endDate}
          AND is_global = ${isGlobal}
        `;

        if (existingMedals.length === 0) {
          const newMedals = await sql`
            INSERT INTO medals (
              user_id, 
              category, 
              period, 
              rank_achieved, 
              is_global,
              period_start_date,
              period_end_date,
              awarded_date,
              value,
              unit
            )
            VALUES (
              ${entry.user_id},
              ${category},
              ${period},
              ${entry.rank},
              ${isGlobal},
              ${startDate},
              ${endDate},
              NOW(),
              ${entry.value},
              ${unitColumn}
            )
            RETURNING *
          `;
          medalsAwarded.push(newMedals[0]);

          // Create notification for the medal
          await createMedalNotification(entry.user_id, newMedals[0].id);
        }
      }
    }

    return Response.json({
      success: true,
      medalsAwarded: medalsAwarded.length,
      medals: medalsAwarded,
      period,
      category,
      isGlobal,
      location,
    });
  } catch (error) {
    console.error("Error awarding medals:", error);
    return Response.json({ error: "Failed to award medals" }, { status: 500 });
  }
}
