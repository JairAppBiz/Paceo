// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { userId, token } = await request.json();

    if (!userId || !token) {
      return Response.json(
        { error: "Missing userId or token" },
        { status: 400 },
      );
    }

    // Upsert the push token - update if exists, insert if new
    await sql`
      INSERT INTO push_tokens (user_id, token, updated_at)
      VALUES (${userId}, ${token}, NOW())
      ON CONFLICT (user_id, token)
      DO UPDATE SET updated_at = NOW()
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error registering push token:", error);
    return Response.json(
      { error: "Failed to register push token" },
      { status: 500 },
    );
  }
}
