// @ts-nocheck
import React, { useRef, useEffect } from "react";
import { Platform, Keyboard, Animated } from "react-native";

const KeyboardAvoidingAnimatedView = ({ children, style, ...props }) => {
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS === "web") return;

    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        Animated.timing(keyboardHeight, {
          toValue: e.endCoordinates.height,
          duration: e.duration || 250,
          useNativeDriver: false,
        }).start();
      },
    );

    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (e) => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: e.duration || 250,
          useNativeDriver: false,
        }).start();
      },
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardHeight]);

  if (Platform.OS === "web") {
    return (
      <Animated.View style={style} {...props}>
        {children}
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        style,
        {
          paddingBottom: keyboardHeight,
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

export default KeyboardAvoidingAnimatedView;
