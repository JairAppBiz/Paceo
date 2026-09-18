// @ts-nocheck
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { Sparkles } from "lucide-react-native";

export function MedalStatsSection({ medalData }) {
  const [chartPeriod, setChartPeriod] = useState("lifetime");

  if (!medalData) return null;

  // Get the period data for the chart based on selected period
  const periodData = medalData.periodStats[chartPeriod];
  const chartData = [
    { type: "Podiums", count: periodData.podiums },
    { type: "Top 10", count: periodData.top10s },
    { type: "Local", count: periodData.neighborhood },
    { type: "Global", count: periodData.city },
  ];

  // Prepare category breakdown data for chart
  const categoryChartData = Object.entries(medalData.categoryBreakdown).map(
    ([category, counts]) => ({
      category,
      total: Object.values(counts).reduce((sum, count) => sum + count, 0),
    }),
  );

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
        My Medal Stats
      </Text>

      {/* Period Filter */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {[
          { label: "Week", key: "week" },
          { label: "Month", key: "month" },
          { label: "Year", key: "year" },
          { label: "All", key: "lifetime" },
        ].map((period) => (
          <TouchableOpacity
            key={period.key}
            onPress={() => setChartPeriod(period.key)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor:
                chartPeriod === period.key ? "#60a5fa" : "#1a1a1a",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: chartPeriod === period.key ? "#fff" : "#888",
              }}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Medal Distribution Bar Chart */}
      <View
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: 16,
          padding: 20,
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#fff",
            fontWeight: "700",
            marginBottom: 16,
          }}
        >
          Medal Distribution
        </Text>
        <View style={{ height: 280 }}>
          <Svg height="280" width="100%">
            {chartData.map((item, index) => {
              const maxCount = Math.max(...chartData.map((d) => d.count), 1);
              const barHeight = (item.count / maxCount) * 200;
              const barWidth = 70;
              const spacing = 15;
              const x = index * (barWidth + spacing) + 10;
              const y = 220 - barHeight;

              const colors = ["#fbbf24", "#10b981", "#a855f7", "#06b6d4"];

              return (
                <React.Fragment key={index}>
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={colors[index]}
                    rx={6}
                  />
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 10}
                    fill="#fff"
                    fontSize="18"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {item.count}
                  </SvgText>
                  <SvgText
                    x={x + barWidth / 2}
                    y={250}
                    fill="#888"
                    fontSize="13"
                    textAnchor="middle"
                  >
                    {item.type}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        </View>
      </View>

      {/* Best Category Card */}
      {medalData.stats.favoriteCategory && (
        <View
          style={{
            backgroundColor: "#0ea5e9",
            borderRadius: 16,
            padding: 20,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.8)",
              marginBottom: 8,
            }}
          >
            Best Category
          </Text>
          <Text
            style={{
              fontSize: 28,
              color: "#fff",
              fontWeight: "900",
              textTransform: "capitalize",
            }}
          >
            {medalData.stats.favoriteCategory}
          </Text>
        </View>
      )}

      {/* Best Ever Finish Card */}
      {medalData.stats.bestFinish && (
        <View
          style={{
            backgroundColor: "#d97706",
            borderRadius: 16,
            padding: 20,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.9)",
              marginBottom: 8,
            }}
          >
            Best Ever Finish
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 48,
                color: "#fff",
                fontWeight: "900",
              }}
            >
              {medalData.stats.bestFinish.rank_achieved}
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: "rgba(255,255,255,0.9)",
                fontWeight: "600",
              }}
            >
              {medalData.stats.bestFinish.rank_achieved === 1
                ? "st"
                : medalData.stats.bestFinish.rank_achieved === 2
                  ? "nd"
                  : medalData.stats.bestFinish.rank_achieved === 3
                    ? "rd"
                    : "th"}{" "}
              Place
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.8)",
              marginTop: 4,
              textTransform: "capitalize",
            }}
          >
            {medalData.stats.bestFinish.category} •{" "}
            {medalData.stats.bestFinish.period}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.7)",
              marginTop: 6,
              fontWeight: "600",
            }}
          >
            {medalData.stats.bestFinish.is_global ? "🌍 Global" : "📍 Local"}
          </Text>
        </View>
      )}

      {/* Medal Streak Card */}
      <View
        style={{
          backgroundColor: "#dc2626",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.8)",
            marginBottom: 12,
          }}
        >
          Medal Streak
        </Text>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 36,
                color: "#fff",
                fontWeight: "900",
              }}
            >
              {medalData.medalStreak.current}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.8)",
                marginTop: 4,
              }}
            >
              Current Weeks
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 36,
                color: "rgba(255,255,255,0.7)",
                fontWeight: "900",
              }}
            >
              {medalData.medalStreak.longest}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.6)",
                marginTop: 4,
              }}
            >
              Longest Streak
            </Text>
          </View>
        </View>
      </View>

      {/* Category Breakdown Graph */}
      {categoryChartData.length > 0 && (
        <View
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "#fff",
              fontWeight: "700",
              marginBottom: 16,
            }}
          >
            Category Breakdown
          </Text>
          <View style={{ height: 220 }}>
            <Svg height="220" width="100%">
              {categoryChartData.map((item, index) => {
                const maxCount = Math.max(
                  ...categoryChartData.map((d) => d.total),
                  1,
                );
                const barHeight = (item.total / maxCount) * 150;
                const barWidth = 65;
                const spacing = 15;
                const totalWidth =
                  categoryChartData.length * (barWidth + spacing);
                const startX = 10;
                const x = startX + index * (barWidth + spacing);
                const y = 170 - barHeight;

                const colors = [
                  "#60a5fa",
                  "#10b981",
                  "#f59e0b",
                  "#ec4899",
                  "#8b5cf6",
                ];

                return (
                  <React.Fragment key={index}>
                    <Rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={colors[index % colors.length]}
                      rx={6}
                    />
                    <SvgText
                      x={x + barWidth / 2}
                      y={y - 8}
                      fill="#fff"
                      fontSize="16"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {item.total}
                    </SvgText>
                    <SvgText
                      x={x + barWidth / 2}
                      y={195}
                      fill="#888"
                      fontSize="11"
                      textAnchor="middle"
                    >
                      {item.category.length > 8
                        ? item.category.substring(0, 7) + "..."
                        : item.category}
                    </SvgText>
                  </React.Fragment>
                );
              })}
            </Svg>
          </View>
        </View>
      )}

      {/* Uplifting Message */}
      <View
        style={{
          backgroundColor: "#8b5cf6",
          borderRadius: 16,
          padding: 24,
          alignItems: "center",
        }}
      >
        <Sparkles size={32} color="#fff" strokeWidth={2} />
        <Text
          style={{
            fontSize: 18,
            color: "#fff",
            fontWeight: "700",
            marginTop: 16,
            textAlign: "center",
            lineHeight: 24,
          }}
        >
          {medalData.upliftingMessage}
        </Text>
      </View>
    </View>
  );
}
