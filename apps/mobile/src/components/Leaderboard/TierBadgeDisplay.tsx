// @ts-nocheck
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useState } from "react";
import { TierExplainerModal } from "./TierExplainerModal";

// Tier configurations with custom cartoony icons
const TIER_CONFIG = {
  scout: {
    label: "Scout",
    iconUrl:
      "https://raw.createusercontent.com/018ad631-d524-4678-8feb-729a3737f842/",
    gradient: ["#10b981", "#34d399"],
    bgColor: "rgba(16, 185, 129, 0.1)",
  },
  ranger: {
    label: "Ranger",
    iconUrl:
      "https://raw.createusercontent.com/453eff42-636b-45db-8144-afc1e650d023/",
    gradient: ["#3b82f6", "#60a5fa"],
    bgColor: "rgba(59, 130, 246, 0.1)",
  },
  apex: {
    label: "Apex",
    iconUrl:
      "https://raw.createusercontent.com/20703a77-61e1-416a-9808-bcd9a5b02834/",
    gradient: ["#ef4444", "#f87171"],
    bgColor: "rgba(239, 68, 68, 0.1)",
  },
  legend: {
    label: "Legend",
    iconUrl:
      "https://raw.createusercontent.com/70ea0c42-0563-4d67-a000-a4244c5345f4/",
    gradient: ["#f59e0b", "#fbbf24"],
    bgColor: "rgba(245, 158, 11, 0.1)",
  },
};

const LOCATION_LABELS = {
  city: "City",
  state: "State",
  country: "Country",
  global: "Global",
};

export function TierBadgeDisplay({
  tier,
  location,
  category,
  compact = false,
  // Filter props - only period needed
  selectedPeriod,
  onPeriodChange,
}) {
  const [showModal, setShowModal] = useState(false);

  if (!tier || !location) return null;

  const config = TIER_CONFIG[tier];
  if (!config) return null;

  const locationLabel = LOCATION_LABELS[location] || location;

  if (compact) {
    return (
      <>
        <Pressable onPress={() => setShowModal(true)}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
              backgroundColor: tier === "scout" ? "#10b981" : "#0a0a0a",
              borderRadius: 8,
            }}
          >
            {tier === "scout" ? (
              <Image
                source={{ uri: config.iconUrl }}
                style={{ width: 16, height: 16 }}
                contentFit="contain"
              />
            ) : (
              <LinearGradient
                colors={config.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: config.iconUrl }}
                  style={{ width: 12, height: 12 }}
                  contentFit="contain"
                />
              </LinearGradient>
            )}
            <Text
              style={{
                fontSize: 10,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              {locationLabel} {config.label}
            </Text>
          </View>
        </Pressable>

        <TierExplainerModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          currentTier={tier}
          currentLocation={location}
          currentCategory={category}
          selectedCategory={category}
          defaultCategory={category}
          onSaveDefaultCategory={() => {}}
          selectedPeriod={selectedPeriod}
          onPeriodChange={onPeriodChange}
        />
      </>
    );
  }

  return (
    <>
      <Pressable onPress={() => setShowModal(true)}>
        <View
          style={{
            alignSelf: "flex-start",
            marginLeft: 16,
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          <LinearGradient
            colors={config.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 20,
              gap: 6,
            }}
          >
            <Image
              source={{ uri: config.iconUrl }}
              style={{ width: 18, height: 18 }}
              contentFit="contain"
            />
            <Text
              style={{
                color: "#fff",
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              {locationLabel} {config.label}
            </Text>
          </LinearGradient>
        </View>
      </Pressable>

      <TierExplainerModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        currentTier={tier}
        currentLocation={location}
        currentCategory={category}
        selectedCategory={category}
        defaultCategory={category}
        onSaveDefaultCategory={() => {}}
        selectedPeriod={selectedPeriod}
        onPeriodChange={onPeriodChange}
      />
    </>
  );
}
