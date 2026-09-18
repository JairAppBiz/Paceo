// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import FollowersListModal from "./FollowersListModal";
import FollowingListModal from "./FollowingListModal";
import FollowRequestsModal from "./FollowRequestsModal";

export default function FollowersSection({
  userId,
  currentUserId,
  followerCount = 0,
  followingCount = 0,
}) {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);

  const isOwnProfile = userId === currentUserId;

  // Fetch pending request count if viewing own profile
  useEffect(() => {
    if (isOwnProfile) {
      fetchPendingRequestCount();
    }
  }, [userId, currentUserId]);

  const fetchPendingRequestCount = async () => {
    try {
      const response = await fetch(
        `/api/users/followers?userId=${userId}&status=pending`,
      );
      if (response.ok) {
        const data = await response.json();
        setPendingRequestCount(data.followers?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          marginBottom: 16,
          marginTop: -16,
          gap: 16,
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
          }}
          onPress={() => setShowFollowers(true)}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#fff",
              fontWeight: "700",
              marginBottom: 2,
            }}
          >
            {followerCount}
          </Text>
          <Text style={{ fontSize: 11, color: "#888" }}>Followers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            alignItems: "center",
          }}
          onPress={() => setShowFollowing(true)}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#fff",
              fontWeight: "700",
              marginBottom: 2,
            }}
          >
            {followingCount}
          </Text>
          <Text style={{ fontSize: 11, color: "#888" }}>Following</Text>
        </TouchableOpacity>

        {isOwnProfile && pendingRequestCount > 0 && (
          <TouchableOpacity
            style={{
              alignItems: "center",
            }}
            onPress={() => setShowRequests(true)}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#f59e0b",
                fontWeight: "700",
                marginBottom: 2,
              }}
            >
              {pendingRequestCount}
            </Text>
            <Text style={{ fontSize: 11, color: "#f59e0b" }}>Requests</Text>
          </TouchableOpacity>
        )}
      </View>

      <FollowersListModal
        visible={showFollowers}
        onClose={() => setShowFollowers(false)}
        userId={userId}
        currentUserId={currentUserId}
      />

      <FollowingListModal
        visible={showFollowing}
        onClose={() => setShowFollowing(false)}
        userId={userId}
        currentUserId={currentUserId}
      />

      <FollowRequestsModal
        visible={showRequests}
        onClose={() => {
          setShowRequests(false);
          // Refresh pending count after closing
          fetchPendingRequestCount();
        }}
        userId={userId}
      />
    </>
  );
}
