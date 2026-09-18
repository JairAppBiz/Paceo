// @ts-nocheck
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

export function TierCard({ tierData, isCurrentTier }) {
  return (
    <View
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: isCurrentTier ? tierData.gradient[0] : "transparent",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <LinearGradient
          colors={tierData.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Image
            source={{ uri: tierData.icon }}
            style={{ width: 28, height: 28 }}
            contentFit="contain"
          />
        </LinearGradient>

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {tierData.tier}
            </Text>
            {isCurrentTier && (
              <View
                style={{
                  backgroundColor: tierData.gradient[0],
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: "700",
                  }}
                >
                  YOU ARE HERE
                </Text>
              </View>
            )}
          </View>
          <Text
            style={{
              color: "#888",
              fontSize: 12,
            }}
          >
            {tierData.description}
          </Text>
        </View>
      </View>
    </View>
  );
}
