// @ts-nocheck
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import {
  X,
  Heart,
  MessageCircle,
  Trophy,
  Award,
  UserPlus,
  UserCheck,
  Bell,
  TrendingUp,
  Target,
  Flame,
  PartyPopper,
} from "lucide-react-native";

export function NotificationsModal({
  visible,
  onClose,
  notifications,
  onNotificationItemPress,
  onMarkAllRead,
  bottomInset,
}) {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart size={24} color="#ef4444" fill="#ef4444" />;
      case "comment":
        return <MessageCircle size={24} color="#60a5fa" />;
      case "medal":
        return <Trophy size={24} color="#fbbf24" />;
      case "achievement":
        return <Award size={24} color="#8b5cf6" />;
      case "follow":
        return <UserPlus size={24} color="#10b981" />;
      case "follow_request":
        return <UserPlus size={24} color="#f59e0b" />;
      case "follow_accepted":
        return <UserCheck size={24} color="#10b981" />;
      case "tier_promotion":
        return <TrendingUp size={24} color="#10b981" />;
      case "tier_demotion":
        return <TrendingUp size={24} color="#888" />;
      case "mention":
        return <Text style={{ fontSize: 24 }}>🏷️</Text>;
      case "personal_best":
        return <Target size={24} color="#ec4899" />;
      case "streak":
        return <Flame size={24} color="#f97316" />;
      case "milestone":
        return <PartyPopper size={24} color="#8b5cf6" />;
      case "goal_reached":
        return <Target size={24} color="#10b981" />;
      default:
        return <Bell size={24} color="#888" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: "#000",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 20,
            paddingBottom: bottomInset,
            maxHeight: "80%",
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 24, color: "#fff", fontWeight: "700" }}>
              Notifications
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#1a1a1a",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <X size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Mark all as read button */}
          {notifications.length > 0 && (
            <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
              <TouchableOpacity
                onPress={onMarkAllRead}
                style={{ alignSelf: "flex-end" }}
              >
                <Text
                  style={{ color: "#60a5fa", fontSize: 14, fontWeight: "600" }}
                >
                  Mark all as read
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Notifications List */}
          <ScrollView
            style={{ flex: 1, paddingHorizontal: 20 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {notifications.length === 0 ? (
              <View style={{ paddingVertical: 40, alignItems: "center" }}>
                <Text style={{ fontSize: 50, marginBottom: 12 }}>🔔</Text>
                <Text
                  style={{ color: "#666", fontSize: 16, fontWeight: "600" }}
                >
                  No notifications
                </Text>
                <Text style={{ color: "#444", fontSize: 14, marginTop: 8 }}>
                  You're all caught up!
                </Text>
              </View>
            ) : (
              notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  onPress={() => onNotificationItemPress(notification)}
                  style={{
                    backgroundColor: notification.is_read
                      ? "#0f0f0f"
                      : "#1a1a1a",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: notification.is_read ? 0 : 2,
                    borderColor: notification.is_read
                      ? "transparent"
                      : "#60a5fa",
                  }}
                >
                  <View style={{ marginRight: 12 }}>
                    {getNotificationIcon(notification.type)}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "600",
                          fontSize: 16,
                          marginBottom: 4,
                          flex: 1,
                        }}
                      >
                        {notification.title}
                      </Text>
                      <Text
                        style={{ color: "#666", fontSize: 12, marginLeft: 8 }}
                      >
                        {formatTimeAgo(notification.created_at)}
                      </Text>
                    </View>
                    {notification.message && (
                      <Text
                        style={{ color: "#888", fontSize: 14, marginBottom: 4 }}
                        numberOfLines={2}
                      >
                        {notification.message}
                      </Text>
                    )}
                    {notification.type === "medal" && (
                      <Text
                        style={{
                          color: "#fbbf24",
                          fontSize: 13,
                          fontWeight: "600",
                          marginTop: 4,
                        }}
                      >
                        {notification.medal_category} •{" "}
                        {notification.medal_period} • Rank #
                        {notification.medal_rank}
                      </Text>
                    )}
                    {(notification.type === "tier_promotion" ||
                      notification.type === "tier_demotion") &&
                      notification.tier_promotion_category && (
                        <Text
                          style={{
                            color:
                              notification.type === "tier_promotion"
                                ? "#10b981"
                                : "#888",
                            fontSize: 13,
                            fontWeight: "600",
                            marginTop: 4,
                          }}
                        >
                          {notification.tier_promotion_category} •{" "}
                          {notification.tier_promotion_from_location}{" "}
                          {notification.tier_promotion_from_tier} →{" "}
                          {notification.tier_promotion_to_location}{" "}
                          {notification.tier_promotion_to_tier}
                        </Text>
                      )}
                    {notification.type === "personal_best" &&
                      notification.run_distance && (
                        <Text
                          style={{
                            color: "#ec4899",
                            fontSize: 13,
                            fontWeight: "600",
                            marginTop: 4,
                          }}
                        >
                          {notification.run_distance.toFixed(2)} mi •{" "}
                          {Math.floor(notification.run_duration / 60)}:
                          {(notification.run_duration % 60)
                            .toString()
                            .padStart(2, "0")}{" "}
                          min
                        </Text>
                      )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}