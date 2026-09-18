// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { canViewPrivateContent } from "@/app/api/utils/privacyHelpers";

export async function GET(request) {
  try {
    const session = await auth();
    const viewerId = session?.user?.id || null;

    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId"));

    if (!userId) {
      return Response.json({ error: "userId required" }, { status: 400 });
    }

    // Check privacy settings
    const canView = await canViewPrivateContent(userId, viewerId);
    if (!canView) {
      return Response.json(
        { error: "This profile is private" },
        { status: 403 },
      );
    }

    // Get podium count (top 3 finishes)
    const podiumResult = await sql`
      SELECT COUNT(*) as podium_count
      FROM medals
      WHERE user_id = ${userId}
        AND rank_achieved <= 3
    `;
    const podiumCount = parseInt(podiumResult[0]?.podium_count || 0);

    // Get total medals
    const medalResult = await sql`
      SELECT COUNT(*) as medal_count
      FROM medals
      WHERE user_id = ${userId}
    `;
    const medalCount = parseInt(medalResult[0]?.medal_count || 0);

    // Get miles this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const monthlyResult = await sql`
      SELECT COALESCE(SUM(distance), 0) as monthly_miles
      FROM runs
      WHERE user_id = ${userId}
        AND date >= ${startOfMonth.toISOString()}
        AND date <= ${endOfMonth.toISOString()}
    `;
    const monthlyMiles = parseFloat(monthlyResult[0]?.monthly_miles || 0);

    // Calculate current streak
    const runsResult = await sql`
      SELECT DATE(date) as run_date
      FROM runs
      WHERE user_id = ${userId}
      ORDER BY date DESC
    `;

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    if (runsResult.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const runDates = runsResult.map((r) => {
        const d = new Date(r.run_date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      });

      // Remove duplicates (same day runs)
      const uniqueDates = [...new Set(runDates)].sort((a, b) => b - a);

      // Calculate current streak
      let checkDate = today.getTime();
      for (const runDate of uniqueDates) {
        const diffDays = Math.floor(
          (checkDate - runDate) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 0 || diffDays === 1) {
          currentStreak++;
          checkDate = runDate;
        } else {
          break;
        }
      }

      // Calculate longest streak
      tempStreak = 1;
      longestStreak = 1;

      for (let i = 1; i < uniqueDates.length; i++) {
        const diffDays = Math.floor(
          (uniqueDates[i - 1] - uniqueDates[i]) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
    }

    return Response.json({
      podiums: podiumCount,
      medals: medalCount,
      monthlyMiles: monthlyMiles,
      currentStreak: currentStreak,
      longestStreak: longestStreak,
    });
  } catch (error) {
    console.error("Error fetching profile stats:", error);
    return Response.json(
      { error: "Failed to fetch profile stats" },
      { status: 500 },
    );
  }
}
