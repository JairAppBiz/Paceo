// @ts-nocheck
import sql from "@/app/api/utils/sql";

/**
 * Check if a user has any new medals that haven't been viewed
 * Returns the newest unviewed medal if one exists
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId"));

    if (!userId) {
      return Response.json({ error: "User ID required" }, { status: 400 });
    }

    // Get the newest medal that hasn't been displayed yet
    const newMedals = await sql`
      SELECT * FROM medals
      WHERE user_id = ${userId}
      AND displayed_at IS NULL
      ORDER BY awarded_date DESC
      LIMIT 1
    `;

    if (newMedals.length > 0) {
      return Response.json({
        hasNewMedal: true,
        medal: newMedals[0],
      });
    }

    return Response.json({
      hasNewMedal: false,
      medal: null,
    });
  } catch (error) {
    console.error("Error checking for new medals:", error);
    return Response.json(
      { error: "Failed to check for new medals" },
      { status: 500 },
    );
  }
}
