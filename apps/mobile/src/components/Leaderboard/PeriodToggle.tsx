// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";
import { PERIODS } from "@/constants/leaderboard";

export function PeriodToggle({ selectedPeriod, onPeriodChange }) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 4,
        marginTop: 16,
        alignSelf: "flex-start",
      }}
    >
      {PERIODS.map((period) => (
        <TouchableOpacity
          key={period.id}
          onPress={() => onPeriodChange(period.id)}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor:
              selectedPeriod === period.id ? "#fff" : "transparent",
          }}
        >
          <Text
            style={{
              color: selectedPeriod === period.id ? "#000" : "#888",
              fontWeight: selectedPeriod === period.id ? "700" : "500",
              fontSize: 16,
            }}
          >
            {period.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
