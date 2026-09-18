// @ts-nocheck
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { CATEGORY_INFO } from "@/constants/medals";
import { getMedalEmoji } from "@/utils/medalHelpers";

export function RecentMedalsSection({ recentMedals, onMedalClick }) {
  if (!recentMedals || recentMedals.length === 0) {
    return null;
  }

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
      <Text
        style={{
          fontSize: 20,
          color: "#fff",
          fontWeight: "700",
          marginBottom: 16,
        }}
      >
        Recent Medals
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {recentMedals.map((medal) => {
          const categoryInfo = CATEGORY_INFO[medal.category] || {
            label: medal.category,
            emoji: "🏆",
          };
          return (
            <TouchableOpacity
              key={medal.id}
              onPress={() => onMedalClick(medal)}
              activeOpacity={0.7}
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: 16,
                padding: 16,
                width: 140,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 40, marginBottom: 8 }}>
                {getMedalEmoji(medal.rank_achieved)}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#fff",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                {categoryInfo.label}
              </Text>
              <Text style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                #{medal.rank_achieved}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
