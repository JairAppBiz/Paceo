// @ts-nocheck
import { View, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

export function TierPromotionPost({ post, shimmerAnim }) {
  const getTierGradient = () => {
    if (post.promotion_badge === "Apex") {
      return ["#8b5cf6", "#7c3aed", "#6d28d9"]; // Purple
    } else if (post.promotion_badge === "Ranger") {
      return ["#10b981", "#059669", "#047857"]; // Green
    } else {
      return ["#3b82f6", "#2563eb", "#1d4ed8"]; // Blue
    }
  };

  const getTierIconUrl = () => {
    if (post.promotion_badge === "Apex") {
      return "https://raw.createusercontent.com/20703a77-61e1-416a-9808-bcd9a5b02834/";
    }
    if (post.promotion_badge === "Ranger") {
      return "https://raw.createusercontent.com/453eff42-636b-45db-8144-afc1e650d023/";
    }
    return "https://raw.createusercontent.com/018ad631-d524-4678-8feb-729a3737f842/"; // Scout
  };

  const getTierColor = () => {
    if (post.promotion_badge === "Apex") return "#ef4444";
    if (post.promotion_badge === "Ranger") return "#3b82f6";
    return "#10b981";
  };

  const tierColor = getTierColor();

  return (
    <View style={{ marginBottom: 10, borderRadius: 12, overflow: "hidden" }}>
      <LinearGradient
        colors={getTierGradient()}
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
              backgroundColor: tierColor,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Image
              source={{ uri: getTierIconUrl() }}
              style={{ width: 32, height: 32 }}
              contentFit="contain"
            />
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
                {post.promotion_badge} BADGE
              </Text>
            </View>

            <Text
              style={{
                color: "#fff",
                fontSize: 15,
                fontWeight: "800",
                marginBottom: 2,
                textShadowColor: "rgba(0,0,0,0.3)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
              numberOfLines={1}
            >
              Tier Promotion!
            </Text>

            <Text
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 11,
                fontWeight: "600",
                marginBottom: 6,
              }}
              numberOfLines={1}
            >
              {post.promotion_category} • {post.promotion_from_tier} →{" "}
              {post.promotion_to_tier}
            </Text>

            {post.promotion_to_location && (
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
                    fontSize: 11,
                    fontWeight: "700",
                  }}
                  numberOfLines={1}
                >
                  📍 {post.promotion_to_location}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ position: "absolute", top: 6, left: 6 }}>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>⭐</Text>
        </View>
        <View style={{ position: "absolute", top: 6, right: 6 }}>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>⭐</Text>
        </View>
        <View style={{ position: "absolute", bottom: 6, left: 6 }}>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>⭐</Text>
        </View>
        <View style={{ position: "absolute", bottom: 6, right: 6 }}>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>⭐</Text>
        </View>
      </LinearGradient>
    </View>
  );
}
