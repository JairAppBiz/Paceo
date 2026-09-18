// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, profileImage } = body;

    if (!userId) {
      return Response.json({ error: "userId required" }, { status: 400 });
    }

    if (!profileImage) {
      return Response.json({ error: "profileImage required" }, { status: 400 });
    }

    // Update user profile image
    const result = await sql`
      UPDATE users
      SET profile_image = ${profileImage}
      WHERE id = ${userId}
      RETURNING id, username, email, profile_image, dark_mode, is_premium
    `;

    if (result.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ user: result[0] });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return Response.json(
      { error: "Failed to update profile picture" },
      { status: 500 },
    );
  }
}
