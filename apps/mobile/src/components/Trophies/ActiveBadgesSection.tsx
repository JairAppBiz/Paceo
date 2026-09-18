// @ts-nocheck
import { View, Text } from "react-native";
import { MedalTier } from "./MedalTier";

export function ActiveBadgesSection({ medals = [], onMedalClick }) {
  // Separate medals by tier - podium first, then tier badges
  const goldMedals = medals.filter((m) => m.tier === "gold" && !m.locked);
  const silverMedals = medals.filter((m) => m.tier === "silver" && !m.locked);
  const bronzeMedals = medals.filter((m) => m.tier === "bronze" && !m.locked);
  const apexMedals = medals.filter((m) => m.tier === "apex" && !m.locked);
  const rangerMedals = medals.filter((m) => m.tier === "ranger" && !m.locked);
  const scoutMedals = medals.filter((m) => m.tier === "scout" && !m.locked);

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 32, marginBottom: 40 }}>
      {/* Section Title */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: "#fff",
          marginBottom: 20,
        }}
      >
        Earned Medals
      </Text>

      {/* Podium Medals */}
      <MedalTier
        title="Gold Medals"
        color="#fbbf24"
        medals={goldMedals}
        onMedalClick={onMedalClick}
      />

      <MedalTier
        title="Silver Medals"
        color="#c0c0c0"
        medals={silverMedals}
        onMedalClick={onMedalClick}
      />

      <MedalTier
        title="Bronze Medals"
        color="#cd7f32"
        medals={bronzeMedals}
        onMedalClick={onMedalClick}
      />

      {/* Tier Badges */}
      <MedalTier
        title="Apex Badges"
        color="#ef4444"
        medals={apexMedals}
        onMedalClick={onMedalClick}
      />

      <MedalTier
        title="Ranger Badges"
        color="#3b82f6"
        medals={rangerMedals}
        onMedalClick={onMedalClick}
      />

      <MedalTier
        title="Scout Badges"
        color="#10b981"
        medals={scoutMedals}
        onMedalClick={onMedalClick}
      />
    </View>
  );
}
