// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return Response.json({ error: "Post ID required" }, { status: 400 });
    }

    const likes = await sql`
      SELECT 
        l.user_id,
        l.created_at as liked_at,
        u.username,
        u.profile_image
      FROM likes l
      JOIN users u ON l.user_id = u.id
      WHERE l.post_id = ${postId}
      ORDER BY l.created_at DESC
    `;

    return Response.json({ likes });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return Response.json({ error: "Failed to fetch likes" }, { status: 500 });
  }
}
