// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { canViewPrivateContent } from "@/app/api/utils/privacyHelpers";

export async function GET(request) {
  try {
    const session = await auth();
    const viewerId = session?.user?.id || null;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const period = searchParams.get("period") || "all"; // all, year, month, week

    if (!userId) {
      return Response.json({ error: "User ID required" }, { status: 400 });
    }

    // Check privacy settings
    const canView = await canViewPrivateContent(parseInt(userId), viewerId);
    if (!canView) {
      return Response.json(
        { error: "This profile is private" },
        { status: 403 },
      );
    }

    // Calculate date range based on period
    let dateFilter = "";
    if (period === "week") {
      dateFilter = "AND date >= NOW() - INTERVAL '7 days'";
    } else if (period === "month") {
      dateFilter = "AND date >= NOW() - INTERVAL '30 days'";
    } else if (period === "year") {
      dateFilter = "AND date >= NOW() - INTERVAL '365 days'";
    }

    // Get comprehensive stats with period filter
    const query = `
      SELECT 
        COALESCE(SUM(distance), 0) as total_distance,
        COUNT(*) as total_runs,
        COALESCE(AVG(pace), 0) as avg_pace,
        COALESCE(SUM(duration), 0) as total_time,
        COALESCE(SUM(calories), 0) as total_calories,
        COALESCE(SUM(elevation_gain), 0) as total_elevation
      FROM runs
      WHERE user_id = $1 ${dateFilter}
    `;

    const results = await sql(query, [userId]);
    const stats = results[0];

    return Response.json({
      distance: parseFloat(stats.total_distance).toFixed(1),
      runs: parseInt(stats.total_runs),
      avgPace: parseFloat(stats.avg_pace).toFixed(1),
      totalTime: Math.floor(parseFloat(stats.total_time) / 60), // Convert seconds to minutes
      calories: parseInt(stats.total_calories),
      elevation: parseInt(stats.total_elevation),
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
