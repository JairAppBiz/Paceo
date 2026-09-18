// @ts-nocheck
import { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

export function SkeletonBox({ width, height, style }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: "#2a2a2a",
          borderRadius: 12,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonLeaderboardRow() {
  return (
    <View
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <SkeletonBox
        width={40}
        height={40}
        style={{ borderRadius: 9999, marginRight: 16 }}
      />
      <View style={{ flex: 1 }}>
        <SkeletonBox width="60%" height={16} style={{ marginBottom: 8 }} />
        <SkeletonBox width="40%" height={12} />
      </View>
      <SkeletonBox width={60} height={24} style={{ borderRadius: 12 }} />
    </View>
  );
}

export function SkeletonFeedPost() {
  return (
    <View
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 16,
      }}
    >
      {/* Header */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <SkeletonBox
          width={44}
          height={44}
          style={{ borderRadius: 9999, marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <SkeletonBox width="50%" height={16} style={{ marginBottom: 8 }} />
          <SkeletonBox width="30%" height={12} />
        </View>
      </View>

      {/* Content */}
      <SkeletonBox width="100%" height={60} style={{ marginBottom: 16 }} />

      {/* Footer */}
      <View style={{ flexDirection: "row", gap: 16 }}>
        <SkeletonBox width={60} height={32} style={{ borderRadius: 9999 }} />
        <SkeletonBox width={60} height={32} style={{ borderRadius: 9999 }} />
      </View>
    </View>
  );
}

export function SkeletonProfileStats() {
  return (
    <View style={{ padding: 20, gap: 12 }}>
      {/* Top row */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <SkeletonBox width="48%" height={100} style={{ borderRadius: 16 }} />
        <SkeletonBox width="48%" height={100} style={{ borderRadius: 16 }} />
      </View>

      {/* Bottom row */}
      <SkeletonBox width="100%" height={100} style={{ borderRadius: 16 }} />
      <SkeletonBox width="100%" height={100} style={{ borderRadius: 16 }} />
    </View>
  );
}
