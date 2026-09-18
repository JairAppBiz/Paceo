// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID required" }, { status: 400 });
    }

    const result = await sql`
      SELECT 
        id, 
        username, 
        email, 
        profile_image, 
        dark_mode, 
        is_premium, 
        created_at, 
        displayed_medals,
        follower_count,
        following_count,
        profile_private,
        city,
        state,
        country,
        tracked_tier_category,
        goal_category,
        goal_target,
        goal_period
      FROM users
      WHERE id = ${userId}
    `;

    if (result.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      user: {
        ...result[0],
        follower_count: result[0].follower_count || 0,
        following_count: result[0].following_count || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
