// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";
import { Edit3, Trash2 } from "lucide-react-native";

export function PostMenu({ visible, onEdit, onDelete }) {
  if (!visible) return null;

  return (
    <View
      style={{
        backgroundColor: "#2a2a2a",
        borderRadius: 10,
        marginBottom: 10,
        overflow: "hidden",
      }}
    >
      <TouchableOpacity
        onPress={onEdit}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#333",
        }}
      >
        <Edit3 size={18} color="#60a5fa" />
        <Text
          style={{
            color: "#fff",
            fontSize: 15,
            marginLeft: 10,
            fontWeight: "600",
          }}
        >
          Edit Post
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onDelete}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
        }}
      >
        <Trash2 size={18} color="#ef4444" />
        <Text
          style={{
            color: "#ef4444",
            fontSize: 15,
            marginLeft: 10,
            fontWeight: "600",
          }}
        >
          Delete Post
        </Text>
      </TouchableOpacity>
    </View>
  );
}
