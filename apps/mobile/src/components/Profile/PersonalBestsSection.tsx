// @ts-nocheck
import { View, Text } from "react-native";

const personalBestItems = [
  { label: "1K", key: "1k" },
  { label: "1 Mile", key: "1mile" },
  { label: "5K", key: "5k" },
  { label: "10K", key: "10k" },
  { label: "Half Marathon", key: "half" },
  { label: "Marathon", key: "marathon" },
  { label: "Longest Run", key: "longestRun", isDistance: true },
];

export function PersonalBestsSection({ personalBests }) {
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
        Personal Bests
      </Text>

      <View style={{ gap: 10 }}>
        {personalBestItems.map((item) => (
          <View
            key={item.key}
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, color: "#fff", fontWeight: "600" }}>
              {item.label}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: personalBests[item.key] ? "#60a5fa" : "#555",
                fontWeight: "700",
              }}
            >
              {item.isDistance
                ? personalBests[item.key] > 0
                  ? `${personalBests[item.key]} mi`
                  : "--"
                : personalBests[item.key] || "--"}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
