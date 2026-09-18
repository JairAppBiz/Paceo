// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { detectAndNotifyMentions } from "@/app/api/utils/notificationHelpers";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, medalId } = body;

    if (!userId || !medalId) {
      return Response.json(
        { error: "User ID and Medal ID are required" },
        { status: 400 },
      );
    }

    // Get the medal details
    const medals = await sql`
      SELECT * FROM medals WHERE id = ${medalId} AND user_id = ${userId}
    `;

    if (medals.length === 0) {
      return Response.json({ error: "Medal not found" }, { status: 404 });
    }

    const medal = medals[0];

    // Check if a post already exists for this medal
    const existingPosts = await sql`
      SELECT id FROM posts 
      WHERE user_id = ${userId} 
      AND post_type = 'medal'
      AND achievement_id = ${medalId}
    `;

    if (existingPosts.length > 0) {
      return Response.json(
        { error: "Medal already shared", postId: existingPosts[0].id },
        { status: 400 },
      );
    }

    // Create caption based on medal details
    const rankLabel =
      medal.rank_achieved === 1
        ? "🥇 Gold Medal"
        : medal.rank_achieved === 2
          ? "🥈 Silver Medal"
          : medal.rank_achieved === 3
            ? "🥉 Bronze Medal"
            : medal.rank_achieved <= 10
              ? "🔵 Top 10"
              : medal.rank_achieved <= 50
                ? "🟢 Top 50"
                : medal.rank_achieved <= 100
                  ? "🟣 Top 100"
                  : `#${medal.rank_achieved}`;

    const caption = `Just earned a ${rankLabel} for ${medal.category}! ${medal.is_global ? "🌍" : "📍"}`;

    // Create the post
    const newPosts = await sql`
      INSERT INTO posts (user_id, post_type, caption, achievement_id, created_at)
      VALUES (${userId}, 'medal', ${caption}, ${medalId}, NOW())
      RETURNING *
    `;

    const newPost = newPosts[0];

    // Detect and notify @mentions in caption
    await detectAndNotifyMentions(caption, newPost.id, userId);

    return Response.json({
      success: true,
      post: newPost,
      message: "Medal shared to feed successfully",
    });
  } catch (error) {
    console.error("Error creating medal post:", error);
    return Response.json({ error: "Failed to share medal" }, { status: 500 });
  }
}
