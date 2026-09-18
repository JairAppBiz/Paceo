// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";
import { TierBadgeDisplay } from "./TierBadgeDisplay";

// Mood-based categories that don't have tiers
const MOOD_CATEGORIES = [
  "unstoppable",
  "relaxed",
  "grinding",
  "focused",
  "happy",
  "meh",
  "clearing",
  "race",
];

export function LeaderboardHeader({
  insets,
  currentTier,
  location,
  category,
  selectedPeriod,
  onPeriodChange,
  onTierBadgePress,
}) {
  // Only hide badge for mood-based categories
  const isMoodCategory = MOOD_CATEGORIES.includes(category);
  const showBadge = !isMoodCategory && location;

  return (
    <View
      style={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        marginBottom: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 26, color: "#fff", fontWeight: "700" }}>
          Leaderboard
        </Text>
        {showBadge && (
          <TouchableOpacity onPress={onTierBadgePress}>
            <TierBadgeDisplay
              tier={currentTier || "scout"}
              location={location}
              category={category}
              compact={true}
              selectedPeriod={selectedPeriod}
              onPeriodChange={onPeriodChange}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
