// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { createLikeNotification } from "@/app/api/utils/notificationHelpers";

export async function POST(request) {
  try {
    const { postId, userId } = await request.json();

    if (!postId || !userId) {
      return Response.json(
        { error: "Post ID and User ID required" },
        { status: 400 },
      );
    }

    // Check if already liked
    const existing = await sql`
      SELECT id FROM likes WHERE post_id = ${postId} AND user_id = ${userId}
    `;

    if (existing.length > 0) {
      // Unlike
      await sql`DELETE FROM likes WHERE post_id = ${postId} AND user_id = ${userId}`;

      const likesCount = await sql`
        SELECT COUNT(*) as count FROM likes WHERE post_id = ${postId}
      `;

      return Response.json({
        liked: false,
        likesCount: parseInt(likesCount[0].count),
      });
    } else {
      // Like
      await sql`INSERT INTO likes (post_id, user_id) VALUES (${postId}, ${userId})`;

      // Get post info to create notification
      const [post] = await sql`
        SELECT user_id FROM posts WHERE id = ${postId}
      `;

      // Create notification using helper function
      if (post) {
        await createLikeNotification(post.user_id, userId, postId);
      }

      const likesCount = await sql`
        SELECT COUNT(*) as count FROM likes WHERE post_id = ${postId}
      `;

      return Response.json({
        liked: true,
        likesCount: parseInt(likesCount[0].count),
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return Response.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
