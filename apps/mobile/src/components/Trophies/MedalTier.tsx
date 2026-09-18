// @ts-nocheck
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { HexagonBadge } from "./HexagonBadge";

export function MedalTier({ title, color, medals = [], onMedalClick }) {
  if (medals.length === 0) return null;

  return (
    <View style={{ marginBottom: 24 }}>
      {/* Tier Title */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#fff",
          marginBottom: 12,
        }}
      >
        {title}
      </Text>

      {/* Scrollable Medal Container */}
      <View
        style={{
          borderWidth: 2,
          borderColor: color,
          borderRadius: 16,
          padding: 12,
          backgroundColor: "#1a1a1a",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 12,
            paddingRight: 4,
          }}
        >
          {medals.map((medal, index) => (
            <TouchableOpacity
              key={medal.id || index}
              onPress={() => onMedalClick && onMedalClick(medal)}
              activeOpacity={0.7}
            >
              <HexagonBadge
                category={medal.category}
                rank={medal.rank_achieved || 1}
                color={color}
                locked={medal.locked || false}
                size={75}
                tier={medal.tier} // Pass tier prop for colored borders
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
