// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { postId } = body;

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

    // Delete the post (this will cascade delete likes and comments)
    await sql`DELETE FROM posts WHERE id = ${postId}`;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return Response.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
