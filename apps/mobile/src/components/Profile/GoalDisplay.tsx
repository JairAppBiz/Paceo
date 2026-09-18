// @ts-nocheck
import React from "react";
import { View, Text } from "react-native";
import { Target } from "lucide-react-native";
import CategoryIcon from "../CategoryIcon";
import { useTheme } from "@/utils/themeStore";

export function GoalDisplay({ goalData }) {
  const { colors } = useTheme();

  if (!goalData?.hasGoal) {
    return null;
  }

  const { category, target, period, currentValue, progressPercentage } =
    goalData;

  const getUnitLabel = (cat) => {
    const units = {
      miles: "mi",
      runs: "runs",
      elevation: "ft",
      speed: "min/mi",
      time: "min",
      calories: "cal",
      steps: "steps",
    };
    return units[cat] || "";
  };

  const getPeriodLabel = (p) => {
    const labels = {
      week: "Week",
      month: "Month",
      year: "Year",
    };
    return labels[p] || p;
  };

  const formatValue = (value, cat) => {
    if (cat === "speed") {
      // Format pace as mm:ss
      const minutes = Math.floor(value);
      const seconds = Math.round((value - minutes) * 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    return value.toFixed(
      cat === "miles" || cat === "elevation" || cat === "calories" ? 1 : 0,
    );
  };

  return (
    <View
      style={{
        marginTop: 16,
        backgroundColor: colors.cardBackground,
        padding: 16,
        borderRadius: 12,
      }}
    >
      {/* Title at top left - matching TierTracking style */}
      <Text
        style={{
          fontSize: 15,
          color: colors.textSecondary,
          fontWeight: "600",
          marginBottom: 10,
        }}
      >
        {getPeriodLabel(period)} Goal
      </Text>

      {/* Main content row with icon and target - removed percentage */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.secondaryBackground,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <CategoryIcon category={category} size={18} color="#60a5fa" />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: colors.text,
            }}
          >
            {target} {getUnitLabel(category)}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View
        style={{
          height: 6,
          backgroundColor: colors.secondaryBackground,
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 6,
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${Math.min(progressPercentage, 100)}%`,
            backgroundColor: progressPercentage >= 100 ? "#22c55e" : "#60a5fa",
            borderRadius: 3,
          }}
        />
      </View>

      {/* Progress Text and Percentage in bottom row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            color: colors.textTertiary,
            fontWeight: "600",
          }}
        >
          {formatValue(currentValue, category)} {getUnitLabel(category)} of{" "}
          {target} {getUnitLabel(category)}
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: colors.text,
          }}
        >
          {progressPercentage.toFixed(0)}%
        </Text>
      </View>
    </View>
  );
}
