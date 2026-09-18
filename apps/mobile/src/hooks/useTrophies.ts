// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export function useTrophies(userId) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [medalData, setMedalData] = useState(null);
  const [recentMedals, setRecentMedals] = useState([]);
  const [allMedals, setAllMedals] = useState([]);
  const [tierPromotions, setTierPromotions] = useState([]);
  const [username, setUsername] = useState("");
  const [medalStreak, setMedalStreak] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState({});

  // Animation values
  const goldShimmer = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Gold shimmer animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(goldShimmer, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(goldShimmer, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const calculateStreakAndBreakdown = (medals) => {
    // Calculate consecutive periods with medals
    const periods = [
      ...new Set(medals.map((m) => `${m.period}-${m.period_start_date}`)),
    ];
    setMedalStreak(periods.length);

    // Calculate category breakdown
    const breakdown = {};
    medals.forEach((medal) => {
      breakdown[medal.category] = (breakdown[medal.category] || 0) + 1;
    });
    setCategoryBreakdown(breakdown);
  };

  const fetchMedals = async () => {
    try {
      // Fetch user info
      const userResponse = await fetch(`/api/users/get?userId=${userId}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUsername(userData.username);
      }

      // Fetch medal data from the standardized endpoint - this has the correct counts
      const response = await fetch(`/api/medals/get?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMedalData(data);

        console.log("🏆 Medal data from /api/medals/get:", {
          total: data.totalMedals,
          counts: data.counts,
          medalsArray: data.medals?.length,
        });

        // Use the medals array from the /api/medals/get endpoint
        // It already includes all medals with proper rank_achieved values
        const allMedalsData = data.medals || [];
        console.log("📊 All medals:", allMedalsData.length, "medals");

        // Filter to ONLY podium medals (ranks 1-3) and add tier field
        const podiumMedals = allMedalsData
          .filter(
            (medal) => medal.rank_achieved >= 1 && medal.rank_achieved <= 3,
          )
          .map((medal) => ({
            ...medal,
            tier:
              medal.rank_achieved === 1
                ? "gold"
                : medal.rank_achieved === 2
                  ? "silver"
                  : "bronze",
          }));

        console.log(
          "🥇 Podium medals after filter:",
          podiumMedals.length,
          "medals",
        );
        console.log(
          "🥇 Gold:",
          podiumMedals.filter((m) => m.rank_achieved === 1).length,
        );
        console.log(
          "🥈 Silver:",
          podiumMedals.filter((m) => m.rank_achieved === 2).length,
        );
        console.log(
          "🥉 Bronze:",
          podiumMedals.filter((m) => m.rank_achieved === 3).length,
        );

        // Fetch tier promotions and add as badges
        const promotionsResponse = await fetch(
          `/api/tiers/promotions?userId=${userId}`,
        );

        let promotionBadges = [];
        if (promotionsResponse.ok) {
          const promotionsData = await promotionsResponse.json();
          console.log(
            "🎖️ Tier promotions:",
            promotionsData.promotions?.length,
            "promotions",
          );

          promotionBadges = (promotionsData.promotions || []).map((promo) => ({
            id: promo.id,
            type: "promotion",
            category: promo.category,
            tier: promo.to_tier,
            promotion_type: promo.promotion_type,
            from_tier: promo.from_tier,
            to_tier: promo.to_tier,
            from_location: promo.from_location,
            to_location: promo.to_location,
            badge_awarded: promo.badge_awarded,
            period_start: promo.period_start,
            period_end: promo.period_end,
            period_start_date: promo.period_start,
            period_end_date: promo.period_end,
            awarded_date: promo.created_at,
            created_at: promo.created_at,
            is_promotion_badge: true,
            value: promo.value,
            unit: promo.unit,
          }));

          setTierPromotions(promotionsData.promotions || []);
        }

        // Combine podium medals with tier promotion badges
        const combinedMedals = [...podiumMedals, ...promotionBadges];
        console.log(
          "✅ Final combined medals:",
          combinedMedals.length,
          "total",
        );

        setAllMedals(combinedMedals);
        setRecentMedals(podiumMedals.slice(0, 5));

        // Only calculate streak from podium medals, not promotion badges
        calculateStreakAndBreakdown(podiumMedals);
      }
    } catch (error) {
      console.error("Error fetching medals:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);

      // Bounce animation on refresh
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMedals();
    }
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMedals();
  };

  return {
    loading,
    refreshing,
    medalData,
    recentMedals,
    allMedals,
    tierPromotions,
    username,
    medalStreak,
    categoryBreakdown,
    goldShimmer,
    bounceAnim,
    onRefresh,
  };
}
