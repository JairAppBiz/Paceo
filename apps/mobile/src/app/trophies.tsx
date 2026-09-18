// @ts-nocheck
import { useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MedalRewardModal from "@/components/MedalRewardModal";
import { useTrophies } from "@/hooks/useTrophies";
import { NewTrophyHeader } from "@/components/Trophies/NewTrophyHeader";
import { MedalStatsCard } from "@/components/Trophies/MedalStatsCard";
import { ActiveBadgesSection } from "@/components/Trophies/ActiveBadgesSection";
import { LoadingState } from "@/components/Trophies/LoadingState";
import { CATEGORY_INFO } from "@/constants/medals";
import { useTheme } from "@/utils/themeStore";
import useUser from "@/utils/auth/useUser";
import {
  COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  SPACING,
  RADIUS,
} from "@/constants/design";

export default function TrophiesPage() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { data: currentUser } = useUser();
  const currentUserId = currentUser?.id;
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedRewardMedal, setSelectedRewardMedal] = useState(null);

  const {
    loading,
    refreshing,
    medalData,
    allMedals,
    tierPromotions,
    username,
    categoryBreakdown,
    onRefresh,
  } = useTrophies(currentUserId);

  const handleMedalClick = (medal) => {
    setSelectedRewardMedal(medal);
    setShowRewardModal(true);
  };

  const handleShareMedal = async (medal) => {
    try {
      const response = await fetch("/api/posts/create-medal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          medalId: medal.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to share medal");
      }

      setShowRewardModal(false);
      alert("Medal shared to your feed! 🎉");
    } catch (error) {
      console.error("Error sharing medal:", error);
      alert("Failed to share medal. Please try again.");
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  // Count ONLY podium medals by rank (excluding tier promotions)
  const podiumMedals = allMedals.filter(
    (m) =>
      !m.is_promotion_badge && m.rank_achieved >= 1 && m.rank_achieved <= 3,
  );
  const goldCount = podiumMedals.filter((m) => m.rank_achieved === 1).length;
  const silverCount = podiumMedals.filter((m) => m.rank_achieved === 2).length;
  const bronzeCount = podiumMedals.filter((m) => m.rank_achieved === 3).length;

  // Count tier promotion badges separately
  const scoutCount = tierPromotions.filter((p) => p.to_tier === "scout").length;
  const rangerCount = tierPromotions.filter(
    (p) => p.to_tier === "ranger",
  ).length;
  const apexCount = tierPromotions.filter((p) => p.to_tier === "apex").length;

  // Total medals = podium medals + tier badges
  const totalMedals =
    goldCount +
    silverCount +
    bronzeCount +
    apexCount +
    rangerCount +
    scoutCount;

  // Prepare badges for display
  const medalBadges = podiumMedals.map((medal) => {
    let tier = "bronze"; // Default

    // Set tier based on rank
    if (medal.rank_achieved === 1) tier = "gold";
    else if (medal.rank_achieved === 2) tier = "silver";
    else if (medal.rank_achieved === 3) tier = "bronze";

    return {
      id: medal.id, // Use numeric ID directly
      type: "medal",
      emoji: CATEGORY_INFO[medal.category]?.emoji || "🏆",
      locked: false,
      tier,
      category: medal.category,
      rank_achieved: medal.rank_achieved,
      period: medal.period,
      period_start_date: medal.period_start_date,
      period_end_date: medal.period_end_date,
      awarded_date: medal.awarded_date,
      location: medal.location,
      value: medal.value,
      unit: medal.unit,
      ...medal,
    };
  });

  // Add tier promotion badges
  const promotionBadges = tierPromotions.map((promo) => ({
    id: promo.id, // Use numeric ID directly
    type: "promotion",
    tier: promo.to_tier,
    category: promo.category,
    emoji: CATEGORY_INFO[promo.category]?.emoji || "🏆",
    locked: false,
    from_tier: promo.from_tier,
    to_tier: promo.to_tier,
    from_location: promo.from_location,
    to_location: promo.to_location,
    promotion_type: promo.promotion_type,
    badge_awarded: promo.badge_awarded,
    period_start: promo.period_start,
    period_end: promo.period_end,
    created_at: promo.created_at,
  }));

  // Combine all badges
  const allBadges = [...medalBadges, ...promotionBadges];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <NewTrophyHeader insets={insets} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fbbf24"
          />
        }
      >
        <MedalStatsCard
          username={username}
          totalMedals={totalMedals}
          goldCount={goldCount}
          silverCount={silverCount}
          bronzeCount={bronzeCount}
          apexCount={apexCount}
          rangerCount={rangerCount}
          scoutCount={scoutCount}
        />

        <ActiveBadgesSection
          medals={allBadges}
          onMedalClick={handleMedalClick}
        />
      </ScrollView>

      <MedalRewardModal
        visible={showRewardModal}
        medal={selectedRewardMedal}
        onClose={() => setShowRewardModal(false)}
        onShare={handleShareMedal}
      />
    </View>
  );
}
