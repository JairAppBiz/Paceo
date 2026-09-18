// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";

export function PeriodFilter({ statsPeriod, onPeriodChange }) {
  const periods = ["all", "month", "week"];

  return (
    <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
      {periods.map((period) => (
        <TouchableOpacity
          key={period}
          onPress={() => onPeriodChange(period)}
          style={{
            flex: 1,
            backgroundColor: statsPeriod === period ? "#60a5fa" : "#1a1a1a",
            paddingVertical: 10,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: statsPeriod === period ? "#000" : "#888",
              fontSize: 14,
              fontWeight: "600",
              textTransform: "capitalize",
            }}
          >
            {period}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
