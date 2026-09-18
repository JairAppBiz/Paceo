// @ts-nocheck
import { View, Text } from "react-native";
import { Flame, Flag } from "lucide-react-native";

export function StreakDisplay({ currentStreak, longestStreak }) {
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
      {/* Current Streak */}
      <View
        style={{
          paddingVertical: 16,
          alignItems: "center",
        }}
      >
        <Flame size={32} color="#f97316" style={{ marginBottom: 6 }} />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#fff",
            marginBottom: 2,
          }}
        >
          {currentStreak} days
        </Text>
        <Text style={{ fontSize: 13, color: "#888" }}>
          Current running streak
        </Text>
      </View>

      {/* Best Streak */}
      <View
        style={{
          paddingVertical: 16,
          alignItems: "center",
        }}
      >
        <Flag size={32} color="#fbbf24" style={{ marginBottom: 6 }} />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#fff",
            marginBottom: 2,
          }}
        >
          {longestStreak} days
        </Text>
        <Text style={{ fontSize: 13, color: "#888" }}>Best streak</Text>
      </View>
    </View>
  );
}
