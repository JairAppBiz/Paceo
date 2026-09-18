// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";
import { Settings, Edit3 } from "lucide-react-native";

export function ProfileHeader({
  insets,
  onSettingsPress,
  onEditPress,
  username,
}) {
  return (
    <View
      style={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "700", color: "#fff" }}>
        {username || "Guest"}
      </Text>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity
          onPress={onEditPress}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#1a1a1a",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Edit3 size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSettingsPress}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#1a1a1a",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Settings size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
