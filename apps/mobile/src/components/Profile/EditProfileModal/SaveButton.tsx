// @ts-nocheck
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function SaveButton({ hasChanges, isSaving, onSave }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: insets.bottom + 16,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
      }}
    >
      <TouchableOpacity
        onPress={onSave}
        disabled={!hasChanges || isSaving}
        style={{
          backgroundColor: hasChanges ? "#60a5fa" : "#1a1a1a",
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: "center",
          opacity: hasChanges ? 1 : 0.5,
        }}
        activeOpacity={0.8}
      >
        {isSaving ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
              color: hasChanges ? "#000" : "#666",
            }}
          >
            Save Changes
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
