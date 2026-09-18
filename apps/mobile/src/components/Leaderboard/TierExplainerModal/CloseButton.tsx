// @ts-nocheck
import { Pressable } from "react-native";
import { X } from "lucide-react-native";

export function CloseButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        position: "absolute",
        top: 60,
        right: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.1)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <X size={24} color="#fff" />
    </Pressable>
  );
}
