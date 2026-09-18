// @ts-nocheck
import { TouchableOpacity, Text, Animated } from "react-native";
import { useRef } from "react";
import * as Haptics from "expo-haptics";
import { Play, Rocket } from "lucide-react-native";

export function RunButton({ onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={{
          backgroundColor: "#60a5fa",
          paddingVertical: 18,
          borderRadius: 16,
          marginBottom: 40,
          marginHorizontal: 20,
          shadowColor: "#60a5fa",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={1}
      >
        <Play size={22} color="#000" fill="#000" style={{ marginRight: 8 }} />
        <Text
          style={{
            color: "#000",
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          Let's Run!
        </Text>
        <Rocket size={20} color="#000" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </Animated.View>
  );
}
