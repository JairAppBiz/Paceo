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
    const limit = parseInt(searchParams.get("limit")) || 50;
    const offset = parseInt(searchParams.get("offset")) || 0;

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

    // Get all runs for the user with associated post data if it exists
    const runs = await sql`
      SELECT 
        r.*,
        p.id as post_id,
        p.caption,
        p.image_url,
        p.hidden_stats,
        p.primary_stats,
        p.like_count,
        p.comment_count
      FROM runs r
      LEFT JOIN posts p ON p.run_id = r.id AND p.user_id = r.user_id
      WHERE r.user_id = ${userId}
      ORDER BY r.date DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM runs
      WHERE user_id = ${userId}
    `;

    const total = parseInt(countResult[0].total);

    return Response.json({
      runs: runs.map((run) => ({
        id: run.id,
        userId: run.user_id,
        distance: parseFloat(run.distance),
        duration: run.duration,
        pace: run.pace ? parseFloat(run.pace) : null,
        steps: run.steps,
        cadence: run.cadence ? parseFloat(run.cadence) : null,
        calories: run.calories ? parseFloat(run.calories) : null,
        elevationGain: run.elevation_gain
          ? parseFloat(run.elevation_gain)
          : null,
        temperature: run.temperature ? parseFloat(run.temperature) : null,
        mood: run.mood,
        date: run.date,
        location: run.location,
        notes: run.notes,
        createdAt: run.created_at,
        post: run.post_id
          ? {
              id: run.post_id,
              caption: run.caption,
              imageUrl: run.image_url,
              hiddenStats: run.hidden_stats,
              primaryStats: run.primary_stats,
              likeCount: run.like_count,
              commentCount: run.comment_count,
            }
          : null,
      })),
      total,
      hasMore: offset + runs.length < total,
    });
  } catch (error) {
    console.error("Error fetching runs:", error);
    return Response.json({ error: "Failed to fetch runs" }, { status: 500 });
  }
}
