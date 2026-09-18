// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CategoryIcon from "@/components/CategoryIcon";
import { HexagonBadge } from "@/components/Trophies/HexagonBadge";
import * as Haptics from "expo-haptics";

const MOODS = [
  {
    id: "unstoppable",
    iconCategory: "unstoppable",
    label: "Unstoppable",
    gradient: ["#ff6b6b", "#ff8c42"],
  },
  {
    id: "relaxed",
    iconCategory: "relaxed",
    label: "Easy & relaxed",
    gradient: ["#a8e6cf", "#80d4ff"],
  },
  {
    id: "grinding",
    iconCategory: "grinding",
    label: "Grinding",
    gradient: ["#b24592", "#f15f79"],
  },
  {
    id: "focused",
    iconCategory: "focused",
    label: "Focused",
    gradient: ["#667eea", "#764ba2"],
  },
  {
    id: "happy",
    iconCategory: "happy",
    label: "Happy miles",
    gradient: ["#ffd89b", "#ff9a9e"],
  },
  {
    id: "meh",
    iconCategory: "meh",
    label: "Meh / just exercising",
    gradient: ["#757575", "#9e9e9e"],
  },
  {
    id: "clearing",
    iconCategory: "clearing",
    label: "Clearing my head",
    gradient: ["#4facfe", "#00f2fe"],
  },
  {
    id: "race",
    iconCategory: "race",
    label: "Race mode",
    gradient: ["#e52d27", "#b31217"],
  },
];

export function MoodDisplay({
  selectedMood,
  displayedMedals = [],
  onMedalPress,
}) {
  const currentMood = MOODS.find((m) => m.id === selectedMood);

  // Show if we have a mood or medals
  if (!currentMood && (!displayedMedals || displayedMedals.length === 0)) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        paddingHorizontal: 12,
      }}
    >
      {currentMood && (
        <LinearGradient
          colors={currentMood.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flex: 1,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <CategoryIcon
            category={currentMood.iconCategory}
            size={28}
            iconSize={14}
            customGradient={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
          />
          <Text
            style={{
              fontSize: 14,
              color: "#fff",
              fontWeight: "700",
            }}
          >
            {currentMood.label}
          </Text>
        </LinearGradient>
      )}

      {displayedMedals && displayedMedals.length > 0 && (
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          {displayedMedals.slice(0, 3).map((medal, index) => {
            // Determine tier color based on whether it's a promotion badge or regular medal
            let tierColor = "#10b981"; // default

            if (medal.is_promotion_badge) {
              // Tier promotion badges
              if (medal.tier === "legend") tierColor = "#f59e0b";
              else if (medal.tier === "apex") tierColor = "#ef4444";
              else if (medal.tier === "ranger") tierColor = "#3b82f6";
              else if (medal.tier === "scout") tierColor = "#10b981";
            } else {
              // Regular podium medals
              if (medal.rank_achieved === 1) tierColor = "#fbbf24";
              else if (medal.rank_achieved === 2) tierColor = "#c0c0c0";
              else if (medal.rank_achieved === 3) tierColor = "#cd7f32";
              else if (medal.rank_achieved <= 10) tierColor = "#ef4444";
              else if (medal.rank_achieved <= 50) tierColor = "#3b82f6";
            }

            return (
              <TouchableOpacity
                key={medal.id || index}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onMedalPress?.(medal);
                }}
                activeOpacity={0.7}
              >
                <HexagonBadge
                  category={medal.category}
                  rank={medal.rank_achieved}
                  tier={medal.is_promotion_badge ? medal.tier : undefined}
                  color={tierColor}
                  size={48}
                  iconSize={20}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
