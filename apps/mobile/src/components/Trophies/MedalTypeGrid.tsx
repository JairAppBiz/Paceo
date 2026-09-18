// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";

export function MedalTypeGrid({ counts, onMedalPress }) {
  const topMedals = [
    {
      type: "gold",
      label: "GOLD",
      color: "#fbbf24",
      emoji: "🥇",
      count: counts.gold || 0,
    },
    {
      type: "silver",
      label: "SILVER",
      color: "#d1d5db",
      emoji: "🥈",
      count: counts.silver || 0,
    },
    {
      type: "bronze",
      label: "BRONZE",
      color: "#cd7f32",
      emoji: "🥉",
      count: counts.bronze || 0,
    },
  ];

  const otherMedals = [
    {
      type: "top10",
      label: "TOP 10",
      color: "#8b5cf6",
      emoji: "🔟",
      count: counts.top10 || 0,
    },
    {
      type: "top50",
      label: "TOP 50",
      color: "#3b82f6",
      emoji: "5️⃣0️⃣",
      count: counts.top50 || 0,
    },
    {
      type: "top100",
      label: "TOP 100",
      color: "#10b981",
      emoji: "💯",
      count: counts.top100 || 0,
    },
  ];

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
      {/* Top 3 Medals - Featured Podium Style */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 40,
          paddingHorizontal: 10,
        }}
      >
        {topMedals.map((medal) => (
          <TouchableOpacity
            key={medal.type}
            onPress={() => onMedalPress && onMedalPress(medal.type)}
            activeOpacity={0.8}
            style={{
              alignItems: "center",
            }}
          >
            {/* Large Circle */}
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#1a1a2e",
                borderWidth: 3,
                borderColor: medal.color,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 48 }}>{medal.emoji}</Text>
            </View>

            {/* Label */}
            <Text
              style={{
                fontSize: 11,
                color: "#9ca3af",
                fontWeight: "600",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              {medal.label}
            </Text>

            {/* Count */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: medal.color,
              }}
            >
              {medal.count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Other Rankings - Smaller Grid */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 30,
        }}
      >
        {otherMedals.map((medal) => (
          <TouchableOpacity
            key={medal.type}
            onPress={() => onMedalPress && onMedalPress(medal.type)}
            activeOpacity={0.8}
            style={{
              alignItems: "center",
            }}
          >
            {/* Medium Circle */}
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: "#1a1a2e",
                borderWidth: 2,
                borderColor: medal.color,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 32 }}>{medal.emoji}</Text>
            </View>

            {/* Label */}
            <Text
              style={{
                fontSize: 9,
                color: "#9ca3af",
                fontWeight: "600",
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              {medal.label}
            </Text>

            {/* Count */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: medal.color,
              }}
            >
              {medal.count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
