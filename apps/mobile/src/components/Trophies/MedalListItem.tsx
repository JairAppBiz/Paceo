// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";
import { MapPin, TreeDeciduous, Star } from "lucide-react-native";
import { CATEGORY_INFO } from "@/constants/medals";
import { getMedalColor } from "@/utils/medalHelpers";
import { HexagonBadge } from "./HexagonBadge";

// Tier icons to display
const TIER_ICONS = {
  scout: MapPin,
  ranger: TreeDeciduous,
  apex: Star,
};

export function MedalListItem({ medal, onPress }) {
  const categoryInfo = CATEGORY_INFO[medal.category] || {
    label: medal.category,
    emoji: "🏆",
  };
  const date = new Date(medal.awarded_date);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const medalColor = getMedalColor(medal.rank_achieved);

  // Check if this is a tier promotion badge
  const isPromotionBadge =
    medal.is_promotion_badge || medal.type === "promotion";
  const TierIcon =
    isPromotionBadge && medal.tier ? TIER_ICONS[medal.tier] : null;

  // Get tier color
  const getTierColor = (tier) => {
    if (tier === "apex") return "#ef4444";
    if (tier === "ranger") return "#3b82f6";
    if (tier === "scout") return "#10b981";
    return "#888";
  };

  const tierColor =
    isPromotionBadge && medal.tier ? getTierColor(medal.tier) : null;

  return (
    <TouchableOpacity
      onPress={() => onPress(medal)}
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View style={{ marginRight: 16 }}>
        <HexagonBadge
          category={medal.category}
          rank={medal.rank_achieved}
          color={medalColor}
          size={56}
          tier={medal.tier} // Pass tier for colored borders
        />
      </View>

      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          {isPromotionBadge && TierIcon ? (
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: tierColor,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
              }}
            >
              <TierIcon size={14} color="#fff" />
            </View>
          ) : (
            <Text style={{ fontSize: 18, marginRight: 8 }}>
              {categoryInfo.emoji}
            </Text>
          )}
          <Text
            style={{
              fontSize: 16,
              color: "#fff",
              fontWeight: "700",
            }}
          >
            {categoryInfo.label}
          </Text>
        </View>
        <Text style={{ fontSize: 14, color: "#888" }}>
          {isPromotionBadge
            ? `${medal.from_tier} → ${medal.to_tier} • ${medal.to_location}`
            : `#${medal.rank_achieved} • ${medal.period}`}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: "#666",
            marginTop: 2,
          }}
        >
          {dateStr}
          {medal.value && ` • ${medal.value} ${medal.unit}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
