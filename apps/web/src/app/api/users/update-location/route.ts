// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { userId, city, state, country } = await request.json();

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (city !== undefined) {
      updates.push(`city = $${paramIndex++}`);
      values.push(city);
    }
    if (state !== undefined) {
      updates.push(`state = $${paramIndex++}`);
      values.push(state);
    }
    if (country !== undefined) {
      updates.push(`country = $${paramIndex++}`);
      values.push(country);
    }

    if (updates.length === 0) {
      return Response.json(
        { error: "No location fields provided" },
        { status: 400 },
      );
    }

    // Add userId as the last parameter
    values.push(userId);

    const query = `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ user: result[0] });
  } catch (error) {
    console.error("Error updating user location:", error);
    return Response.json(
      { error: "Failed to update user location" },
      { status: 500 },
    );
  }
}
