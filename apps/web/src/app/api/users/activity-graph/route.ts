// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { canViewPrivateContent } from "@/app/api/utils/privacyHelpers";

export async function GET(request) {
  const session = await auth();
  const viewerId = session?.user?.id || null;

  const { searchParams } = new URL(request.url);
  const userId = parseInt(searchParams.get("userId"));
  const period = searchParams.get("period") || "weekly"; // weekly, monthly, yearly, all
  const filterDate = searchParams.get("filterDate"); // ISO date string

  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  // Check privacy settings
  const canView = await canViewPrivateContent(userId, viewerId);
  if (!canView) {
    return Response.json({ error: "This profile is private" }, { status: 403 });
  }

  try {
    // Determine date range based on period and filterDate
    let startDate, endDate;
    const now = filterDate ? new Date(filterDate) : new Date();

    if (period === "weekly") {
      // Get the week containing the filterDate
      const dayOfWeek = now.getDay();
      startDate = new Date(now);
      startDate.setDate(now.getDate() - dayOfWeek); // Start of week (Sunday)
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6); // End of week (Saturday)
      endDate.setHours(23, 59, 59, 999);
    } else if (period === "monthly") {
      // Get the month containing the filterDate
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
    } else if (period === "yearly") {
      // Get the year containing the filterDate
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else {
      // All time - no date filter
      startDate = null;
      endDate = null;
    }

    // Build query based on period
    let query, params;

    if (period === "weekly") {
      // Group by day of week
      query = `
        SELECT 
          TO_CHAR(date, 'Dy') as label,
          EXTRACT(DOW FROM date) as day_num,
          SUM(distance) as total_distance,
          COUNT(*) as run_count,
          SUM(duration) as total_duration
        FROM runs
        WHERE user_id = $1
          AND date >= $2
          AND date <= $3
        GROUP BY TO_CHAR(date, 'Dy'), EXTRACT(DOW FROM date)
        ORDER BY day_num
      `;
      params = [userId, startDate, endDate];
    } else if (period === "monthly") {
      // Group by day of month
      query = `
        SELECT 
          EXTRACT(DAY FROM date) as label,
          EXTRACT(DAY FROM date) as day_num,
          SUM(distance) as total_distance,
          COUNT(*) as run_count,
          SUM(duration) as total_duration
        FROM runs
        WHERE user_id = $1
          AND date >= $2
          AND date <= $3
        GROUP BY EXTRACT(DAY FROM date)
        ORDER BY day_num
      `;
      params = [userId, startDate, endDate];
    } else if (period === "yearly") {
      // Group by month
      query = `
        SELECT 
          TO_CHAR(date, 'Mon') as label,
          EXTRACT(MONTH FROM date) as month_num,
          SUM(distance) as total_distance,
          COUNT(*) as run_count,
          SUM(duration) as total_duration
        FROM runs
        WHERE user_id = $1
          AND date >= $2
          AND date <= $3
        GROUP BY TO_CHAR(date, 'Mon'), EXTRACT(MONTH FROM date)
        ORDER BY month_num
      `;
      params = [userId, startDate, endDate];
    } else {
      // All time - group by year
      query = `
        SELECT 
          EXTRACT(YEAR FROM date)::text as label,
          EXTRACT(YEAR FROM date) as year_num,
          SUM(distance) as total_distance,
          COUNT(*) as run_count,
          SUM(duration) as total_duration
        FROM runs
        WHERE user_id = $1
        GROUP BY EXTRACT(YEAR FROM date)
        ORDER BY year_num
      `;
      params = [userId];
    }

    const graphData = await sql(query, params);

    // Get totals for the period
    const totalsQuery = startDate
      ? sql`
          SELECT 
            COALESCE(SUM(distance), 0) as total_distance,
            COUNT(*) as total_runs,
            COALESCE(SUM(duration), 0) as total_duration,
            CASE 
              WHEN COUNT(*) > 0 THEN AVG(pace)
              ELSE 0
            END as avg_pace
          FROM runs
          WHERE user_id = ${userId}
            AND date >= ${startDate}
            AND date <= ${endDate}
        `
      : sql`
          SELECT 
            COALESCE(SUM(distance), 0) as total_distance,
            COUNT(*) as total_runs,
            COALESCE(SUM(duration), 0) as total_duration,
            CASE 
              WHEN COUNT(*) > 0 THEN AVG(pace)
              ELSE 0
            END as avg_pace
          FROM runs
          WHERE user_id = ${userId}
        `;

    const [totals] = await totalsQuery;

    // Format graph data for the chart
    const formattedGraphData = graphData.map((row) => ({
      label: row.label,
      value: parseFloat(row.total_distance) || 0,
      runs: parseInt(row.run_count) || 0,
      duration: parseInt(row.total_duration) || 0,
    }));

    return Response.json({
      graphData: formattedGraphData,
      stats: {
        totalDistance: parseFloat(totals.total_distance) || 0,
        totalRuns: parseInt(totals.total_runs) || 0,
        totalDuration: parseInt(totals.total_duration) || 0,
        avgPace: parseFloat(totals.avg_pace) || 0,
      },
      period,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching activity graph data:", error);
    return Response.json(
      { error: "Failed to fetch activity graph data" },
      { status: 500 },
    );
  }
}
