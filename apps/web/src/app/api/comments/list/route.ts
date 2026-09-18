// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return Response.json({ error: "Post ID required" }, { status: 400 });
    }

    const comments = await sql`
      SELECT 
        c.id,
        c.comment_text,
        c.created_at,
        u.id as user_id,
        u.username,
        u.profile_image
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ${postId}
      ORDER BY c.created_at ASC
    `;

    return Response.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return Response.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}
