// @ts-nocheck
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { X, UserPlus, UserMinus } from "lucide-react-native";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function FollowRequestsModal({ visible, onClose, userId }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (visible && userId) {
      fetchRequests();
    }
  }, [visible, userId]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/users/followers?userId=${userId}&status=pending`,
      );
      if (!response.ok) throw new Error("Failed to fetch requests");
      const data = await response.json();
      setRequests(data.followers || []);
    } catch (error) {
      console.error("Error fetching follow requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (followerId) => {
    setProcessingId(followerId);
    try {
      const response = await fetch("/api/users/accept-follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId }),
      });

      if (!response.ok) throw new Error("Failed to accept request");

      // Remove from list
      setRequests(requests.filter((req) => req.id !== followerId));
    } catch (error) {
      console.error("Error accepting follow request:", error);
      alert("Failed to accept request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (followerId) => {
    setProcessingId(followerId);
    try {
      const response = await fetch("/api/users/decline-follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId }),
      });

      if (!response.ok) throw new Error("Failed to decline request");

      // Remove from list
      setRequests(requests.filter((req) => req.id !== followerId));
    } catch (error) {
      console.error("Error declining follow request:", error);
      alert("Failed to decline request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleUserPress = (id) => {
    onClose();
    router.push(`/user/${id}`);
  };

  const renderRequest = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: "#1A1A1A",
        borderBottomWidth: 1,
        borderBottomColor: "#2A2A2A",
      }}
    >
      <TouchableOpacity onPress={() => handleUserPress(item.id)}>
        <Image
          source={{
            uri:
              item.profile_image ||
              "https://via.placeholder.com/40/333/fff?text=?",
          }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            marginRight: 12,
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleUserPress(item.id)}
        style={{ flex: 1 }}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 2,
          }}
        >
          {item.username}
        </Text>
        {item.city && item.state && (
          <Text style={{ color: "#888", fontSize: 14 }}>
            {item.city}, {item.state}
          </Text>
        )}
      </TouchableOpacity>

      {processingId === item.id ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            onPress={() => handleDecline(item.id)}
            style={{
              backgroundColor: "#2A2A2A",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 6,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <UserMinus size={16} color="#888" />
            <Text style={{ color: "#888", fontSize: 14, fontWeight: "600" }}>
              Decline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleAccept(item.id)}
            style={{
              backgroundColor: "#FFF",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 6,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <UserPlus size={16} color="#000" />
            <Text style={{ color: "#000", fontSize: 14, fontWeight: "600" }}>
              Accept
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
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
            borderBottomColor: "#2A2A2A",
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "700" }}>
            Follow Requests
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : requests.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "#888", fontSize: 16 }}>
              No pending requests
            </Text>
          </View>
        ) : (
          <FlatList
            data={requests}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRequest}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          />
        )}
      </View>
    </Modal>
  );
}
