// @ts-nocheck
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TrendingUp, TrendingDown, Target, Trophy } from "lucide-react-native";
import { useState } from "react";
import { TierExplainerModal } from "./TierExplainerModal";
import { TierBadgeDisplay } from "./TierBadgeDisplay";

// Tier gradient colors
const TIER_GRADIENTS = {
  scout: ["#10b981", "#34d399"],
  ranger: ["#3b82f6", "#60a5fa"],
  apex: ["#ef4444", "#f87171"],
  legend: ["#f59e0b", "#fbbf24"],
};

export function TierProgressBar({
  currentRank,
  totalUsers,
  currentTier,
  location,
  value,
  unit,
  nextTierThreshold,
  demotionThreshold,
  category,
  // Filter props - only period needed
  selectedPeriod,
  onPeriodChange,
}) {
  const [showModal, setShowModal] = useState(false);

  // Only require rank and totalUsers - tier can be null for fun categories
  if (!currentRank || !totalUsers) {
    return null;
  }

  // Format pace as MM:SS /mi
  const formatPace = (pace) => {
    const paceNum = parseFloat(pace);
    const mins = Math.floor(paceNum);
    const secs = Math.round((paceNum - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")} /mi`;
  };

  // Format value based on unit
  const formatValue = (val, unitStr) => {
    if (unitStr === "min/mi") {
      return formatPace(val);
    }
    return `${val.toFixed(1)} ${unitStr}`;
  };

  const percentile = (currentRank / totalUsers) * 100;
  const isFunCategory = !currentTier; // Fun categories don't have tiers

  // Determine what zone the user is in
  const inPromotionZone = percentile <= 15; // Top 15%
  const inDemotionZone = percentile > 90; // Bottom 10%
  const inSafeZone = !inPromotionZone && !inDemotionZone;

  // Determine status and messaging
  let statusText, statusColor, Icon, progressPercent, barColors;

  if (isFunCategory) {
    // Fun categories - simpler messaging, no tier promotion/demotion
    if (inPromotionZone) {
      Icon = Trophy;
      statusColor = "#fbbf24";
      statusText = "Top tier! 🏆";
      barColors = ["#fbbf24", "#fde047"];
      progressPercent = 100 - (percentile / 15) * 15;
    } else if (inDemotionZone) {
      Icon = Target;
      statusColor = "#888888";
      statusText = "Room to climb 📈";
      barColors = ["#666666", "#888888"];
      progressPercent = 10 - ((percentile - 90) / 10) * 10;
    } else {
      Icon = Target;
      statusColor = "#3b82f6";
      statusText = "Solid ranking! 💪";
      barColors = ["#3b82f6", "#60a5fa"];
      progressPercent = 85 - ((percentile - 15) / 75) * 75;
    }
  } else {
    // Tier categories - full promotion/demotion messaging
    if (inPromotionZone) {
      Icon = TrendingUp;
      statusColor = "#10b981";
      statusText = "En route to promotion! 🎉";
      barColors = ["#10b981", "#34d399"];
      progressPercent = 100 - (percentile / 15) * 15;
    } else if (inDemotionZone) {
      Icon = TrendingDown;
      statusColor = "#ef4444";
      barColors = ["#ef4444", "#f87171"];
      if (demotionThreshold && value < demotionThreshold) {
        const gap =
          unit === "min/mi"
            ? formatPace(demotionThreshold - value)
            : (demotionThreshold - value).toFixed(1);
        statusText = `${gap} to safe zone`;
      } else {
        statusText = "At risk of demotion";
      }
      progressPercent = 10 - ((percentile - 90) / 10) * 10;
    } else {
      Icon = Target;
      statusColor = "#3b82f6";
      barColors = ["#3b82f6", "#60a5fa"];
      statusText = "Safe - keep it up! 💪";
      progressPercent = 85 - ((percentile - 15) / 75) * 75;
    }
  }

  return (
    <>
      <Pressable
        onPress={!isFunCategory ? () => setShowModal(true) : undefined}
      >
        <View
          style={{
            backgroundColor: "#0f0f0f",
            borderRadius: 16,
            padding: 16,
            marginHorizontal: 20,
            marginTop: 16,
            borderWidth: 1,
            borderColor: "#262626",
          }}
        >
          {/* Status Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Icon size={18} color={statusColor} />
              <Text
                style={{
                  color: statusColor,
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                {statusText}
              </Text>
            </View>
            <Text
              style={{
                color: "#888888",
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              Rank {currentRank}/{totalUsers}
            </Text>
          </View>

          {/* Progress Bar with Labels */}
          <View style={{ gap: 8 }}>
            <View
              style={{
                height: 8,
                backgroundColor: "#1a1a1a",
                borderRadius: 4,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "#262626",
              }}
            >
              <LinearGradient
                colors={barColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: "100%",
                  width: `${progressPercent}%`,
                  borderRadius: 3,
                }}
              />
            </View>

            {/* Zone Labels Below Bar */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: inDemotionZone ? "#ef4444" : "#666666",
                  fontSize: 11,
                  fontWeight: "600",
                }}
              >
                {isFunCategory ? "📉 Bottom 10%" : "⬇️ Bottom 10%"}
              </Text>
              <Text
                style={{
                  color: "#888888",
                  fontSize: 11,
                  fontWeight: "500",
                }}
              >
                {isFunCategory ? "City only" : "Tap for tier info"}
              </Text>
              <Text
                style={{
                  color: inPromotionZone ? "#10b981" : "#666666",
                  fontSize: 11,
                  fontWeight: "600",
                }}
              >
                {isFunCategory ? "Top 15% 🏆" : "Top 15% ⬆️"}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>

      {!isFunCategory && (
        <TierExplainerModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          currentTier={currentTier}
          currentLocation={location}
          currentCategory={category}
          selectedPeriod={selectedPeriod}
          onPeriodChange={onPeriodChange}
        />
      )}
    </>
  );
}
