// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { canViewPrivateContent } from "@/app/api/utils/privacyHelpers";

export async function GET(request) {
  try {
    const session = await auth();
    const viewerId = session?.user?.id || null;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const medalType = searchParams.get("medalType"); // gold, silver, bronze, top10, top50, top100, diamond
    const category = searchParams.get("category"); // optional category filter
    const limit = searchParams.get("limit"); // optional limit for number of results

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    // Check privacy settings
    const canView = await canViewPrivateContent(parseInt(userId), viewerId);
    if (!canView) {
      return Response.json(
        { error: "This profile is private" },
        { status: 403 },
      );
    }

    // Build query based on filters
    let query = `
      SELECT m.*, u.username
      FROM medals m
      JOIN users u ON m.user_id = u.id
      WHERE m.user_id = $1
    `;
    const params = [userId];
    let paramCount = 1;

    // Filter by medal type
    if (medalType) {
      paramCount++;
      if (medalType === "gold") {
        query += ` AND m.rank_achieved = 1 AND m.is_global = false`;
      } else if (medalType === "silver") {
        query += ` AND m.rank_achieved = 2 AND m.is_global = false`;
      } else if (medalType === "bronze") {
        query += ` AND m.rank_achieved = 3 AND m.is_global = false`;
      } else if (medalType === "top10") {
        query += ` AND m.rank_achieved > 3 AND m.rank_achieved <= 10 AND m.is_global = false`;
      } else if (medalType === "top50") {
        query += ` AND m.rank_achieved > 10 AND m.rank_achieved <= 50 AND m.is_global = false`;
      } else if (medalType === "top100") {
        query += ` AND m.rank_achieved > 50 AND m.rank_achieved <= 100 AND m.is_global = false`;
      } else if (medalType === "diamond") {
        query += ` AND m.is_global = true`;
      }
    }

    // Filter by category
    if (category) {
      paramCount++;
      query += ` AND m.category = $${paramCount}`;
      params.push(category);
    }

    query += ` ORDER BY m.awarded_date DESC`;

    // Add limit if provided
    if (limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(parseInt(limit));
    }

    const medals = await sql(query, params);

    return Response.json({ medals });
  } catch (error) {
    console.error("Error fetching medal list:", error);
    return Response.json({ error: "Failed to fetch medals" }, { status: 500 });
  }
}
