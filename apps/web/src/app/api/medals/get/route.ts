// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId"));

    if (!userId) {
      return Response.json({ error: "User ID required" }, { status: 400 });
    }

    // Get all medals for the user
    const medals = await sql`
      SELECT 
        m.*,
        CASE 
          WHEN m.rank_achieved = 1 THEN 'gold'
          WHEN m.rank_achieved = 2 THEN 'silver'
          WHEN m.rank_achieved = 3 THEN 'bronze'
          WHEN m.rank_achieved <= 10 THEN 'top10'
          WHEN m.rank_achieved <= 50 THEN 'top50'
          WHEN m.rank_achieved <= 100 THEN 'top100'
          ELSE 'other'
        END as medal_type
      FROM medals m
      WHERE m.user_id = ${userId}
      ORDER BY m.awarded_date DESC
    `;

    // Calculate medal counts
    const counts = {
      gold: 0,
      silver: 0,
      bronze: 0,
      top10: 0,
      top50: 0,
      top100: 0,
      diamond: 0,
    };

    medals.forEach((medal) => {
      if (medal.is_global) {
        counts.diamond++;
      }
      if (medal.medal_type === "gold") counts.gold++;
      else if (medal.medal_type === "silver") counts.silver++;
      else if (medal.medal_type === "bronze") counts.bronze++;
      else if (medal.medal_type === "top10") counts.top10++;
      else if (medal.medal_type === "top50") counts.top50++;
      else if (medal.medal_type === "top100") counts.top100++;
    });

    const totalMedals =
      counts.gold +
      counts.silver +
      counts.bronze +
      counts.top10 +
      counts.top50 +
      counts.top100;

    // Get category breakdown
    const categoryBreakdown = {};
    medals.forEach((medal) => {
      if (!categoryBreakdown[medal.category]) {
        categoryBreakdown[medal.category] = {
          gold: 0,
          silver: 0,
          bronze: 0,
          top10: 0,
          top50: 0,
          top100: 0,
          diamond: 0,
        };
      }
      if (medal.is_global) categoryBreakdown[medal.category].diamond++;
      if (medal.medal_type === "gold") categoryBreakdown[medal.category].gold++;
      else if (medal.medal_type === "silver")
        categoryBreakdown[medal.category].silver++;
      else if (medal.medal_type === "bronze")
        categoryBreakdown[medal.category].bronze++;
      else if (medal.medal_type === "top10")
        categoryBreakdown[medal.category].top10++;
      else if (medal.medal_type === "top50")
        categoryBreakdown[medal.category].top50++;
      else if (medal.medal_type === "top100")
        categoryBreakdown[medal.category].top100++;
    });

    // Calculate stats
    let bestFinish = null;
    let mostCommonMedalType = null;
    let favoriteCategory = null;

    // Best finish (lowest rank)
    if (medals.length > 0) {
      bestFinish = medals.reduce((best, medal) => {
        if (!best || medal.rank_achieved < best.rank_achieved) {
          return medal;
        }
        return best;
      }, null);
    }

    // Most common medal type
    const medalTypeCounts = { ...counts };
    delete medalTypeCounts.diamond;
    const maxCount = Math.max(...Object.values(medalTypeCounts));
    if (maxCount > 0) {
      mostCommonMedalType = Object.keys(medalTypeCounts).find(
        (key) => medalTypeCounts[key] === maxCount,
      );
    }

    // Favorite category (most medals in a category)
    if (Object.keys(categoryBreakdown).length > 0) {
      let maxCategoryCount = 0;
      Object.entries(categoryBreakdown).forEach(([category, breakdown]) => {
        const total = Object.values(breakdown).reduce(
          (sum, count) => sum + count,
          0,
        );
        if (total > maxCategoryCount) {
          maxCategoryCount = total;
          favoriteCategory = category;
        }
      });
    }

    // NEW: Calculate period-based medal counts
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const weekMedals = medals.filter(
      (m) => new Date(m.awarded_date) >= oneWeekAgo,
    );
    const monthMedals = medals.filter(
      (m) => new Date(m.awarded_date) >= oneMonthAgo,
    );
    const yearMedals = medals.filter(
      (m) => new Date(m.awarded_date) >= oneYearAgo,
    );

    const countPodiumsAndTop10s = (medalsList) => {
      const podiums = medalsList.filter((m) => m.rank_achieved <= 3).length;
      const top10s = medalsList.filter((m) => m.rank_achieved <= 10).length;
      const neighborhood = medalsList.filter((m) => !m.is_global).length;
      const city = medalsList.filter((m) => m.is_global).length;
      return { total: medalsList.length, podiums, top10s, neighborhood, city };
    };

    const weekStats = countPodiumsAndTop10s(weekMedals);
    const monthStats = countPodiumsAndTop10s(monthMedals);
    const yearStats = countPodiumsAndTop10s(yearMedals);
    const lifetimeStats = countPodiumsAndTop10s(medals);

    // NEW: Calculate medal streak (consecutive weeks with medals)
    const weeklyMedalCounts = {};
    medals.forEach((medal) => {
      const date = new Date(medal.awarded_date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weeklyMedalCounts[weekKey]) {
        weeklyMedalCounts[weekKey] = 0;
      }
      weeklyMedalCounts[weekKey]++;
    });

    const sortedWeeks = Object.keys(weeklyMedalCounts).sort().reverse();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < sortedWeeks.length; i++) {
      if (i === 0 || isConsecutiveWeek(sortedWeeks[i], sortedWeeks[i - 1])) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    function isConsecutiveWeek(week1, week2) {
      const date1 = new Date(week1);
      const date2 = new Date(week2);
      const diffDays = Math.abs((date1 - date2) / (1000 * 60 * 60 * 24));
      return diffDays === 7;
    }

    // NEW: Year-by-year timeline
    const yearlyBreakdown = {};
    medals.forEach((medal) => {
      const year = new Date(medal.awarded_date).getFullYear();
      if (!yearlyBreakdown[year]) {
        yearlyBreakdown[year] = [];
      }
      yearlyBreakdown[year].push(medal);
    });

    const timeline = Object.keys(yearlyBreakdown)
      .sort()
      .reverse()
      .map((year) => ({
        year: parseInt(year),
        count: yearlyBreakdown[year].length,
        medals: yearlyBreakdown[year],
      }));

    // NEW: Generate uplifting message based on stats
    let upliftingMessage = "";
    const podiumPercentage =
      totalMedals > 0
        ? ((counts.gold + counts.silver + counts.bronze) / totalMedals) * 100
        : 0;

    if (podiumPercentage > 50) {
      upliftingMessage = `You're a Champion! Over ${Math.round(podiumPercentage)}% of your medals are podium finishes.`;
    } else if (counts.gold > 5) {
      upliftingMessage = `Gold Standard! You've earned ${counts.gold} gold medals - you're built for winning.`;
    } else if (counts.diamond > 0) {
      upliftingMessage = `Global Star! You've earned ${counts.diamond} diamond medal${counts.diamond > 1 ? "s" : ""} - you compete with the world's best.`;
    } else if (longestStreak > 4) {
      upliftingMessage = `Consistency King! Your ${longestStreak}-week medal streak shows incredible dedication.`;
    } else if (favoriteCategory) {
      upliftingMessage = `Category Leader! You dominate in ${favoriteCategory} - that's your specialty.`;
    } else if (totalMedals > 0) {
      upliftingMessage = `Rising Star! You've earned ${totalMedals} medal${totalMedals > 1 ? "s" : ""} and you're just getting started.`;
    } else {
      upliftingMessage = `Ready to Shine! Your first medal is waiting - go earn it!`;
    }

    // NEW: Most common medal type counts for chart
    const medalTypeChartData = [
      { type: "Podiums", count: counts.gold + counts.silver + counts.bronze },
      { type: "Top 10", count: counts.top10 },
      { type: "Top 50", count: counts.top50 },
      { type: "Top 100", count: counts.top100 },
    ];

    return Response.json({
      medals,
      counts,
      totalMedals,
      categoryBreakdown,
      stats: {
        bestFinish,
        mostCommonMedalType,
        favoriteCategory,
      },
      // NEW FIELDS
      periodStats: {
        week: weekStats,
        month: monthStats,
        year: yearStats,
        lifetime: lifetimeStats,
      },
      medalStreak: {
        current: currentStreak,
        longest: longestStreak,
      },
      timeline,
      upliftingMessage,
      medalTypeChartData,
    });
  } catch (error) {
    console.error("Error fetching medals:", error);
    return Response.json({ error: "Failed to fetch medals" }, { status: 500 });
  }
}
