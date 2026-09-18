// @ts-nocheck
import { getUserPromotionHistory } from "@/app/api/utils/tierHelpers";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = searchParams.get("limit") || 20;

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const promotions = await getUserPromotionHistory(
      parseInt(userId),
      parseInt(limit),
    );

    return Response.json({ promotions });
  } catch (error) {
    console.error("Error getting promotion history:", error);
    return Response.json(
      { error: "Failed to get promotion history" },
      { status: 500 },
    );
  }
}
