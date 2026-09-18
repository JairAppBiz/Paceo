// @ts-nocheck
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function StatsGrid({ stats }) {
  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          marginBottom: 12,
        }}
      >
        {/* Podiums - Blue gradient */}
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={["#3b82f6", "#60a5fa"]}
            style={{
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                color: "#fff",
                fontWeight: "900",
              }}
            >
              {stats.podiums}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.9)",
                fontWeight: "600",
                marginTop: 4,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Podiums
            </Text>
          </LinearGradient>
        </View>

        {/* Medals - Purple gradient */}
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={["#8b5cf6", "#a78bfa"]}
            style={{
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                color: "#fff",
                fontWeight: "900",
              }}
            >
              {stats.medals}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.9)",
                fontWeight: "600",
                marginTop: 4,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Medals
            </Text>
          </LinearGradient>
        </View>
      </View>

      {/* Monthly Miles - Teal gradient */}
      <LinearGradient
        colors={["#06b6d4", "#22d3ee"]}
        style={{
          borderRadius: 16,
          padding: 20,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            color: "#fff",
            fontWeight: "900",
          }}
        >
          {stats.monthlyMiles.toFixed(1)} Mi
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
          This Month
        </Text>
      </LinearGradient>
    </View>
  );
}
