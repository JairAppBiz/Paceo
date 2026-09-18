// @ts-nocheck
import { initializeUserTiers } from "@/app/api/utils/tierHelpers";

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const tiers = await initializeUserTiers(userId);

    return Response.json({
      message: "User tiers initialized",
      tiers,
    });
  } catch (error) {
    console.error("Error initializing user tiers:", error);
    return Response.json(
      { error: "Failed to initialize user tiers" },
      { status: 500 },
    );
  }
}
