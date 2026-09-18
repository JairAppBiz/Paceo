// @ts-nocheck
import { View, Text } from "react-native";
import { Trophy } from "lucide-react-native";

export function TotalMedalCount({ totalMedals }) {
  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
      <View
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: 24,
          padding: 32,
          alignItems: "center",
          borderWidth: 2,
          borderColor: "#fbbf24",
        }}
      >
        <Trophy size={56} color="#fbbf24" strokeWidth={2} />
        <Text
          style={{
            fontSize: 64,
            color: "#fff",
            fontWeight: "900",
            marginTop: 16,
            marginBottom: 4,
          }}
        >
          {totalMedals}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#888",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Total Medals
        </Text>
      </View>
    </View>
  );
}
