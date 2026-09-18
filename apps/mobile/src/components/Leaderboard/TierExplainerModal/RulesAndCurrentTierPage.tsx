// @ts-nocheck
import { View, Text, Dimensions } from "react-native";
import { CurrentTierCard } from "./CurrentTierCard";
import { TierRulesCard } from "./TierRulesCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function RulesAndCurrentTierPage({ currentTierData, locationLabel }) {
  return (
    <View
      style={{
        width: SCREEN_WIDTH,
        padding: 20,
        justifyContent: "center",
      }}
    >
      <CurrentTierCard
        tierData={currentTierData}
        locationLabel={locationLabel}
      />
      <TierRulesCard />

      {/* Swipe Hint */}
      <Text
        style={{
          color: "#666",
          fontSize: 14,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Swipe to see all tiers →
      </Text>
    </View>
  );
}
