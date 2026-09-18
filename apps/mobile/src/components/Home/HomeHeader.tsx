// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";
import { Bell } from "lucide-react-native";

export function HomeHeader({
  username,
  hasNewNotifications,
  unreadCount,
  onNotificationPress,
  topInset,
}) {
  return (
    <View style={{ paddingTop: topInset + 20, paddingHorizontal: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 15, color: "#888" }}>
          Hey there, runner! 👋
        </Text>

        {/* Notification Bell */}
        <TouchableOpacity
          onPress={onNotificationPress}
          style={{ position: "relative" }}
        >
          <Bell size={24} color="#fff" />
          {hasNewNotifications && (
            <View
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                minWidth: unreadCount > 9 ? 20 : 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: "#ef4444",
                borderWidth: 2,
                borderColor: "#000",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: unreadCount > 9 ? 3 : 0,
              }}
            >
              {unreadCount > 9 && (
                <Text style={{ color: "#fff", fontSize: 8, fontWeight: "700" }}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontSize: 28,
          color: "#fff",
          fontWeight: "700",
          marginBottom: 24,
        }}
      >
        {username || "Guest"}
      </Text>
    </View>
  );
}
