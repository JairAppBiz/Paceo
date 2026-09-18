// @ts-nocheck
import { useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CATEGORIES } from "@/constants/leaderboard";

// Cache version - increment this to invalidate all old caches
const CACHE_VERSION = 2;

export function useLeaderboard(currentUserId) {
  const [selectedCategory, setSelectedCategory] = useState("miles");
  const [defaultCategory, setDefaultCategory] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // In-memory cache: { "miles_month": { leaderboard, currentUserRank, tierProgress }, ... }
  const memoryCache = useRef({});

  // Per-category data stored in memory
  const [allData, setAllData] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Derive current category's data instantly from memory — no async needed
  const currentKey = `${selectedCategory}_${selectedPeriod}`;
  const currentData = allData[currentKey] || {};
  const leaderboard = currentData.leaderboard || [];
  const currentUserRank = currentData.currentUserRank || null;
  const tierProgress = currentData.tierProgress || null;

  // Load default category on mount
  useEffect(() => {
    const loadDefaultCategory = async () => {
      try {
        const saved = await AsyncStorage.getItem("defaultLeaderboardCategory");
        if (saved && isMountedRef.current) {
          setDefaultCategory(saved);
          setSelectedCategory(saved);
        }
      } catch (error) {
        console.error("Error loading default category:", error);
      }
    };
    loadDefaultCategory();
  }, []);

  const saveDefaultCategory = async (categoryId) => {
    try {
      await AsyncStorage.setItem("defaultLeaderboardCategory", categoryId);
      if (isMountedRef.current) {
        setDefaultCategory(categoryId);
      }
    } catch (error) {
      console.error("Error saving default category:", error);
    }
  };

  // Fetch a single category+period combo and store in memory
  const fetchSingle = useCallback(
    async (category, period) => {
      const key = `${category}_${period}`;
      const cacheKey = `leaderboard_v${CACHE_VERSION}_${key}_${currentUserId}`;

      try {
        const [leaderboardResponse, tierProgressResponse] = await Promise.all([
          fetch(
            `/api/leaderboard/get?category=${category}&period=${period}&userId=${currentUserId}`,
          ),
          fetch(
            `/api/tiers/progress?category=${category}&period=${period}&userId=${currentUserId}`,
          ),
        ]);

        if (leaderboardResponse.ok && isMountedRef.current) {
          const data = await leaderboardResponse.json();

          console.log(`[useLeaderboard] Fetched ${category} ${period}:`, {
            leaderboardCount: data.leaderboard?.length,
            currentUserRank: data.currentUserRank,
            hasCurrentUserRank: !!data.currentUserRank,
          });

          let tierProgressData = null;
          if (tierProgressResponse.ok) {
            tierProgressData = await tierProgressResponse.json();
            console.log(
              `[useLeaderboard] Tier progress for ${category} ${period}:`,
              tierProgressData,
            );
            if (tierProgressData && !tierProgressData.excluded) {
              tierProgressData.category = category;
            }
          } else {
            console.log(
              `[useLeaderboard] Tier progress request failed for ${category} ${period}`,
            );
          }

          const entry = {
            leaderboard: data.leaderboard,
            currentUserRank: data.currentUserRank,
            tierProgress: tierProgressData,
            timestamp: Date.now(), // Add timestamp for cache freshness
          };

          // Store in memory immediately — triggers instant UI update
          if (isMountedRef.current) {
            memoryCache.current[key] = entry;
            setAllData((prev) => ({ ...prev, [key]: entry }));
          }

          // Persist to AsyncStorage in background with version
          AsyncStorage.setItem(cacheKey, JSON.stringify(entry)).catch(() => {});
        }
      } catch (error) {
        console.error(`Error fetching leaderboard for ${category}:`, error);
      }
    },
    [currentUserId],
  );

  // On mount or period change: load stale cache instantly, then fetch all categories in parallel
  const loadAll = useCallback(
    async (isRefresh = false) => {
      if (!currentUserId || !isMountedRef.current) return;

      const allCategories = CATEGORIES.map((c) => c.id);
      const period = selectedPeriod;

      // Step 1: Load all stale AsyncStorage caches into memory instantly
      if (!isRefresh) {
        const staleEntries = await Promise.all(
          allCategories.map(async (category) => {
            const key = `${category}_${period}`;
            const cacheKey = `leaderboard_v${CACHE_VERSION}_${key}_${currentUserId}`;

            // Clean up old version caches
            try {
              const oldCacheKey = `leaderboard_${key}_${currentUserId}`;
              await AsyncStorage.removeItem(oldCacheKey);
            } catch (_) {}

            try {
              const cached = await AsyncStorage.getItem(cacheKey);
              if (cached) {
                const parsed = JSON.parse(cached);
                // Only use cache if less than 5 minutes old
                const cacheAge = Date.now() - (parsed.timestamp || 0);
                const MAX_CACHE_AGE = 5 * 60 * 1000; // 5 minutes

                if (cacheAge < MAX_CACHE_AGE) {
                  return { key, data: parsed };
                } else {
                  console.log(`[useLeaderboard] Cache expired for ${key}`);
                }
              }
            } catch (_) {}
            return null;
          }),
        );

        const staleMap = {};
        staleEntries.forEach((entry) => {
          if (entry) staleMap[entry.key] = entry.data;
        });

        if (Object.keys(staleMap).length > 0 && isMountedRef.current) {
          memoryCache.current = { ...memoryCache.current, ...staleMap };
          setAllData((prev) => ({ ...prev, ...staleMap }));
        }

        if (isMountedRef.current) {
          setInitialLoading(false);
        }
      }

      // Step 2: Fetch all categories in parallel for fresh data
      await Promise.all(
        allCategories.map((category) => fetchSingle(category, period)),
      );

      if (isMountedRef.current) {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [currentUserId, selectedPeriod, fetchSingle],
  );

  // Load all data on mount and when period changes
  useEffect(() => {
    if (currentUserId) {
      loadAll(false);
    }
  }, [currentUserId, selectedPeriod, loadAll]);

  const onRefresh = useCallback(() => {
    if (isMountedRef.current) {
      setRefreshing(true);
      loadAll(true);
    }
  }, [loadAll]);

  return {
    selectedCategory,
    setSelectedCategory,
    defaultCategory,
    saveDefaultCategory,
    selectedPeriod,
    setSelectedPeriod,
    leaderboard,
    currentUserRank,
    tierProgress,
    loading: initialLoading,
    refreshing,
    onRefresh,
  };
}
