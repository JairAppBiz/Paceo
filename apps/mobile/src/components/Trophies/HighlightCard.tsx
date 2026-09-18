// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";

export function HighlightCard({
  icon: Icon,
  iconColor,
  iconBgColor,
  title,
  mainText,
  subText,
  emoji,
  onPress,
  borderColor,
}) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: borderColor ? 1 : 0,
        borderColor: borderColor || "transparent",
      }}
      onPress={onPress}
      disabled={!onPress}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: iconBgColor,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
        }}
      >
        <Icon size={28} color={iconColor} strokeWidth={2.5} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            color: "#888",
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: "#fff",
            fontWeight: "700",
          }}
        >
          {mainText}
        </Text>
        {subText && (
          <Text
            style={{
              fontSize: 13,
              color: "#666",
              marginTop: 2,
            }}
          >
            {subText}
          </Text>
        )}
      </View>
      {emoji && <Text style={{ fontSize: 32 }}>{emoji}</Text>}
    </TouchableOpacity>
  );
}
