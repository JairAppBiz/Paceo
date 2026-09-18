// @ts-nocheck
import { getUserTiers } from "@/app/api/utils/tierHelpers";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const tiers = await getUserTiers(parseInt(userId));

    return Response.json({ tiers });
  } catch (error) {
    console.error("Error getting user tiers:", error);
    return Response.json(
      { error: "Failed to get user tiers" },
      { status: 500 },
    );
  }
}
