// @ts-nocheck
import { View, Text, ScrollView, Dimensions } from "react-native";
import { TIER_STRUCTURE } from "@/constants/tierStructure";
import { TierCard } from "./TierCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function TierProgressionPage({ currentTier, currentLocation }) {
  const renderLocationTiers = (location, emoji, label) => {
    const tiers = TIER_STRUCTURE[location];
    if (!tiers) return null;

    return (
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 12,
            paddingLeft: 4,
          }}
        >
          {emoji} {label}
        </Text>
        {tiers.map((tierData) => {
          const isCurrentTier =
            tierData.tier.toLowerCase() === currentTier.toLowerCase() &&
            currentLocation.toLowerCase() === location;

          return (
            <TierCard
              key={`${location}-${tierData.tier}`}
              tierData={tierData}
              isCurrentTier={isCurrentTier}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ width: SCREEN_WIDTH, padding: 20, paddingTop: 80 }}>
      <Text
        style={{
          color: "#fff",
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Tier Progression
      </Text>
      <Text
        style={{
          color: "#888",
          fontSize: 14,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        Climb through tiers and locations
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {renderLocationTiers("city", "🏙️", "City Level")}
        {renderLocationTiers("state", "🗺️", "State Level")}
        {renderLocationTiers("country", "🌎", "Country Level")}
        {renderLocationTiers("global", "🌍", "Global Level")}
      </ScrollView>
    </View>
  );
}
