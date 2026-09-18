// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId,
      username,
      email,
      city,
      darkMode,
      includeInLeaderboard,
      notificationsEnabled,
      profilePrivate,
      weightKg,
    } = body;

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (username !== undefined) {
      updates.push(`username = $${paramCount}`);
      values.push(username);
      paramCount++;
    }

    if (email !== undefined) {
      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }

    if (city !== undefined) {
      updates.push(`city = $${paramCount}`);
      values.push(city);
      paramCount++;
    }

    if (darkMode !== undefined) {
      updates.push(`dark_mode = $${paramCount}`);
      values.push(darkMode);
      paramCount++;
    }

    if (includeInLeaderboard !== undefined) {
      updates.push(`include_in_leaderboard = $${paramCount}`);
      values.push(includeInLeaderboard);
      paramCount++;
    }

    if (notificationsEnabled !== undefined) {
      updates.push(`notifications_enabled = $${paramCount}`);
      values.push(notificationsEnabled);
      paramCount++;
    }

    if (profilePrivate !== undefined) {
      updates.push(`profile_private = $${paramCount}`);
      values.push(profilePrivate);
      paramCount++;
    }

    if (weightKg !== undefined) {
      updates.push(`weight_kg = $${paramCount}`);
      values.push(weightKg);
      paramCount++;
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    // Add userId as the last parameter
    values.push(userId);
    const updateQuery = `
      UPDATE users 
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await sql(updateQuery, values);

    if (result.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ user: result[0] });
  } catch (error) {
    console.error("Error updating user settings:", error);
    return Response.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}