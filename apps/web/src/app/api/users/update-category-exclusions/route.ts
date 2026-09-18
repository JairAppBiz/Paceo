// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { userId, excludedCategories } = await request.json();

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    if (!Array.isArray(excludedCategories)) {
      return Response.json(
        { error: "excludedCategories must be an array" },
        { status: 400 },
      );
    }

    // Update excluded categories
    const result = await sql`
      UPDATE users
      SET excluded_categories = ${JSON.stringify(excludedCategories)}::jsonb
      WHERE id = ${userId}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      message: "Category exclusions updated",
      user: result[0],
    });
  } catch (error) {
    console.error("Error updating category exclusions:", error);
    return Response.json(
      { error: "Failed to update category exclusions" },
      { status: 500 },
    );
  }
}
