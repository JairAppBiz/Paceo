// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";

export function AllMedalsGrid({ medals, onMedalClick }) {
  if (medals.length === 0) {
    return (
      <View
        style={{ paddingHorizontal: 20, marginTop: 32, alignItems: "center" }}
      >
        <Text style={{ fontSize: 16, color: "#6b7280", textAlign: "center" }}>
          No medals earned yet. Start running to earn your first medal! 🏃‍♂️
        </Text>
      </View>
    );
  }

  const getMedalColor = (rankAchieved) => {
    if (rankAchieved === 1) return "#fbbf24";
    if (rankAchieved === 2) return "#d1d5db";
    if (rankAchieved === 3) return "#cd7f32";
    if (rankAchieved <= 10) return "#8b5cf6";
    if (rankAchieved <= 50) return "#3b82f6";
    return "#10b981";
  };

  const getMedalEmoji = (rankAchieved) => {
    if (rankAchieved === 1) return "🥇";
    if (rankAchieved === 2) return "🥈";
    if (rankAchieved === 3) return "🥉";
    if (rankAchieved <= 10) return "🔟";
    if (rankAchieved <= 50) return "5️⃣0️⃣";
    return "💯";
  };

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
        }}
      >
        {medals.map((medal, index) => {
          const medalColor = getMedalColor(medal.rank_achieved);
          const medalEmoji = getMedalEmoji(medal.rank_achieved);

          return (
            <TouchableOpacity
              key={`${medal.id}-${index}`}
              onPress={() => onMedalClick(medal)}
              activeOpacity={0.8}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#1a1a2e",
                borderWidth: 3,
                borderColor: medalColor,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 40 }}>{medalEmoji}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
