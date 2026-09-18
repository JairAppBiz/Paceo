// @ts-nocheck
import { View, Text } from "react-native";
import { Trophy } from "lucide-react-native";

export function TrophyHeader({ insets, totalMedals }) {
  return (
    <View
      style={{
        paddingTop: insets.top + 20,
        paddingHorizontal: 20,
        marginBottom: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 32, color: "#fff", fontWeight: "700" }}>
          Trophy Room
        </Text>
        <Text style={{ fontSize: 15, color: "#888", marginTop: 4 }}>
          Your collection of achievements
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: 16,
          padding: 12,
          borderWidth: 2,
          borderColor: "#fbbf24",
          minWidth: 80,
          alignItems: "center",
        }}
      >
        <Trophy size={20} color="#fbbf24" />
        <Text
          style={{
            fontSize: 24,
            color: "#fff",
            fontWeight: "900",
            marginTop: 4,
          }}
        >
          {totalMedals || 0}
        </Text>
        <Text
          style={{ fontSize: 10, color: "#888", textTransform: "uppercase" }}
        >
          Total
        </Text>
      </View>
    </View>
  );
}
