// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";

const periods = [
  { key: "weekly", label: "week" },
  { key: "monthly", label: "month" },
  { key: "yearly", label: "year" },
  { key: "total", label: "total" },
];

export function StatsDisplay({
  stats,
  selectedPeriod,
  onPeriodChange,
  streak,
  runCount,
}) {
  const currentMileage = stats[selectedPeriod] || 0;

  return (
    <View style={{ paddingHorizontal: 20 }}>
      {/* Stats Display */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text
            style={{
              fontSize: 64,
              color: "#fff",
              fontWeight: "700",
              letterSpacing: -2,
              lineHeight: 64,
            }}
          >
            {Math.floor(currentMileage).toLocaleString()}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#888",
              marginLeft: 10,
              marginBottom: 4,
            }}
          >
            miles
          </Text>
        </View>
      </View>

      {/* Period Toggle */}
      <View
        style={{
          flexDirection: "row",
          gap: 20,
          marginBottom: 28,
        }}
      >
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            onPress={() => onPeriodChange(period.key)}
            activeOpacity={0.6}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text
              style={{
                fontSize: 14,
                color: selectedPeriod === period.key ? "#fff" : "#555",
                fontWeight: selectedPeriod === period.key ? "600" : "400",
              }}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}