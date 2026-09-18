// @ts-nocheck
import { View, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Custom Medal Icon Component with Blue Ribbon - matching Trophy Room
function MedalIcon({ rank, color, size = 64 }) {
  const ribbonWidth = size * 0.15;
  const ribbonHeight = size * 0.25;
  const medalSize = size * 0.6;
  const fontSize = size * 0.3;

  return (
    <View style={{ alignItems: "center" }}>
      {/* Blue Ribbon */}
      <View
        style={{
          flexDirection: "row",
          gap: 4,
          marginBottom: -8,
          zIndex: 1,
        }}
      >
        <View
          style={{
            width: ribbonWidth,
            height: ribbonHeight,
            backgroundColor: "#6b9ff5",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        />
        <View
          style={{
            width: ribbonWidth,
            height: ribbonHeight,
            backgroundColor: "#548ff0",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        />
      </View>

      {/* Medal Circle */}
      <View
        style={{
          width: medalSize,
          height: medalSize,
          borderRadius: medalSize / 2,
          backgroundColor: color,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontSize: fontSize,
            fontWeight: "700",
            color: rank === 2 ? "#4a4a4a" : "#5a3a2a",
          }}
        >
          {rank}
        </Text>
      </View>
    </View>
  );
}

export function MedalPost({ post, shimmerAnim }) {
  const getMedalGradient = () => {
    if (post.medal_rank === 1) {
      return ["#fbbf24", "#f59e0b", "#d97706"]; // Gold
    } else if (post.medal_rank === 2) {
      return ["#94a3b8", "#64748b", "#475569"]; // Silver
    } else {
      return ["#d97706", "#92400e", "#78350f"]; // Bronze
    }
  };

  const getMedalColor = (rank) => {
    if (rank === 1) return "#f5c563"; // Gold
    if (rank === 2) return "#c0c0c0"; // Silver
    if (rank === 3) return "#cd9575"; // Bronze
    return "#888";
  };

  const getPeriodText = () => {
    if (post.medal_period === "monthly") return "This Month";
    if (post.medal_period === "weekly") return "This Week";
    return "All Time";
  };

  return (
    <View style={{ marginBottom: 10, borderRadius: 12, overflow: "hidden" }}>
      <LinearGradient
        colors={getMedalGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: 14,
          position: "relative",
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: shimmerAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.3, 0],
            }),
            transform: [
              {
                translateX: shimmerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-300, 300],
                }),
              },
            ],
          }}
        >
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.4)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: 200,
              height: "100%",
            }}
          />
        </Animated.View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <MedalIcon
            rank={post.medal_rank}
            color={getMedalColor(post.medal_rank)}
            size={64}
          />

          <View style={{ flex: 1 }}>
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.2)",
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 10,
                alignSelf: "flex-start",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: "800",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                {post.medal_tier?.toUpperCase()} MEDAL
              </Text>
            </View>

            <Text
              style={{
                color: post.medal_rank === 2 ? "#1a1a1a" : "#fff",
                fontSize: 15,
                fontWeight: "800",
                marginBottom: 2,
                textShadowColor: "rgba(0,0,0,0.3)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
              numberOfLines={1}
            >
              #{post.medal_rank} in {post.medal_category}
            </Text>

            <Text
              style={{
                color:
                  post.medal_rank === 2 ? "#1e293b" : "rgba(255,255,255,0.9)",
                fontSize: 11,
                fontWeight: "600",
                marginBottom: 6,
              }}
              numberOfLines={1}
            >
              {getPeriodText()}
              {post.medal_location && ` • ${post.medal_location}`}
            </Text>

            {post.medal_value && (
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.85)",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                  alignSelf: "flex-start",
                  borderWidth: 1.5,
                  borderColor: "rgba(255,255,255,0.3)",
                }}
              >
                <Text
                  style={{
                    color: "#1a1a1a",
                    fontSize: 13,
                    fontWeight: "800",
                  }}
                >
                  {Number(post.medal_value).toLocaleString()} {post.medal_unit}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ position: "absolute", top: 6, left: 6 }}>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>✨</Text>
        </View>
        <View style={{ position: "absolute", top: 6, right: 6 }}>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>✨</Text>
        </View>
        <View style={{ position: "absolute", bottom: 6, left: 6 }}>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>✨</Text>
        </View>
        <View style={{ position: "absolute", bottom: 6, right: 6 }}>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>✨</Text>
        </View>
      </LinearGradient>
    </View>
  );
}
