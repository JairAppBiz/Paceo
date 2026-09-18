// @ts-nocheck
import { View, TouchableOpacity, Text } from "react-native";

export function OtherRankings({ counts, onMedalPress }) {
  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      {/* Top 10 */}
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => onMedalPress("top10")}
        activeOpacity={0.7}
      >
        <View
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            padding: 16,
            alignItems: "center",
            borderWidth: 2,
            borderColor: counts.top10 > 0 ? "#3b82f6" : "#333",
            opacity: counts.top10 > 0 ? 1 : 0.5,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: counts.top10 > 0 ? "#fff" : "#666",
              fontWeight: "900",
            }}
          >
            {counts.top10}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: counts.top10 > 0 ? "#3b82f6" : "#666",
              fontWeight: "600",
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            Top 10
          </Text>
          {counts.top10 === 0 && (
            <Text style={{ fontSize: 8, color: "#444", marginTop: 2 }}>🔒</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Top 50 */}
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => onMedalPress("top50")}
        activeOpacity={0.7}
      >
        <View
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            padding: 16,
            alignItems: "center",
            borderWidth: 2,
            borderColor: counts.top50 > 0 ? "#10b981" : "#333",
            opacity: counts.top50 > 0 ? 1 : 0.5,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: counts.top50 > 0 ? "#fff" : "#666",
              fontWeight: "900",
            }}
          >
            {counts.top50}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: counts.top50 > 0 ? "#10b981" : "#666",
              fontWeight: "600",
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            Top 50
          </Text>
          {counts.top50 === 0 && (
            <Text style={{ fontSize: 8, color: "#444", marginTop: 2 }}>🔒</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Top 100 */}
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => onMedalPress("top100")}
        activeOpacity={0.7}
      >
        <View
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            padding: 16,
            alignItems: "center",
            borderWidth: 2,
            borderColor: counts.top100 > 0 ? "#8b5cf6" : "#333",
            opacity: counts.top100 > 0 ? 1 : 0.5,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: counts.top100 > 0 ? "#fff" : "#666",
              fontWeight: "900",
            }}
          >
            {counts.top100}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: counts.top100 > 0 ? "#8b5cf6" : "#666",
              fontWeight: "600",
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            Top 100
          </Text>
          {counts.top100 === 0 && (
            <Text style={{ fontSize: 8, color: "#444", marginTop: 2 }}>🔒</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
