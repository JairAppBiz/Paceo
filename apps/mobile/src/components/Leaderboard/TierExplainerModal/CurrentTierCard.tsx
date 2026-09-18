// @ts-nocheck
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

export function CurrentTierCard({ tierData, locationLabel }) {
  return (
    <View
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        alignItems: "center",
        borderWidth: 2,
        borderColor: tierData.gradient[0],
      }}
    >
      <Text
        style={{
          color: "#10b981",
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 1,
          marginBottom: 12,
        }}
      >
        YOUR CURRENT TIER
      </Text>

      <LinearGradient
        colors={tierData.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <Image
          source={{ uri: tierData.icon }}
          style={{ width: 42, height: 42 }}
          contentFit="contain"
        />
      </LinearGradient>

      <Text
        style={{
          color: "#fff",
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 4,
        }}
      >
        {locationLabel} {tierData.tier}
      </Text>
      <Text
        style={{
          color: "#bbb",
          fontSize: 13,
          textAlign: "center",
        }}
      >
        {tierData.description}
      </Text>
    </View>
  );
}
