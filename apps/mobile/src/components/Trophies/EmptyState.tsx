// @ts-nocheck
import { View, Text } from "react-native";
import { Trophy } from "lucide-react-native";

export function EmptyState() {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 40,
        alignItems: "center",
      }}
    >
      <Trophy size={64} color="#fbbf24" />
      <Text
        style={{
          fontSize: 24,
          color: "#fff",
          fontWeight: "700",
          marginTop: 20,
          textAlign: "center",
        }}
      >
        Start Your Collection!
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#888",
          marginTop: 8,
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        Here's how to earn your first medal
      </Text>

      <View style={{ width: "100%", gap: 16 }}>
        <View
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#fbbf24",
          }}
        >
          <Text style={{ fontSize: 40, marginRight: 16 }}>🥇</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                color: "#fff",
                fontWeight: "700",
                marginBottom: 4,
              }}
            >
              Finish #1
            </Text>
            <Text style={{ fontSize: 14, color: "#888" }}>
              Top the leaderboard in any category
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#3b82f6",
          }}
        >
          <Text style={{ fontSize: 40, marginRight: 16 }}>🔵</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                color: "#fff",
                fontWeight: "700",
                marginBottom: 4,
              }}
            >
              Make Top 10
            </Text>
            <Text style={{ fontSize: 14, color: "#888" }}>
              Finish in the top 10 of any period
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#8b5cf6",
          }}
        >
          <Text style={{ fontSize: 40, marginRight: 16 }}>🟣</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                color: "#fff",
                fontWeight: "700",
                marginBottom: 4,
              }}
            >
              Reach Top 100
            </Text>
            <Text style={{ fontSize: 14, color: "#888" }}>
              Get into the top 100 runners
            </Text>
          </View>
        </View>
      </View>

      <Text
        style={{
          fontSize: 15,
          color: "#666",
          marginTop: 32,
          textAlign: "center",
        }}
      >
        Keep running and check the leaderboard to see your progress! 💪
      </Text>
    </View>
  );
}
