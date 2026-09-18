// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { userId, medalIds } = await request.json();

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // Validate medalIds is an array
    if (!Array.isArray(medalIds)) {
      return Response.json(
        { error: "Medal IDs must be an array" },
        { status: 400 },
      );
    }

    // Limit to 3 medals
    const limitedMedalIds = medalIds.slice(0, 3);

    // Update user's displayed medals
    const result = await sql`
      UPDATE users
      SET displayed_medals = ${JSON.stringify(limitedMedalIds)}
      WHERE id = ${userId}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      user: result[0],
    });
  } catch (error) {
    console.error("Error updating displayed medals:", error);
    return Response.json(
      { error: "Failed to update displayed medals" },
      { status: 500 },
    );
  }
}
