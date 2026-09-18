// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId,
      type,
      title,
      message,
      relatedUserId,
      relatedPostId,
      relatedMedalId,
      relatedTierPromotionId,
      relatedRunId,
    } = body;

    if (!userId || !type || !title) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const [notification] = await sql`
      INSERT INTO notifications (
        user_id, 
        type, 
        title, 
        message, 
        related_user_id, 
        related_post_id, 
        related_medal_id,
        related_tier_promotion_id,
        related_run_id
      )
      VALUES (
        ${userId}, 
        ${type}, 
        ${title}, 
        ${message || null}, 
        ${relatedUserId || null}, 
        ${relatedPostId || null}, 
        ${relatedMedalId || null},
        ${relatedTierPromotionId || null},
        ${relatedRunId || null}
      )
      RETURNING *
    `;

    return Response.json({ notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    return Response.json(
      { error: "Failed to create notification" },
      { status: 500 },
    );
  }
}
