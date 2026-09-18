// @ts-nocheck
import { useRef, useEffect } from "react";
import { Animated } from "react-native";

export function useShimmerAnimation(shouldAnimate) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shouldAnimate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.delay(3000),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.delay(3000),
        ]),
      ).start();
    }
  }, [shouldAnimate, shimmerAnim]);

  return shimmerAnim;
}
