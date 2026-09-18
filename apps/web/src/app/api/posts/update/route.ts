// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { detectAndNotifyMentions } from "@/app/api/utils/notificationHelpers";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { postId, caption, imageUrl, hiddenStats, primaryStats } = body;

    if (!postId) {
      return Response.json({ error: "Post ID is required" }, { status: 400 });
    }

    // Verify the post belongs to the user
    const [post] = await sql`
      SELECT user_id FROM posts WHERE id = ${postId}
    `;

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.user_id !== parseInt(session.user.id)) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Build update query dynamically based on what fields are provided
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (caption !== undefined) {
      updates.push(`caption = $${paramCount++}`);
      values.push(caption);
    }

    if (imageUrl !== undefined) {
      updates.push(`image_url = $${paramCount++}`);
      values.push(imageUrl);
    }

    if (hiddenStats !== undefined) {
      updates.push(`hidden_stats = $${paramCount++}`);
      values.push(JSON.stringify(hiddenStats));
    }

    if (primaryStats !== undefined) {
      updates.push(`primary_stats = $${paramCount++}`);
      values.push(JSON.stringify(primaryStats));
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(postId);
    const query = `UPDATE posts SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const [updatedPost] = await sql(query, values);

    // If caption was updated, detect and notify @mentions
    if (caption !== undefined) {
      await detectAndNotifyMentions(caption, postId, parseInt(session.user.id));
    }

    return Response.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    return Response.json({ error: "Failed to update post" }, { status: 500 });
  }
}
