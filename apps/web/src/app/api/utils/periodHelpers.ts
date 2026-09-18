// @ts-nocheck
/**
 * Get the start and end dates for a given period type
 */
export function getPeriodDates(periodType, referenceDate = new Date()) {
  const date = new Date(referenceDate);
  let periodStart, periodEnd;

  switch (periodType) {
    case "weekly":
      // Get start of current week (Sunday)
      periodStart = new Date(date);
      periodStart.setDate(date.getDate() - date.getDay());
      periodStart.setHours(0, 0, 0, 0);

      // Get end of current week (Saturday 11:59:59 PM)
      periodEnd = new Date(periodStart);
      periodEnd.setDate(periodStart.getDate() + 6);
      periodEnd.setHours(23, 59, 59, 999);
      break;

    case "monthly":
      // Get start of current month
      periodStart = new Date(date.getFullYear(), date.getMonth(), 1);
      periodStart.setHours(0, 0, 0, 0);

      // Get end of current month
      periodEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      periodEnd.setHours(23, 59, 59, 999);
      break;

    case "quarterly":
      // Get current quarter (0-3)
      const quarter = Math.floor(date.getMonth() / 3);

      // Get start of quarter
      periodStart = new Date(date.getFullYear(), quarter * 3, 1);
      periodStart.setHours(0, 0, 0, 0);

      // Get end of quarter
      periodEnd = new Date(date.getFullYear(), (quarter + 1) * 3, 0);
      periodEnd.setHours(23, 59, 59, 999);
      break;

    case "yearly":
      // Get start of year
      periodStart = new Date(date.getFullYear(), 0, 1);
      periodStart.setHours(0, 0, 0, 0);

      // Get end of year
      periodEnd = new Date(date.getFullYear(), 11, 31);
      periodEnd.setHours(23, 59, 59, 999);
      break;

    case "all-time":
      // Start from a very early date
      periodStart = new Date(2000, 0, 1);
      periodStart.setHours(0, 0, 0, 0);

      // End at current date
      periodEnd = new Date();
      periodEnd.setHours(23, 59, 59, 999);
      break;

    default:
      throw new Error(`Unknown period type: ${periodType}`);
  }

  return {
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
  };
}

/**
 * Get the previous period dates (useful for historical data)
 */
export function getPreviousPeriodDates(periodType, referenceDate = new Date()) {
  const date = new Date(referenceDate);
  let previousDate;

  switch (periodType) {
    case "weekly":
      previousDate = new Date(date);
      previousDate.setDate(date.getDate() - 7);
      break;

    case "monthly":
      previousDate = new Date(date);
      previousDate.setMonth(date.getMonth() - 1);
      break;

    case "quarterly":
      previousDate = new Date(date);
      previousDate.setMonth(date.getMonth() - 3);
      break;

    case "yearly":
      previousDate = new Date(date);
      previousDate.setFullYear(date.getFullYear() - 1);
      break;

    default:
      throw new Error(`Unknown period type: ${periodType}`);
  }

  return getPeriodDates(periodType, previousDate);
}

/**
 * Format a period for display
 */
export function formatPeriod(periodType, periodStart) {
  const start = new Date(periodStart);

  switch (periodType) {
    case "weekly":
      const endOfWeek = new Date(start);
      endOfWeek.setDate(start.getDate() + 6);
      return `Week of ${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

    case "monthly":
      return start.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

    case "quarterly":
      const quarter = Math.floor(start.getMonth() / 3) + 1;
      return `Q${quarter} ${start.getFullYear()}`;

    case "yearly":
      return start.getFullYear().toString();

    case "all-time":
      return "All Time";

    default:
      return periodStart;
  }
}

/**
 * Check if we're at the end of a period (useful for triggering promotions)
 */
export function isEndOfPeriod(periodType, referenceDate = new Date()) {
  const date = new Date(referenceDate);
  const { periodEnd } = getPeriodDates(periodType, date);
  const end = new Date(periodEnd);

  // Check if we're within the last day of the period
  const dayDiff = Math.floor((end - date) / (1000 * 60 * 60 * 24));

  return dayDiff <= 0;
}
