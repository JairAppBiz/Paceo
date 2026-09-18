// @ts-nocheck
import { View, Text } from "react-native";
import { PeriodFilter } from "./PeriodFilter";
import { RunStatsGrid } from "./RunStatsGrid";

export function StatisticsSection({ statsPeriod, runStats, onPeriodChange }) {
  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
      <Text
        style={{
          fontSize: 22,
          color: "#fff",
          fontWeight: "700",
          marginBottom: 16,
        }}
      >
        Statistics
      </Text>

      <PeriodFilter statsPeriod={statsPeriod} onPeriodChange={onPeriodChange} />
      <RunStatsGrid runStats={runStats} />
    </View>
  );
}
