// @ts-nocheck
import sql from "@/app/api/utils/sql";

/**
 * Calculate goal progress for a user
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    // Get user's goal
    const userResult = await sql`
      SELECT goal_category, goal_target, goal_period
      FROM users
      WHERE id = ${userId}
    `;

    if (userResult.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResult[0];

    // If no goal set, return null
    if (!user.goal_category || !user.goal_target || !user.goal_period) {
      return Response.json({
        hasGoal: false,
        progress: null,
      });
    }

    // Calculate period dates
    const now = new Date();
    let periodStart, periodEnd;

    if (user.goal_period === "week") {
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek;
      periodStart = new Date(now.setDate(diff));
      periodStart.setHours(0, 0, 0, 0);
      periodEnd = new Date(periodStart);
      periodEnd.setDate(periodEnd.getDate() + 7);
    } else if (user.goal_period === "month") {
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodEnd = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
      );
    } else if (user.goal_period === "year") {
      periodStart = new Date(now.getFullYear(), 0, 1);
      periodEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    }

    // Calculate current value based on category
    let currentValue = 0;

    switch (user.goal_category) {
      case "miles":
        const milesResult = await sql`
          SELECT COALESCE(SUM(distance), 0) as total
          FROM runs
          WHERE user_id = ${userId}
          AND date >= ${periodStart.toISOString()}
          AND date <= ${periodEnd.toISOString()}
        `;
        currentValue = parseFloat(milesResult[0]?.total || 0);
        break;

      case "runs":
        const runsResult = await sql`
          SELECT COUNT(*) as total
          FROM runs
          WHERE user_id = ${userId}
          AND date >= ${periodStart.toISOString()}
          AND date <= ${periodEnd.toISOString()}
        `;
        currentValue = parseInt(runsResult[0]?.total || 0);
        break;

      case "elevation":
        const elevationResult = await sql`
          SELECT COALESCE(SUM(elevation_gain), 0) as total
          FROM runs
          WHERE user_id = ${userId}
          AND date >= ${periodStart.toISOString()}
          AND date <= ${periodEnd.toISOString()}
        `;
        currentValue = parseFloat(elevationResult[0]?.total || 0);
        break;

      case "speed":
        // For speed, we want average pace
        const speedResult = await sql`
          SELECT COALESCE(AVG(pace), 0) as avg_pace
          FROM runs
          WHERE user_id = ${userId}
          AND date >= ${periodStart.toISOString()}
          AND date <= ${periodEnd.toISOString()}
          AND pace IS NOT NULL AND pace > 0
        `;
        currentValue = parseFloat(speedResult[0]?.avg_pace || 0);
        break;

      case "time":
        const timeResult = await sql`
          SELECT COALESCE(SUM(duration), 0) as total
          FROM runs
          WHERE user_id = ${userId}
          AND date >= ${periodStart.toISOString()}
          AND date <= ${periodEnd.toISOString()}
        `;
        currentValue = parseInt(timeResult[0]?.total || 0);
        break;

      case "calories":
        const caloriesResult = await sql`
          SELECT COALESCE(SUM(calories), 0) as total
          FROM runs
          WHERE user_id = ${userId}
          AND date >= ${periodStart.toISOString()}
          AND date <= ${periodEnd.toISOString()}
        `;
        currentValue = parseFloat(caloriesResult[0]?.total || 0);
        break;

      case "steps":
        const stepsResult = await sql`
          SELECT COALESCE(SUM(steps), 0) as total
          FROM runs
          WHERE user_id = ${userId}
          AND date >= ${periodStart.toISOString()}
          AND date <= ${periodEnd.toISOString()}
        `;
        currentValue = parseInt(stepsResult[0]?.total || 0);
        break;
    }

    // Calculate progress percentage
    const target = parseFloat(user.goal_target);
    const progressPercentage = target > 0 ? (currentValue / target) * 100 : 0;

    return Response.json({
      hasGoal: true,
      category: user.goal_category,
      target: target,
      period: user.goal_period,
      currentValue: currentValue,
      progressPercentage: Math.min(progressPercentage, 100), // Cap at 100%
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
    });
  } catch (error) {
    console.error("Error calculating goal progress:", error);
    return Response.json(
      { error: "Failed to calculate goal progress" },
      { status: 500 },
    );
  }
}
