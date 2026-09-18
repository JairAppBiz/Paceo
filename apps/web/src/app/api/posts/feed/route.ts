// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    const viewerId = session?.user?.id || null;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get feed posts with user info, run details, achievement details, like count, and user's like status
    // Exclude posts from private profiles unless the viewer is following them
    const posts = await sql`
      SELECT 
        p.id,
        p.post_type,
        p.caption,
        p.image_url,
        p.hidden_stats,
        p.primary_stats,
        p.created_at,
        u.id as user_id,
        u.username,
        u.profile_image,
        r.distance as run_distance,
        r.duration as run_duration,
        r.pace as run_pace,
        r.date as run_date,
        r.elevation_gain as run_elevation,
        r.calories as run_calories,
        r.temperature as run_temperature,
        r.mood as run_mood,
        a.name as achievement_name,
        a.description as achievement_description,
        a.icon as achievement_icon,
        m.id as medal_id,
        m.category as medal_category,
        m.period as medal_period,
        m.rank_achieved as medal_rank,
        m.is_global as medal_is_global,
        m.tier as medal_tier,
        m.location as medal_location,
        m.value as medal_value,
        m.unit as medal_unit,
        tp.id as promotion_id,
        tp.category as promotion_category,
        tp.from_location as promotion_from_location,
        tp.from_tier as promotion_from_tier,
        tp.to_location as promotion_to_location,
        tp.to_tier as promotion_to_tier,
        tp.promotion_type,
        tp.badge_awarded as promotion_badge,
        tp.value as promotion_value,
        tp.unit as promotion_unit,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
        ${userId ? sql`(SELECT COUNT(*) > 0 FROM likes WHERE post_id = p.id AND user_id = ${userId})` : sql`false`} as user_liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN runs r ON p.run_id = r.id
      LEFT JOIN achievements a ON p.achievement_id = a.id
      LEFT JOIN medals m ON p.medal_id = m.id
      LEFT JOIN tier_promotions tp ON p.tier_promotion_id = tp.id
      WHERE (
        u.profile_private = false
        OR p.user_id = ${viewerId || 0}
        OR EXISTS (
          SELECT 1 FROM followers 
          WHERE follower_id = ${viewerId || 0} 
          AND following_id = p.user_id 
          AND status = 'accepted'
        )
      )
      ORDER BY p.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    return Response.json({ posts });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return Response.json({ error: "Failed to fetch feed" }, { status: 500 });
  }
}
