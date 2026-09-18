// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useTheme } from "@/utils/themeStore";

// Tier gradient colors
const TIER_GRADIENTS = {
  scout: ["#10b981", "#34d399"],
  ranger: ["#3b82f6", "#60a5fa"],
  apex: ["#ef4444", "#f87171"],
  legend: ["#f59e0b", "#fbbf24"],
};

// Custom tier icons
const TIER_ICONS = {
  scout:
    "https://raw.createusercontent.com/018ad631-d524-4678-8feb-729a3737f842/",
  ranger:
    "https://raw.createusercontent.com/453eff42-636b-45db-8144-afc1e650d023/",
  apex: "https://raw.createusercontent.com/20703a77-61e1-416a-9808-bcd9a5b02834/",
  legend:
    "https://raw.createusercontent.com/70ea0c42-0563-4d67-a000-a4244c5345f4/",
};

const TIER_LABELS = {
  scout: "Scout",
  ranger: "Ranger",
  apex: "Apex",
  legend: "Legend",
};

const LOCATION_LABELS = {
  city: "City",
  state: "State",
  country: "Country",
  global: "Global",
};

export function TierTracking({ tierData, onEditPress }) {
  const { colors } = useTheme();

  if (!tierData) {
    return (
      <View
        style={{
          backgroundColor: colors.cardBackground,
          padding: 16,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: colors.textSecondary,
            fontWeight: "600",
            marginBottom: 12,
          }}
        >
          Tier Progress
        </Text>

        <Text
          style={{
            fontSize: 12,
            color: colors.textTertiary,
            textAlign: "center",
            paddingVertical: 12,
          }}
        >
          Select a category to track
        </Text>
      </View>
    );
  }

  const {
    category,
    tier,
    rank,
    totalUsers,
    value,
    unit,
    nextTierThreshold,
    location,
  } = tierData;

  // Convert value to number to ensure toFixed works
  const numericValue = parseFloat(value) || 0;
  const numericThreshold = parseFloat(nextTierThreshold) || 0;

  const gradient = TIER_GRADIENTS[tier] || ["#666", "#888"];
  const iconUrl = TIER_ICONS[tier];
  const tierLabel = TIER_LABELS[tier] || tier;
  const locationLabel = LOCATION_LABELS[location] || location;

  const percentile = rank && totalUsers ? (rank / totalUsers) * 100 : 0;
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  // Determine percentile color based on zone
  let percentileColor = "#ffffff"; // Default white for safe zone
  if (percentile <= 15) {
    percentileColor = "#10b981"; // Green for promotion zone
  } else if (percentile > 90) {
    percentileColor = "#ef4444"; // Red for demotion zone
  }

  // Calculate progress bar percentage
  let progressPercent = 0;
  let statusText = "";
  let statusColor = "#888";

  if (percentile <= 15) {
    progressPercent = 100;
    statusText = "Promotion Range!";
    statusColor = "#10b981";
  } else if (percentile > 90) {
    progressPercent = 10;
    statusText = "At Risk";
    statusColor = "#ef4444";
  } else {
    progressPercent = 90 - ((percentile - 15) / 75) * 80;
    if (numericThreshold > 0) {
      const gap = (numericThreshold - numericValue).toFixed(1);
      statusText = `${gap} ${unit} to promotion`;
    } else {
      statusText = `Top ${percentile.toFixed(0)}%`;
    }
  }

  return (
    <View
      style={{
        backgroundColor: colors.cardBackground,
        padding: 16,
        borderRadius: 12,
      }}
    >
      {/* Header */}
      <Text
        style={{
          fontSize: 15,
          color: colors.textSecondary,
          fontWeight: "600",
          marginBottom: 8,
        }}
      >
        Tier Progress
      </Text>

      {/* Current Tier Badge */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {iconUrl && (
            <Image
              source={{ uri: iconUrl }}
              style={{ width: 18, height: 18 }}
              contentFit="contain"
            />
          )}
        </LinearGradient>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.text,
            }}
          >
            {locationLabel} {tierLabel}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.textSecondary,
            }}
          >
            {categoryLabel} • Rank {rank} of {totalUsers}
          </Text>
        </View>
      </View>

      {/* Status Text */}
      <Text
        style={{
          fontSize: 12,
          color: statusColor,
          fontWeight: "600",
          marginBottom: 6,
        }}
      >
        {statusText}
      </Text>

      {/* Progress Bar */}
      <View
        style={{
          height: 5,
          backgroundColor: colors.secondaryBackground,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={progressPercent >= 90 ? gradient : ["#666", "#888"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: "100%",
            width: `${progressPercent}%`,
            borderRadius: 3,
          }}
        />
      </View>

      {/* Stats Footer */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 6,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            color: colors.textSecondary,
          }}
        >
          {numericValue.toFixed(1)} {unit} this month
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: percentileColor,
            fontWeight: "600",
          }}
        >
          Top {percentile.toFixed(0)}%
        </Text>
      </View>
    </View>
  );
}
