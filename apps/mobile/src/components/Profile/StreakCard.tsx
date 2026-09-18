// @ts-nocheck
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Flame } from "lucide-react-native";

export function StreakCard({ currentStreak, longestStreak }) {
  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
      <LinearGradient
        colors={["#ef4444", "#f87171"]}
        style={{
          borderRadius: 16,
          padding: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Flame size={24} color="#fff" fill="#fff" />
          <Text
            style={{
              fontSize: 18,
              color: "#fff",
              fontWeight: "700",
              marginLeft: 8,
            }}
          >
            Streak
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 32 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 28,
                color: "#fff",
                fontWeight: "900",
              }}
            >
              {currentStreak}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.9)",
                marginTop: 4,
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Current
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 28,
                color: "#fff",
                fontWeight: "900",
              }}
            >
              {longestStreak}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.9)",
                marginTop: 4,
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Longest
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
