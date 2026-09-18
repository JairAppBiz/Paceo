// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

export function NewTrophyHeader({ insets }) {
  const router = useRouter();

  return (
    <View
      style={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#000",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Back Button - positioned absolutely to the left */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          left: 20,
          top: insets.top + 16,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#1a1a1a",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ChevronLeft size={24} color="#fff" />
      </TouchableOpacity>

      {/* Trophy Room Title */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: "#fff",
        }}
      >
        Trophy Room
      </Text>
    </View>
  );
}
