// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CATEGORIES } from "@/constants/leaderboard";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { LeaderboardHeader } from "@/components/Leaderboard/LeaderboardHeader";
import { CategoryScroll } from "@/components/Leaderboard/CategoryScroll";
import { LeaderboardList } from "@/components/Leaderboard/LeaderboardList";
import { CurrentUserRank } from "@/components/Leaderboard/CurrentUserRank";
import { EmptyState } from "@/components/Leaderboard/EmptyState";
import { TierExplainerModal } from "@/components/Leaderboard/TierExplainerModal";
import { TierProgressBar } from "@/components/Leaderboard/TierProgressBar";
import { useTheme } from "@/utils/themeStore";
import useUser from "@/utils/auth/useUser";

export default function LeaderboardPage() {
  const insets = useSafeAreaInsets();
  const categoryScrollRef = useRef(null);
  const { colors, isDark } = useTheme();
  const { data: currentUser } = useUser();
  const currentUserId = currentUser?.id;

  const [tierModalVisible, setTierModalVisible] = useState(false);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const {
    selectedCategory,
    setSelectedCategory,
    defaultCategory,
    saveDefaultCategory,
    selectedPeriod,
    setSelectedPeriod,
    leaderboard,
    currentUserRank,
    tierProgress,
    loading,
    refreshing,
    onRefresh,
  } = useLeaderboard(currentUserId);

  // Debug logging for tier progress
  useEffect(() => {
    console.log("=== TIER PROGRESS DEBUG ===");
    console.log("tierProgress:", JSON.stringify(tierProgress, null, 2));
    console.log("tierProgress.rank:", tierProgress?.rank);
    console.log("tierProgress.excluded:", tierProgress?.excluded);
    console.log("selectedCategory:", selectedCategory);
    console.log("selectedPeriod:", selectedPeriod);
    console.log("===========================");
  }, [tierProgress, selectedCategory, selectedPeriod]);

  // Reset full leaderboard view when category or period changes
  useEffect(() => {
    setShowFullLeaderboard(false);
    setExpandedCategory(null);
  }, [selectedCategory, selectedPeriod]);

  const currentCategory = CATEGORIES.find((c) => c.id === selectedCategory);

  // Determine visible leaderboard entries
  const visibleLeaderboard = showFullLeaderboard
    ? leaderboard
    : leaderboard.slice(0, 10);
  const hasMoreEntries = leaderboard.length > 10;
  const isUserVisible = leaderboard
    .slice(0, showFullLeaderboard ? leaderboard.length : 10)
    .find((u) => u.isCurrentUser);

  // Debug logging for current user rank visibility
  useEffect(() => {
    console.log("=== CURRENT USER RANK DEBUG ===");
    console.log("currentUserRank:", JSON.stringify(currentUserRank, null, 2));
    console.log("isUserVisible:", !!isUserVisible);
    console.log("showFullLeaderboard:", showFullLeaderboard);
    console.log("leaderboard.length:", leaderboard.length);
    console.log(
      "Will show CurrentUserRank component:",
      !!(currentUserRank && !isUserVisible),
    );
    console.log(
      "Will show TierProgressBar component:",
      !!(tierProgress && !tierProgress.excluded && tierProgress.rank),
    );
    console.log("===============================");
  }, [
    currentUserRank,
    isUserVisible,
    showFullLeaderboard,
    tierProgress,
    leaderboard.length,
  ]);

  // Only show loading spinner on initial mount with no data
  if (loading && leaderboard.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#60a5fa" />
        <StatusBar style={isDark ? "light" : "dark"} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#60a5fa"
          />
        }
      >
        {/* Header */}
        <LeaderboardHeader
          insets={insets}
          currentTier={tierProgress?.tier}
          location={tierProgress?.location}
          category={selectedCategory}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          onTierBadgePress={() => setTierModalVisible(true)}
        />

        {/* Tier Progress Bar - Show if we have valid tier progress data */}
        {tierProgress && !tierProgress.excluded && tierProgress.rank && (
          <TierProgressBar
            currentRank={tierProgress.rank}
            totalUsers={tierProgress.totalUsers}
            currentTier={tierProgress.tier}
            location={tierProgress.location}
            value={tierProgress.value}
            unit={tierProgress.unit}
            nextTierThreshold={tierProgress.nextTierThreshold}
            demotionThreshold={tierProgress.demotionThreshold}
            category={selectedCategory}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        )}

        {/* Horizontal Category Scroll */}
        <View style={{ marginTop: 16 }}>
          <CategoryScroll
            selectedCategory={selectedCategory}
            defaultCategory={defaultCategory}
            onCategorySelect={setSelectedCategory}
            onSaveDefaultCategory={saveDefaultCategory}
            categoryScrollRef={categoryScrollRef}
            expandedCategory={expandedCategory}
            onCategoryExpand={setExpandedCategory}
          />
        </View>

        {/* Main Content */}
        <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
          {leaderboard.length === 0 ? (
            <EmptyState />
          ) : (
            <View>
              {/* Visible Users */}
              <LeaderboardList
                users={visibleLeaderboard}
                category={selectedCategory}
              />

              {/* See Full Leaderboard Button */}
              {hasMoreEntries && !showFullLeaderboard && (
                <TouchableOpacity
                  onPress={() => setShowFullLeaderboard(true)}
                  style={{
                    marginTop: 16,
                    paddingVertical: 14,
                    backgroundColor: colors.cardBackground,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#60a5fa",
                      fontWeight: "600",
                    }}
                  >
                    See Full Leaderboard
                  </Text>
                </TouchableOpacity>
              )}

              {/* Your Rank (if not in visible list) */}
              {currentUserRank && !isUserVisible && (
                <CurrentUserRank
                  currentUserRank={currentUserRank}
                  category={selectedCategory}
                />
              )}
            </View>
          )}
        </View>

        {/* Filter Modal */}
        <TierExplainerModal
          visible={tierModalVisible}
          onClose={() => setTierModalVisible(false)}
          currentTier={tierProgress?.tier || "scout"}
          currentLocation={tierProgress?.location || "city"}
          currentCategory={selectedCategory}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </ScrollView>
    </View>
  );
}
