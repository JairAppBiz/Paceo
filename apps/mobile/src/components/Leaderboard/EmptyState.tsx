// @ts-nocheck
import { View, Text } from "react-native";

export function EmptyState() {
  return (
    <View style={{ paddingVertical: 40, alignItems: "center" }}>
      <Text style={{ color: "#666", fontSize: 16 }}>No data yet</Text>
      <Text style={{ color: "#444", fontSize: 14, marginTop: 8 }}>
        Complete some runs to see the leaderboard!
      </Text>
    </View>
  );
}
