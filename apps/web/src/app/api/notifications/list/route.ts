// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    const notifications = await sql`
      SELECT 
        n.*,
        u.username as related_username,
        u.profile_image as related_user_image,
        p.post_type as related_post_type,
        m.category as medal_category,
        m.period as medal_period,
        m.rank_achieved as medal_rank,
        tp.category as tier_promotion_category,
        tp.from_tier as tier_promotion_from_tier,
        tp.to_tier as tier_promotion_to_tier,
        tp.from_location as tier_promotion_from_location,
        tp.to_location as tier_promotion_to_location,
        tp.promotion_type as tier_promotion_type,
        r.distance as run_distance,
        r.duration as run_duration,
        r.pace as run_pace
      FROM notifications n
      LEFT JOIN users u ON n.related_user_id = u.id
      LEFT JOIN posts p ON n.related_post_id = p.id
      LEFT JOIN medals m ON n.related_medal_id = m.id
      LEFT JOIN tier_promotions tp ON n.related_tier_promotion_id = tp.id
      LEFT JOIN runs r ON n.related_run_id = r.id
      WHERE n.user_id = ${userId}
      ORDER BY n.created_at DESC
      LIMIT ${limit}
    `;

    const unreadCount = await sql`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = ${userId} AND is_read = false
    `;

    return Response.json({
      notifications,
      unreadCount: parseInt(unreadCount[0].count),
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return Response.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
