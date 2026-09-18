// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get all runs for the user
    const runs = await sql`
      SELECT 
        id,
        distance,
        duration,
        pace,
        date,
        mood,
        location,
        calories,
        elevation_gain,
        temperature,
        steps,
        cadence
      FROM runs
      WHERE user_id = ${userId}
      ORDER BY date ASC
    `;

    // Calculate weekly mileage (last 12 weeks)
    const weeklyMileage = await sql`
      SELECT 
        DATE_TRUNC('week', date) as week,
        SUM(distance) as total_distance,
        COUNT(*) as run_count
      FROM runs
      WHERE user_id = ${userId}
        AND date >= NOW() - INTERVAL '12 weeks'
      GROUP BY DATE_TRUNC('week', date)
      ORDER BY week ASC
    `;

    // Get pace trend over time (smoothed by week)
    const paceTrend = await sql`
      SELECT 
        DATE_TRUNC('week', date) as week,
        AVG(pace) as avg_pace,
        MIN(pace) as best_pace
      FROM runs
      WHERE user_id = ${userId}
        AND pace IS NOT NULL
        AND date >= NOW() - INTERVAL '16 weeks'
      GROUP BY DATE_TRUNC('week', date)
      ORDER BY week ASC
    `;

    // Get mood vs performance data
    const moodPerformance = await sql`
      SELECT 
        mood,
        AVG(pace) as avg_pace,
        AVG(distance) as avg_distance,
        COUNT(*) as count
      FROM runs
      WHERE user_id = ${userId}
        AND mood IS NOT NULL
        AND pace IS NOT NULL
      GROUP BY mood
    `;

    // Heatmap calendar data (last 365 days)
    const heatmapData = await sql`
      SELECT 
        DATE(date) as run_date,
        SUM(distance) as total_distance,
        COUNT(*) as run_count
      FROM runs
      WHERE user_id = ${userId}
        AND date >= NOW() - INTERVAL '365 days'
      GROUP BY DATE(date)
      ORDER BY run_date ASC
    `;

    // Personal records timeline
    const personalRecords = await sql`
      SELECT 
        id,
        date,
        distance,
        duration,
        pace
      FROM runs
      WHERE user_id = ${userId}
        AND distance >= 1.0
      ORDER BY date ASC
    `;

    // Calculate PRs for different distances
    const prTimeline = [];
    const distances = [
      { name: "1K", min: 0.9, max: 1.1 },
      { name: "1 Mile", min: 1.5, max: 1.7 },
      { name: "5K", min: 4.8, max: 5.2 },
      { name: "10K", min: 9.8, max: 10.2 },
      { name: "Half Marathon", min: 20.5, max: 21.5 },
      { name: "Marathon", min: 41.5, max: 42.5 },
    ];

    distances.forEach((dist) => {
      const distanceRuns = personalRecords.filter(
        (r) => r.distance >= dist.min && r.distance <= dist.max && r.pace,
      );

      let bestPace = null;
      distanceRuns.forEach((run) => {
        if (!bestPace || run.pace < bestPace.pace) {
          bestPace = run;
          prTimeline.push({
            distance: dist.name,
            date: run.date,
            pace: run.pace,
            duration: run.duration,
          });
        }
      });
    });

    // Pace distribution (histogram)
    const paceDistribution = await sql`
      SELECT 
        FLOOR(pace) as pace_bucket,
        COUNT(*) as count
      FROM runs
      WHERE user_id = ${userId}
        AND pace IS NOT NULL
        AND pace > 0
        AND pace < 15
      GROUP BY FLOOR(pace)
      ORDER BY pace_bucket ASC
    `;

    // Terrain mix (if we had terrain data - for now mock it)
    const terrainMix = {
      road: runs.filter(
        (r) => !r.location || r.location.toLowerCase().includes("road"),
      ).length,
      trail: runs.filter(
        (r) => r.location && r.location.toLowerCase().includes("trail"),
      ).length,
      treadmill: runs.filter(
        (r) => r.location && r.location.toLowerCase().includes("treadmill"),
      ).length,
      other: 0,
    };
    terrainMix.other =
      runs.length - (terrainMix.road + terrainMix.trail + terrainMix.treadmill);

    // Effort balance (based on pace ranges)
    const avgPace =
      runs
        .filter((r) => r.pace)
        .reduce((sum, r) => sum + parseFloat(r.pace), 0) /
        runs.filter((r) => r.pace).length || 8;
    const effortBalance = {
      easy: runs.filter((r) => r.pace && r.pace > avgPace * 1.1).length,
      moderate: runs.filter(
        (r) => r.pace && r.pace >= avgPace * 0.9 && r.pace <= avgPace * 1.1,
      ).length,
      hard: runs.filter((r) => r.pace && r.pace < avgPace * 0.9).length,
    };

    // Monthly distance progression
    const monthlyProgress = await sql`
      SELECT 
        DATE_TRUNC('month', date) as month,
        SUM(distance) as total_distance,
        COUNT(*) as run_count,
        AVG(pace) as avg_pace
      FROM runs
      WHERE user_id = ${userId}
        AND date >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', date)
      ORDER BY month ASC
    `;

    return Response.json({
      weeklyMileage,
      paceTrend,
      moodPerformance,
      heatmapData,
      prTimeline,
      paceDistribution,
      terrainMix,
      effortBalance,
      monthlyProgress,
      totalRuns: runs.length,
    });
  } catch (error) {
    console.error("Error fetching performance graph data:", error);
    return Response.json(
      { error: "Failed to fetch performance data" },
      { status: 500 },
    );
  }
}
