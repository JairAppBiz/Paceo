// @ts-nocheck
import sql from "@/app/api/utils/sql";

/**
 * Update the tier category a user wants to track on their profile
 */
export async function POST(request) {
  try {
    const { userId, category } = await request.json();

    if (!userId || !category) {
      return Response.json(
        { error: "userId and category are required" },
        { status: 400 },
      );
    }

    // Update the tracked category
    await sql`
      UPDATE users
      SET tracked_tier_category = ${category}
      WHERE id = ${userId}
    `;

    // Get updated user
    const [user] = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `;

    return Response.json({ user });
  } catch (error) {
    console.error("Error updating tracked category:", error);
    return Response.json(
      { error: "Failed to update tracked category" },
      { status: 500 },
    );
  }
}
