// @ts-nocheck
import { View, Text } from "react-native";
import { MedalPodium } from "./MedalPodium";
import { OtherRankings } from "./OtherRankings";

export function MedalBreakdown({
  counts,
  onMedalPress,
  goldShimmer,
  bounceAnim,
}) {
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
        Collection
      </Text>

      <View style={{ gap: 12 }}>
        <MedalPodium
          counts={counts}
          onMedalPress={onMedalPress}
          goldShimmer={goldShimmer}
          bounceAnim={bounceAnim}
        />
        <OtherRankings counts={counts} onMedalPress={onMedalPress} />
      </View>
    </View>
  );
}
