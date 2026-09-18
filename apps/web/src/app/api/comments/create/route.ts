// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { createCommentNotification } from "@/app/api/utils/notificationHelpers";

export async function POST(request) {
  try {
    const { postId, userId, commentText } = await request.json();

    if (!postId || !userId || !commentText?.trim()) {
      return Response.json(
        { error: "Post ID, User ID, and comment text required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO comments (post_id, user_id, comment_text)
      VALUES (${postId}, ${userId}, ${commentText.trim()})
      RETURNING id, post_id, user_id, comment_text, created_at
    `;

    // Get user info including profile_image
    const [user] = await sql`
      SELECT username, profile_image
      FROM users
      WHERE id = ${userId}
    `;

    // Get post info to create notification
    const [post] = await sql`
      SELECT user_id FROM posts WHERE id = ${postId}
    `;

    // Create notification using helper function
    if (post) {
      await createCommentNotification(
        post.user_id,
        userId,
        postId,
        commentText.trim(),
      );
    }

    // Return comment with user info
    return Response.json({
      comment: {
        ...result[0],
        username: user.username,
        profile_image: user.profile_image,
      },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return Response.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
