// @ts-nocheck
import sql from "@/app/api/utils/sql";

/**
 * Mark a medal as displayed to the user
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { medalId } = body;

    if (!medalId) {
      return Response.json({ error: "Medal ID required" }, { status: 400 });
    }

    // Update the medal to mark it as displayed
    await sql`
      UPDATE medals
      SET displayed_at = NOW()
      WHERE id = ${medalId}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error marking medal as displayed:", error);
    return Response.json(
      { error: "Failed to mark medal as displayed" },
      { status: 500 },
    );
  }
}
