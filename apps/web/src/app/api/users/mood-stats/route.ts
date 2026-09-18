// @ts-nocheck
import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId"));

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    // Get mood distribution
    const moodStats = await sql`
      SELECT 
        mood,
        COUNT(*) as count,
        ROUND(AVG(distance), 2) as avg_distance
      FROM runs
      WHERE user_id = ${userId}
        AND mood IS NOT NULL
      GROUP BY mood
      ORDER BY count DESC
    `;

    // Get total runs with mood
    const totalWithMood = moodStats.reduce(
      (sum, stat) => sum + parseInt(stat.count),
      0,
    );

    // Calculate percentages
    const moodData = moodStats.map((stat) => ({
      mood: stat.mood,
      count: parseInt(stat.count),
      percentage:
        totalWithMood > 0
          ? Math.round((parseInt(stat.count) / totalWithMood) * 100)
          : 0,
      avgDistance: parseFloat(stat.avg_distance),
    }));

    return Response.json({ moodStats: moodData, totalWithMood });
  } catch (error) {
    console.error("Error fetching mood stats:", error);
    return Response.json(
      { error: "Failed to fetch mood stats" },
      { status: 500 },
    );
  }
}
