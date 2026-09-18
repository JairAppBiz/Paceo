// @ts-nocheck
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { X, Heart } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

export function LikesModal({ visible, postId, onClose }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && postId) {
      fetchLikes();
    }
  }, [visible, postId]);

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/likes?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes || []);
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserPress = (userId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    router.push(`/user/${userId}`);
  };

  const renderLike = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleUserPress(item.user_id)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        marginBottom: 8,
      }}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: item.profile_image ? "#1a1a1a" : "#60a5fa",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
          overflow: "hidden",
        }}
      >
        {item.profile_image ? (
          <Image
            source={{ uri: item.profile_image }}
            style={{ width: 44, height: 44 }}
          />
        ) : (
          <Text style={{ color: "#000", fontWeight: "700", fontSize: 16 }}>
            {item.username?.[0]?.toUpperCase() || "?"}
          </Text>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          {item.username}
        </Text>
        <Text style={{ color: "#666", fontSize: 13, marginTop: 2 }}>
          {new Date(item.liked_at).toLocaleDateString()} at{" "}
          {new Date(item.liked_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      <Heart size={18} color="#ef4444" fill="#ef4444" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.9)",
          paddingTop: insets.top,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#333",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
            Likes
          </Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
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

        {/* Likes List */}
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#60a5fa" />
          </View>
        ) : likes.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 40,
            }}
          >
            <Heart size={48} color="#333" />
            <Text
              style={{
                color: "#666",
                fontSize: 16,
                marginTop: 12,
                textAlign: "center",
              }}
            >
              No likes yet
            </Text>
            <Text
              style={{
                color: "#555",
                fontSize: 14,
                marginTop: 4,
                textAlign: "center",
              }}
            >
              Be the first to like this post!
            </Text>
          </View>
        ) : (
          <FlatList
            data={likes}
            renderItem={renderLike}
            keyExtractor={(item) => item.user_id.toString()}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: insets.bottom + 20,
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Modal>
  );
}
