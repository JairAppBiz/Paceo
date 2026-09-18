// @ts-nocheck
import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";
import { canViewPrivateContent } from "@/app/api/utils/privacyHelpers";

export async function GET(request) {
  try {
    const session = await auth();
    const viewerId = session?.user?.id || null;

    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId"));

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    // Check privacy settings
    const canView = await canViewPrivateContent(userId, viewerId);
    if (!canView) {
      return Response.json(
        { error: "This profile is private" },
        { status: 403 },
      );
    }

    // Get best efforts for standard distances
    // Distance categories in miles: 0.62 (1km), 1, 3.1 (5km), 6.2 (10km), 13.1 (half), 26.2 (marathon)
    const distances = [
      { name: "1K", miles: 0.62, range: 0.05 },
      { name: "1 Mile", miles: 1, range: 0.05 },
      { name: "5K", miles: 3.1, range: 0.1 },
      { name: "10K", miles: 6.2, range: 0.2 },
      { name: "Half Marathon", miles: 13.1, range: 0.3 },
      { name: "Marathon", miles: 26.2, range: 0.5 },
    ];

    const bestEfforts = [];

    for (const dist of distances) {
      const result = await sql`
        SELECT 
          id,
          distance,
          duration,
          pace,
          date,
          (duration / distance) as time_per_mile
        FROM runs
        WHERE user_id = ${userId}
          AND distance >= ${dist.miles - dist.range}
          AND distance <= ${dist.miles + dist.range}
          AND duration IS NOT NULL
          AND duration > 0
        ORDER BY time_per_mile ASC
        LIMIT 1
      `;

      if (result.length > 0) {
        bestEfforts.push({
          distance: dist.name,
          targetMiles: dist.miles,
          actualDistance: parseFloat(result[0].distance),
          duration: result[0].duration,
          pace: parseFloat(result[0].pace),
          date: result[0].date,
          runId: result[0].id,
        });
      }
    }

    return Response.json({ bestEfforts });
  } catch (error) {
    console.error("Error fetching best efforts:", error);
    return Response.json(
      { error: "Failed to fetch best efforts" },
      { status: 500 },
    );
  }
}
