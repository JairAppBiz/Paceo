// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId"));

    if (!userId) {
      return Response.json({ error: "userId required" }, { status: 400 });
    }

    // Get all runs for this user
    const runs = await sql`
      SELECT distance, duration, pace
      FROM runs
      WHERE user_id = ${userId}
        AND duration IS NOT NULL
        AND duration > 0
      ORDER BY date DESC
    `;

    // Helper function to find best time for a specific distance (in miles)
    const findBestTime = (targetDistance) => {
      const matchingRuns = runs.filter((run) => {
        const dist = parseFloat(run.distance);
        // Allow 2% tolerance for distance matching
        return dist >= targetDistance * 0.98 && dist <= targetDistance * 1.02;
      });

      if (matchingRuns.length === 0) return null;

      // Find the run with fastest time (lowest duration)
      const bestRun = matchingRuns.reduce((best, current) => {
        return parseFloat(current.duration) < parseFloat(best.duration)
          ? current
          : best;
      });

      return parseInt(bestRun.duration); // Return duration in seconds
    };

    // Helper function to format time as MM:SS or H:MM:SS
    const formatTime = (seconds) => {
      if (!seconds) return null;
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      }
      return `${minutes}:${String(secs).padStart(2, "0")}`;
    };

    // Calculate personal bests for standard distances
    const best1K = findBestTime(0.621371); // 1K = 0.621 miles
    const best1Mile = findBestTime(1.0);
    const best5K = findBestTime(3.10686); // 5K = 3.107 miles
    const best10K = findBestTime(6.21371); // 10K = 6.214 miles
    const bestHalf = findBestTime(13.1094); // Half marathon = 13.109 miles
    const bestMarathon = findBestTime(26.2188); // Marathon = 26.219 miles

    // Find longest run
    let longestRun = 0;
    if (runs.length > 0) {
      longestRun = runs.reduce((max, run) => {
        return Math.max(max, parseFloat(run.distance));
      }, 0);
    }

    return Response.json({
      "1k": formatTime(best1K),
      "1mile": formatTime(best1Mile),
      "5k": formatTime(best5K),
      "10k": formatTime(best10K),
      half: formatTime(bestHalf),
      marathon: formatTime(bestMarathon),
      longestRun: longestRun.toFixed(2),
    });
  } catch (error) {
    console.error("Error fetching personal bests:", error);
    return Response.json(
      { error: "Failed to fetch personal bests" },
      { status: 500 },
    );
  }
}
