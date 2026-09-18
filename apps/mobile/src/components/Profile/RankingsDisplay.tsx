// @ts-nocheck
import { View, Text } from "react-native";
import CategoryIcon from "@/components/CategoryIcon";
import { HexagonBadge } from "@/components/Trophies/HexagonBadge";

// Map category names to icon category keys
const getCategoryKey = (categoryName) => {
  const lowerCategory = categoryName.toLowerCase();
  if (lowerCategory.includes("miles") || lowerCategory.includes("distance"))
    return "distance";
  if (lowerCategory.includes("runs")) return "runs";
  if (lowerCategory.includes("elevation")) return "elevation";
  if (lowerCategory.includes("pace") || lowerCategory.includes("speed"))
    return "pace";
  if (lowerCategory.includes("time")) return "time";
  if (lowerCategory.includes("calories")) return "calories";
  if (lowerCategory.includes("heat")) return "heat";
  if (lowerCategory.includes("cold") || lowerCategory.includes("icy"))
    return "cold";
  if (lowerCategory.includes("steps")) return "steps";
  return "trophy"; // default
};

export function RankingsDisplay({
  currentRanking,
  bestRanking,
  bestRankingMedal,
}) {
  if (!currentRanking && !bestRanking) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: "#1a1a1a",
        borderWidth: 1,
        borderColor: "#2a2a2a",
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
      }}
    >
      {/* Current Ranking */}
      {currentRanking && (
        <View
          style={{
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <CategoryIcon
            category={getCategoryKey(currentRanking.category)}
            size={60}
            iconSize={28}
            style={{ marginBottom: 6 }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#fff",
              marginBottom: 2,
            }}
          >
            #{currentRanking.rank}
          </Text>
          <Text style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>
            Current ranking
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#666",
              textAlign: "center",
              paddingHorizontal: 8,
            }}
          >
            #{currentRanking.rank} in {currentRanking.category} -{" "}
            {currentRanking.scope}
          </Text>
        </View>
      )}

      {/* Best Ever Ranking */}
      {bestRanking && (
        <View
          style={{
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          {bestRankingMedal ? (
            <View style={{ marginBottom: 6 }}>
              <HexagonBadge
                category={bestRankingMedal.category}
                rank={bestRankingMedal.rank_achieved}
                color={
                  bestRankingMedal.rank_achieved === 1
                    ? "#fbbf24"
                    : bestRankingMedal.rank_achieved === 2
                      ? "#c0c0c0"
                      : bestRankingMedal.rank_achieved === 3
                        ? "#cd7f32"
                        : bestRankingMedal.rank_achieved <= 10
                          ? "#ef4444"
                          : bestRankingMedal.rank_achieved <= 50
                            ? "#3b82f6"
                            : "#10b981"
                }
                size={60}
                iconSize={28}
              />
            </View>
          ) : (
            <CategoryIcon
              category={getCategoryKey(bestRanking.category)}
              size={60}
              iconSize={28}
              style={{ marginBottom: 6 }}
            />
          )}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#fff",
              marginBottom: 2,
            }}
          >
            #{bestRanking.rank}
          </Text>
          <Text style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>
            Best ever rank
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#666",
              textAlign: "center",
              paddingHorizontal: 8,
            }}
          >
            #{bestRanking.rank} in {bestRanking.category} - {bestRanking.scope}
          </Text>
        </View>
      )}
    </View>
  );
}
