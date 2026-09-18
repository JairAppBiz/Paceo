// @ts-nocheck
import { View, Text } from "react-native";
import {
  Target,
  TrendingUp,
  Heart,
  Flame,
  Award,
  Crown,
} from "lucide-react-native";
import { HighlightCard } from "./HighlightCard";
import { CATEGORY_INFO, MEDAL_TYPE_INFO } from "@/constants/medals";
import { getMedalEmoji, getMedalLabel } from "@/utils/medalHelpers";

export function HighlightsSection({
  stats,
  counts,
  totalMedals,
  medalStreak,
  onMedalPress,
  onMedalClick,
}) {
  // Calculate progress to next milestone
  const nextMilestone =
    totalMedals < 10
      ? 10
      : totalMedals < 25
        ? 25
        : totalMedals < 50
          ? 50
          : totalMedals < 100
            ? 100
            : totalMedals + 50;
  const progressToMilestone = totalMedals / nextMilestone;

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
      <Text
        style={{
          fontSize: 20,
          color: "#fff",
          fontWeight: "700",
          marginBottom: 16,
        }}
      >
        Highlights
      </Text>

      <View style={{ gap: 12 }}>
        {/* Medal Streak */}
        {medalStreak > 0 && (
          <View
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#f59e0b",
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#f59e0b",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              <Flame size={28} color="#000" strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#888",
                  fontWeight: "600",
                  marginBottom: 4,
                }}
              >
                Medal Streak
              </Text>
              <Text style={{ fontSize: 18, color: "#fff", fontWeight: "700" }}>
                {medalStreak} consecutive periods
              </Text>
              <Text style={{ fontSize: 13, color: "#666", marginTop: 2 }}>
                Keep it going! 🔥
              </Text>
            </View>
          </View>
        )}

        {/* Progress to Next Milestone */}
        <View
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "#8b5cf6",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#8b5cf6",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <Award size={24} color="#000" strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#888",
                  fontWeight: "600",
                  marginBottom: 4,
                }}
              >
                Next Milestone
              </Text>
              <Text style={{ fontSize: 16, color: "#fff", fontWeight: "700" }}>
                {nextMilestone - totalMedals} medals to {nextMilestone}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 8,
              backgroundColor: "#2a2a2a",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                backgroundColor: "#8b5cf6",
                width: `${progressToMilestone * 100}%`,
                borderRadius: 4,
              }}
            />
          </View>
        </View>

        {/* Best Finish (Rarest Medal) */}
        {stats.bestFinish && (
          <HighlightCard
            icon={Crown}
            iconColor="#000"
            iconBgColor="#fbbf24"
            title="Rarest Medal"
            mainText={`#${stats.bestFinish.rank_achieved} • ${
              CATEGORY_INFO[stats.bestFinish.category]?.label ||
              stats.bestFinish.category
            }`}
            subText={`${stats.bestFinish.period} • ${new Date(
              stats.bestFinish.awarded_date,
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}`}
            emoji={getMedalEmoji(stats.bestFinish.rank_achieved)}
            borderColor="#fbbf24"
            onPress={() => onMedalClick && onMedalClick(stats.bestFinish)}
          />
        )}

        {/* Most Common Medal */}
        {stats.mostCommonMedalType && (
          <HighlightCard
            icon={TrendingUp}
            iconColor="#000"
            iconBgColor="#3b82f6"
            title="Most Common Medal"
            mainText={getMedalLabel(stats.mostCommonMedalType)}
            subText={`${counts[stats.mostCommonMedalType]} medals`}
            emoji={MEDAL_TYPE_INFO[stats.mostCommonMedalType]?.emoji}
            onPress={() => onMedalPress(stats.mostCommonMedalType)}
          />
        )}

        {/* Favorite Category */}
        {stats.favoriteCategory && (
          <HighlightCard
            icon={Heart}
            iconColor="#000"
            iconBgColor="#ec4899"
            title="Favorite Category"
            mainText={
              CATEGORY_INFO[stats.favoriteCategory]?.label ||
              stats.favoriteCategory
            }
            emoji={CATEGORY_INFO[stats.favoriteCategory]?.emoji || "🏆"}
          />
        )}
      </View>
    </View>
  );
}
