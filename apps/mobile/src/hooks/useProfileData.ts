// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useProfileData(userId) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    podiums: 0,
    medals: 0,
    monthlyMiles: 0,
    currentStreak: 0,
    longestStreak: 0,
  });
  const [statsPeriod, setStatsPeriod] = useState("all");
  const [runStats, setRunStats] = useState({
    distance: 0,
    runs: 0,
    avgPace: 0,
    totalTime: 0,
    calories: 0,
    elevation: 0,
  });
  const [personalBests, setPersonalBests] = useState({
    "1k": null,
    "1mile": null,
    "5k": null,
    "10k": null,
    half: null,
    marathon: null,
    longestRun: 0,
  });
  const [funStats, setFunStats] = useState(null);
  const [medalData, setMedalData] = useState(null);
  const [weeklyRunDays, setWeeklyRunDays] = useState([]);
  const [goalData, setGoalData] = useState(null);

  const getCacheKey = useCallback(
    (key) => {
      return `profile_${userId}_${key}_${statsPeriod}`;
    },
    [userId, statsPeriod],
  );

  const fetchWeeklyRunDays = async () => {
    try {
      // Get the start of the current week (Sunday)
      const now = new Date();
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);

      // Fetch runs from the database for this user
      const response = await fetch(
        `/api/users/stats?userId=${userId}&period=week`,
      );
      if (!response.ok) return;

      // Also fetch the actual run data to see which days have runs
      const runsResponse = await fetch(
        `/api/users/weekly-runs?userId=${userId}`,
      );
      if (runsResponse.ok) {
        const { runs } = await runsResponse.json();

        // Create a set of day indices (0-6, Sunday-Saturday) that have runs
        const runDayIndices = new Set();
        runs.forEach((run) => {
          const runDate = new Date(run.date);
          if (runDate >= startOfWeek) {
            const dayIndex = runDate.getDay();
            runDayIndices.add(dayIndex);
          }
        });

        setWeeklyRunDays(Array.from(runDayIndices));
      }
    } catch (error) {
      console.error("Error fetching weekly run days:", error);
    }
  };

  const fetchRunStats = async (period, showStale = true) => {
    const cacheKey = getCacheKey(`runStats_${period}`);

    try {
      // Load cached data first
      if (showStale) {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          setRunStats(JSON.parse(cached));
        }
      }

      const statsRes = await fetch(
        `/api/users/stats?userId=${userId}&period=${period}`,
      );
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setRunStats(statsData);
        await AsyncStorage.setItem(cacheKey, JSON.stringify(statsData));
      }
    } catch (error) {
      console.error("Error fetching run stats:", error);
    }
  };

  const fetchData = async (showStale = true) => {
    const mainCacheKey = getCacheKey("main");

    try {
      // Load cached data first for instant display
      if (showStale) {
        const cached = await AsyncStorage.getItem(mainCacheKey);
        if (cached) {
          const cachedData = JSON.parse(cached);
          setUser(cachedData.user);
          setStats(cachedData.stats);
          setPersonalBests(cachedData.personalBests);
          setFunStats(cachedData.funStats);
          setMedalData(cachedData.medalData);
          setLoading(false);
        }
      }

      const [
        userRes,
        statsRes,
        pbRes,
        funStatsRes,
        medalRes,
        tierPromotionsRes,
        goalRes,
      ] = await Promise.all([
        fetch(`/api/users/get?userId=${userId}`),
        fetch(`/api/users/profile-stats?userId=${userId}`),
        fetch(`/api/users/personal-bests?userId=${userId}`),
        fetch(`/api/users/fun-stats?userId=${userId}`),
        fetch(`/api/medals/get?userId=${userId}`),
        fetch(`/api/tiers/promotions?userId=${userId}`),
        fetch(`/api/users/goal-progress?userId=${userId}`),
      ]);

      let userData,
        statsData,
        pbData,
        funStatsData,
        medalDataRes,
        tierPromotionsData,
        goalDataRes;

      if (userRes.ok) {
        userData = await userRes.json();
        setUser(userData.user);
      }

      if (statsRes.ok) {
        statsData = await statsRes.json();
        setStats(statsData);
      }

      await fetchRunStats(statsPeriod, showStale);
      await fetchWeeklyRunDays();

      if (pbRes.ok) {
        pbData = await pbRes.json();
        setPersonalBests(pbData);
      }

      if (funStatsRes.ok) {
        funStatsData = await funStatsRes.json();
        setFunStats(funStatsData);
      }

      if (medalRes.ok) {
        medalDataRes = await medalRes.json();
      }

      if (tierPromotionsRes.ok) {
        tierPromotionsData = await tierPromotionsRes.json();
        const promotions = tierPromotionsData.promotions || [];

        // Calculate tier counts
        const tierCounts = {
          apex: promotions.filter((p) => p.to_tier === "apex").length,
          ranger: promotions.filter((p) => p.to_tier === "ranger").length,
          scout: promotions.filter((p) => p.to_tier === "scout").length,
        };

        // Add tier counts to medal data
        if (medalDataRes) {
          medalDataRes.tierCounts = tierCounts;
          setMedalData(medalDataRes);
        }
      } else if (medalDataRes) {
        // If tier promotions failed, just set medal data without tier counts
        medalDataRes.tierCounts = { apex: 0, ranger: 0, scout: 0 };
        setMedalData(medalDataRes);
      }

      if (goalRes.ok) {
        goalDataRes = await goalRes.json();
        setGoalData(goalDataRes);
      }

      // Cache all the main data
      if (userData && statsData && pbData && funStatsData && medalDataRes) {
        const cacheData = {
          user: userData.user,
          stats: statsData,
          personalBests: pbData,
          funStats: funStatsData,
          medalData: medalDataRes,
        };
        await AsyncStorage.setItem(mainCacheKey, JSON.stringify(cacheData));
      }

      // Performance graphs removed
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchRunStats(statsPeriod, true);
    }
  }, [statsPeriod]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return {
    loading,
    refreshing,
    user,
    stats,
    statsPeriod,
    runStats,
    personalBests,
    funStats,
    medalData,
    weeklyRunDays,
    goalData,
    setStatsPeriod,
    onRefresh,
    updateUser,
  };
}
