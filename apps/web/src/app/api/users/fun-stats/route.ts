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

    // Get all runs with necessary data
    const runs = await sql`
      SELECT pace, mood, distance, elevation_gain, duration
      FROM runs
      WHERE user_id = ${userId}
        AND pace IS NOT NULL
        AND pace > 0
      ORDER BY date DESC
    `;

    if (runs.length === 0) {
      return Response.json({
        signaturePace: 0,
        runVibesScore: 0,
        vibesMessage: "No data yet",
        fastestSegments: {
          sprint10sec: 0,
          burst30sec: 0,
          hillPace: 0,
        },
        efficiencyBreakdown: {
          cardio: 0,
          endurance: 0,
          speed: 0,
        },
      });
    }

    // Calculate Signature Pace (median pace)
    const paces = runs.map((r) => parseFloat(r.pace)).sort((a, b) => a - b);
    const midIndex = Math.floor(paces.length / 2);
    const signaturePace =
      paces.length % 2 !== 0
        ? paces[midIndex]
        : (paces[midIndex - 1] + paces[midIndex]) / 2;

    // Calculate Run Vibes Score (based on mood data)
    const moodScores = {
      great: 100,
      good: 75,
      okay: 50,
      tired: 25,
      poor: 10,
    };

    let totalVibesScore = 0;
    let vibesCount = 0;
    runs.forEach((run) => {
      if (run.mood && moodScores[run.mood.toLowerCase()]) {
        totalVibesScore += moodScores[run.mood.toLowerCase()];
        vibesCount++;
      }
    });

    const runVibesScore =
      vibesCount > 0 ? Math.round(totalVibesScore / vibesCount) : 50;

    let vibesMessage = "Keep it up!";
    if (runVibesScore >= 90) vibesMessage = "You're on fire! 🔥";
    else if (runVibesScore >= 75) vibesMessage = "Feeling great! 💪";
    else if (runVibesScore >= 60) vibesMessage = "Good vibes! ✨";
    else if (runVibesScore >= 40) vibesMessage = "Keep going! 🌟";
    else vibesMessage = "Every run counts! 💙";

    // Calculate Fastest Segments (estimated based on pace data)
    // 10 sec sprint: estimate based on best pace * 0.7
    // 30 sec burst: estimate based on best pace * 0.8
    // Hill pace: estimate based on runs with elevation * 1.15
    const bestPace = Math.min(...paces);
    const sprint10sec = (bestPace * 0.7).toFixed(1);
    const burst30sec = (bestPace * 0.8).toFixed(1);

    const hillRuns = runs.filter((r) => parseFloat(r.elevation_gain || 0) > 50);
    const hillPace =
      hillRuns.length > 0
        ? (
            hillRuns.reduce((sum, r) => sum + parseFloat(r.pace), 0) /
            hillRuns.length
          ).toFixed(1)
        : (bestPace * 1.15).toFixed(1);

    // Calculate Efficiency Breakdown
    // Cardio: based on consistent runs (frequency)
    // Endurance: based on longer distances
    // Speed: based on faster paces

    const avgDistance =
      runs.reduce((sum, r) => sum + parseFloat(r.distance), 0) / runs.length;
    const avgPace =
      runs.reduce((sum, r) => sum + parseFloat(r.pace), 0) / runs.length;

    // Cardio: frequency-based (more runs = better cardio)
    const cardioPercentage = Math.min(
      100,
      Math.round((runs.length / 100) * 100),
    );

    // Endurance: distance-based (longer runs = better endurance)
    const endurancePercentage = Math.min(
      100,
      Math.round((avgDistance / 10) * 100),
    );

    // Speed: pace-based (faster pace = better speed)
    const speedPercentage = Math.max(
      0,
      Math.min(100, Math.round((1 - avgPace / 15) * 100)),
    );

    return Response.json({
      signaturePace: signaturePace.toFixed(1),
      runVibesScore,
      vibesMessage,
      fastestSegments: {
        sprint10sec,
        burst30sec,
        hillPace,
      },
      efficiencyBreakdown: {
        cardio: cardioPercentage,
        endurance: endurancePercentage,
        speed: speedPercentage,
      },
    });
  } catch (error) {
    console.error("Error fetching fun stats:", error);
    return Response.json(
      { error: "Failed to fetch fun stats" },
      { status: 500 },
    );
  }
}
