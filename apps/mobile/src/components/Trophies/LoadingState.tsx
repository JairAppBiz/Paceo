// @ts-nocheck
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";

export function LoadingState() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#fbbf24" />
      <StatusBar style="light" />
    </View>
  );
}
