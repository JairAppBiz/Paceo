// @ts-nocheck
import { useEffect, useState, useRef } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";

export default function Index() {
  const [onboardingComplete, setOnboardingComplete] = useState(null);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!hasChecked.current) {
      hasChecked.current = true;
      AsyncStorage.getItem("onboarding_complete").then((val) => {
        console.log("Index: Onboarding status =", val);
        setOnboardingComplete(val === "true");
      });
    }
  }, []);

  // Show loading screen while checking
  if (onboardingComplete === null) {
    return <View style={{ flex: 1, backgroundColor: "#F53D2D" }} />;
  }

  if (!onboardingComplete) {
    console.log("Index: Redirecting to onboarding");
    return <Redirect href="/onboarding" />;
  }

  console.log("Index: Redirecting to home");
  return <Redirect href="/(tabs)/home" />;
}
