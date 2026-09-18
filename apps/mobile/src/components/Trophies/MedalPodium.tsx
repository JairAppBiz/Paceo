// @ts-nocheck
import { View, TouchableOpacity, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function MedalPodium({ counts, onMedalPress, goldShimmer, bounceAnim }) {
  const shimmerOpacity = goldShimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <Animated.View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 12,
        marginBottom: 8,
        transform: [{ scale: bounceAnim }],
      }}
    >
      {/* Silver - 2nd Place (left, medium height) */}
      <TouchableOpacity
        style={{ width: 100, alignItems: "center" }}
        onPress={() => onMedalPress("silver")}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={
            counts.silver > 0 ? ["#e5e7eb", "#9ca3af"] : ["#2a2a2a", "#1a1a1a"]
          }
          style={{
            borderRadius: 16,
            padding: 16,
            paddingTop: 24,
            paddingBottom: 32,
            width: "100%",
            alignItems: "center",
            opacity: counts.silver > 0 ? 1 : 0.5,
            shadowColor: counts.silver > 0 ? "#e5e7eb" : "transparent",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 32, marginBottom: 4 }}>🥈</Text>
          <Text
            style={{
              fontSize: 24,
              color: counts.silver > 0 ? "#000" : "#666",
              fontWeight: "900",
            }}
          >
            {counts.silver}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: counts.silver > 0 ? "#000" : "#666",
              fontWeight: "600",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            Silver
          </Text>
          {counts.silver === 0 && (
            <Text style={{ fontSize: 9, color: "#444", marginTop: 4 }}>
              🔒 Locked
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Gold - 1st Place (center, tallest) */}
      <TouchableOpacity
        style={{ width: 110, alignItems: "center" }}
        onPress={() => onMedalPress("gold")}
        activeOpacity={0.7}
      >
        <Animated.View
          style={{ opacity: counts.gold > 0 ? shimmerOpacity : 0.5 }}
        >
          <LinearGradient
            colors={
              counts.gold > 0 ? ["#fbbf24", "#f59e0b"] : ["#2a2a2a", "#1a1a1a"]
            }
            style={{
              borderRadius: 20,
              padding: 20,
              paddingTop: 32,
              paddingBottom: 40,
              width: "100%",
              alignItems: "center",
              borderWidth: 2,
              borderColor: counts.gold > 0 ? "#fbbf24" : "#333",
              shadowColor: counts.gold > 0 ? "#fbbf24" : "transparent",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.5,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text style={{ fontSize: 40, marginBottom: 6 }}>🥇</Text>
            <Text
              style={{
                fontSize: 32,
                color: counts.gold > 0 ? "#000" : "#666",
                fontWeight: "900",
              }}
            >
              {counts.gold}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: counts.gold > 0 ? "#000" : "#666",
                fontWeight: "600",
                textTransform: "uppercase",
                marginTop: 4,
              }}
            >
              Gold
            </Text>
            {counts.gold === 0 && (
              <Text style={{ fontSize: 9, color: "#444", marginTop: 4 }}>
                🔒 Locked
              </Text>
            )}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>

      {/* Bronze - 3rd Place (right, shortest) */}
      <TouchableOpacity
        style={{ width: 100, alignItems: "center" }}
        onPress={() => onMedalPress("bronze")}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={
            counts.bronze > 0 ? ["#f97316", "#c2410c"] : ["#2a2a2a", "#1a1a1a"]
          }
          style={{
            borderRadius: 16,
            padding: 16,
            paddingTop: 20,
            paddingBottom: 24,
            width: "100%",
            alignItems: "center",
            opacity: counts.bronze > 0 ? 1 : 0.5,
            shadowColor: counts.bronze > 0 ? "#f97316" : "transparent",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 32, marginBottom: 4 }}>🥉</Text>
          <Text
            style={{
              fontSize: 24,
              color: counts.bronze > 0 ? "#fff" : "#666",
              fontWeight: "900",
            }}
          >
            {counts.bronze}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: counts.bronze > 0 ? "#fff" : "#666",
              fontWeight: "600",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            Bronze
          </Text>
          {counts.bronze === 0 && (
            <Text style={{ fontSize: 9, color: "#444", marginTop: 4 }}>
              🔒 Locked
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}
