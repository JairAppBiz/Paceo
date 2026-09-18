// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * Test endpoint to simulate receiving a gold medal notification
 */
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's app user ID
    const users = await sql`
      SELECT id FROM users WHERE auth_user_id = ${session.user.id}
    `;

    if (users.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const userId = users[0].id;

    // Create date range for this week
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(now.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Create a gold medal (rank 1) for "most miles"
    const [medal] = await sql`
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
        unit,
        tier,
        location
      )
      VALUES (
        ${userId},
        'miles',
        'Weekly',
        1,
        false,
        ${startOfWeek},
        ${endOfWeek},
        NOW(),
        42.5,
        'mi',
        'gold',
        'New York, NY'
      )
      RETURNING *
    `;

    // Create notification for the medal
    const [notification] = await sql`
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        related_medal_id,
        is_read
      )
      VALUES (
        ${userId},
        'medal',
        '🥇 Gold Medal Earned!',
        'You ranked #1 in miles for this week in New York, NY',
        ${medal.id},
        false
      )
      RETURNING *
    `;

    return Response.json({
      success: true,
      medal,
      notification,
    });
  } catch (error) {
    console.error("Error creating test medal notification:", error);
    return Response.json(
      { error: "Failed to create test medal notification" },
      { status: 500 },
    );
  }
}
