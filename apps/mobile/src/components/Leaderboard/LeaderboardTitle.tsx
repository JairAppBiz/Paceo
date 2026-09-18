// @ts-nocheck
import { View, Text } from "react-native";

export function LeaderboardTitle({ category, currentUserRank }) {
  return (
    <View
      style={{
        marginBottom: 32,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 28, color: "#fff", fontWeight: "700" }}>
          {category.label} Leaderboard
        </Text>
        <Text style={{ fontSize: 15, color: "#888", marginTop: 4 }}>
          {category.description}
        </Text>
      </View>

      {currentUserRank && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginTop: 4,
          }}
        >
          <Text style={{ fontSize: 20, color: "#fff", fontWeight: "600" }}>
            {currentUserRank.rank}
          </Text>
          <Text style={{ fontSize: 20 }}>🏆</Text>
        </View>
      )}
    </View>
  );
}
