// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    // Get the start of the current week (Sunday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    // Fetch runs for the current week
    const runs = await sql`
      SELECT id, date
      FROM runs
      WHERE user_id = ${userId}
        AND date >= ${startOfWeek.toISOString()}
      ORDER BY date DESC
    `;

    return Response.json({ runs });
  } catch (error) {
    console.error("Error fetching weekly runs:", error);
    return Response.json(
      { error: "Failed to fetch weekly runs" },
      { status: 500 },
    );
  }
}
