// @ts-nocheck
import { getPeriodDates } from "@/app/api/utils/periodHelpers";

/**
 * Simple trigger endpoint to run tier promotions for a period
 * Automatically calculates period dates based on period type
 *
 * Usage:
 * POST /api/tiers/trigger
 * Body: { "periodType": "weekly" }
 *
 * Or with custom dates:
 * Body: {
 *   "periodType": "weekly",
 *   "periodStart": "2024-01-01T00:00:00Z",
 *   "periodEnd": "2024-01-07T23:59:59Z"
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { periodType, periodStart, periodEnd, preview = false } = body;

    if (!periodType) {
      return Response.json(
        {
          error:
            "periodType is required (weekly, monthly, quarterly, yearly, all-time)",
        },
        { status: 400 },
      );
    }

    // Calculate dates if not provided
    let dates;
    if (periodStart && periodEnd) {
      dates = { periodStart, periodEnd };
    } else {
      dates = getPeriodDates(periodType);
    }

    // Choose which endpoint to call
    const endpoint = preview
      ? "/api/tiers/preview-promotions"
      : "/api/tiers/process-promotions";

    // Call the appropriate endpoint
    const response = await fetch(`${process.env.APP_URL || ""}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        period: periodType,
        periodStart: dates.periodStart,
        periodEnd: dates.periodEnd,
      }),
    });

    const result = await response.json();

    return Response.json({
      success: true,
      mode: preview ? "preview" : "execute",
      periodType,
      dates,
      ...result,
    });
  } catch (error) {
    console.error("Error triggering tier promotions:", error);
    return Response.json(
      { error: "Failed to trigger tier promotions", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * GET endpoint to check current period info without triggering
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const periodType = searchParams.get("period") || "weekly";

    const dates = getPeriodDates(periodType);

    return Response.json({
      periodType,
      dates,
      info: "Use POST to trigger promotions",
    });
  } catch (error) {
    console.error("Error getting period info:", error);
    return Response.json(
      { error: "Failed to get period info" },
      { status: 500 },
    );
  }
}
