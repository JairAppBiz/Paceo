// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * Update user's goal
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, category, target, period } = body;

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    // Validate inputs
    if (
      category &&
      ![
        "miles",
        "runs",
        "elevation",
        "speed",
        "time",
        "calories",
        "steps",
      ].includes(category)
    ) {
      return Response.json({ error: "Invalid category" }, { status: 400 });
    }

    if (period && !["week", "month", "year"].includes(period)) {
      return Response.json({ error: "Invalid period" }, { status: 400 });
    }

    if (target !== null && target !== undefined && target < 0) {
      return Response.json(
        { error: "Target must be positive" },
        { status: 400 },
      );
    }

    // Update user's goal
    await sql`
      UPDATE users
      SET 
        goal_category = ${category},
        goal_target = ${target},
        goal_period = ${period}
      WHERE id = ${userId}
    `;

    // Fetch updated user
    const userResult = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `;

    return Response.json({
      success: true,
      user: userResult[0],
    });
  } catch (error) {
    console.error("Error updating goal:", error);
    return Response.json({ error: "Failed to update goal" }, { status: 500 });
  }
}
