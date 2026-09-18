// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, notificationId } = body;

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    if (notificationId) {
      // Mark single notification as read
      await sql`
        UPDATE notifications
        SET is_read = true
        WHERE id = ${notificationId} AND user_id = ${userId}
      `;
    } else {
      // Mark all notifications as read
      await sql`
        UPDATE notifications
        SET is_read = true
        WHERE user_id = ${userId} AND is_read = false
      `;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return Response.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 },
    );
  }
}
