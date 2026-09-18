// @ts-nocheck
import { View, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function AchievementPost({ post, shimmerAnim }) {
  return (
    <View style={{ marginBottom: 10, borderRadius: 12, overflow: "hidden" }}>
      <LinearGradient
        colors={["#fbbf24", "#f59e0b", "#d97706"]}
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
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "rgba(255,255,255,0.95)",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 36 }}>{post.achievement_icon}</Text>
          </View>

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
                🏆 Achievement
              </Text>
            </View>

            <Text
              style={{
                color: "#1a1a1a",
                fontSize: 15,
                fontWeight: "800",
                marginBottom: 2,
                textShadowColor: "rgba(255,255,255,0.3)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
              numberOfLines={1}
            >
              {post.achievement_name}
            </Text>

            <Text
              style={{
                color: "#78350f",
                fontSize: 11,
                fontWeight: "600",
                marginBottom: 6,
              }}
              numberOfLines={2}
            >
              {post.achievement_description}
            </Text>

            {post.achievement_criteria_value && (
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.85)",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                  alignSelf: "flex-start",
                  borderWidth: 1.5,
                  borderColor: "rgba(217,119,6,0.3)",
                }}
              >
                <Text
                  style={{
                    color: "#1a1a1a",
                    fontSize: 13,
                    fontWeight: "800",
                  }}
                >
                  {post.achievement_criteria_value}{" "}
                  {post.achievement_criteria_type === "distance"
                    ? "miles"
                    : post.achievement_criteria_type === "runs"
                      ? "runs"
                      : post.achievement_criteria_type}
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
