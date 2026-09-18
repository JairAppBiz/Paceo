// @ts-nocheck
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { X, User, UserMinus } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

export default function FollowingListModal({
  visible,
  onClose,
  userId,
  currentUserId,
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unfollowingId, setUnfollowingId] = useState(null);

  const isOwnProfile = userId === currentUserId;

  useEffect(() => {
    if (visible && userId) {
      fetchFollowing();
    }
  }, [visible, userId]);

  const fetchFollowing = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/users/following?userId=${userId}&status=accepted`,
      );
      if (!response.ok) throw new Error("Failed to fetch following");
      const data = await response.json();
      setFollowing(data.following || []);
    } catch (error) {
      console.error("Error fetching following:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (followingUserId) => {
    Alert.alert("Unfollow", "Are you sure you want to unfollow this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Unfollow",
        style: "destructive",
        onPress: async () => {
          setUnfollowingId(followingUserId);
          try {
            const response = await fetch("/api/users/unfollow", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: followingUserId }),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || "Failed to unfollow");
            }

            // Remove from local list
            setFollowing((prev) =>
              prev.filter((user) => user.id !== followingUserId),
            );
          } catch (error) {
            console.error("Error unfollowing user:", error);
            Alert.alert("Error", error.message);
          } finally {
            setUnfollowingId(null);
          }
        },
      },
    ]);
  };

  const handleUserPress = (user) => {
    onClose();
    if (user.id === currentUserId) {
      router.push("/(tabs)/profile");
    } else {
      router.push(`/user/${user.id}`);
    }
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2A2A2A",
      }}
      onPress={() => handleUserPress(item)}
      activeOpacity={0.7}
    >
      {item.profile_image ? (
        <Image
          source={{ uri: item.profile_image }}
          style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }}
          contentFit="cover"
          transition={100}
        />
      ) : (
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#2A2A2A",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <User size={24} color="#888" />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600" }}>
          {item.username}
        </Text>
        {(item.city || item.state) && (
          <Text style={{ color: "#888", fontSize: 14, marginTop: 2 }}>
            {[item.city, item.state].filter(Boolean).join(", ")}
          </Text>
        )}
      </View>
      {isOwnProfile ? (
        <TouchableOpacity
          style={{
            backgroundColor: "#2A2A2A",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 6,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
          onPress={() => handleUnfollow(item.id)}
          disabled={unfollowingId === item.id}
        >
          {unfollowingId === item.id ? (
            <ActivityIndicator size="small" color="#888" />
          ) : (
            <>
              <UserMinus size={14} color="#888" />
              <Text style={{ color: "#888", fontSize: 12, fontWeight: "600" }}>
                Unfollow
              </Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        item.youFollow && (
          <View
            style={{
              backgroundColor: "#2A2A2A",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "#888", fontSize: 12 }}>Following</Text>
          </View>
        )
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View
        style={{ flex: 1, backgroundColor: "#000", paddingTop: insets.top }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#2A2A2A",
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "700" }}>
            Following
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* List */}
        {loading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : following.length === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
            }}
          >
            <User size={48} color="#444" />
            <Text
              style={{
                color: "#888",
                fontSize: 16,
                marginTop: 16,
                textAlign: "center",
              }}
            >
              Not following anyone yet
            </Text>
          </View>
        ) : (
          <FlatList
            data={following}
            renderItem={renderUser}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: insets.bottom }}
          />
        )}
      </View>
    </Modal>
  );
}
