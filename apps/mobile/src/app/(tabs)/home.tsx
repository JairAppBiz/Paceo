// @ts-nocheck
import { useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import MedalRewardModal from "@/components/MedalRewardModal";
import { useHomeData } from "@/hooks/useHomeData";
import { useNotifications } from "@/hooks/useNotifications";
import { usePostInteractions } from "@/hooks/usePostInteractions";
import { useMedalReward } from "@/hooks/useMedalReward";
import { HomeHeader } from "@/components/Home/HomeHeader";
import { StatsDisplay } from "@/components/Home/StatsDisplay";
import { RunButton } from "@/components/Home/RunButton";
import { ActivityFeed } from "@/components/Home/ActivityFeed";
import { CommentsModal } from "@/components/Home/CommentsModal";
import { NotificationsModal } from "@/components/Home/NotificationsModal";
import { useTheme } from "@/utils/themeStore";
import useUser from "@/utils/auth/useUser";
import {
  COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  SPACING,
  RADIUS,
} from "@/constants/design";

export default function HomePage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { data: currentUser } = useUser();
  const currentUserId = currentUser?.id;

  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState(false);

  // Custom hooks
  const {
    stats,
    posts,
    setPosts,
    loading,
    refreshing,
    user,
    streak,
    runCount,
    onRefresh,
  } = useHomeData(currentUserId);

  const {
    hasNewNotifications,
    setHasNewNotifications,
    notifications,
    unreadCount,
    checkForNotifications,
    markAsRead,
  } = useNotifications(currentUserId);

  const {
    commentModalVisible,
    setCommentModalVisible,
    selectedPost,
    commentText,
    setCommentText,
    postComments,
    submittingComment,
    handleLike,
    openComments,
    submitComment,
  } = usePostInteractions(currentUserId, checkForNotifications);

  const {
    showMedalReward,
    setShowMedalReward,
    newMedal,
    setNewMedal,
    handleShareMedal,
    handleCloseMedalModal,
  } = useMedalReward(currentUserId);

  // Debug logging
  console.log("=== HOME TAB DEBUG ===");
  console.log("currentUserId:", currentUserId);
  console.log("loading:", loading);
  console.log("user:", user);
  console.log("stats:", stats);
  console.log("posts length:", posts?.length);
  console.log("streak:", streak);
  console.log("runCount:", runCount);
  console.log("======================");

  const handleNotificationPress = () => {
    setNotificationsModalVisible(true);
  };

  const handleNotificationItemPress = async (notification) => {
    // Mark this notification as read
    await markAsRead(notification.id);

    if (notification.type === "medal") {
      // Fetch full medal details from the API
      const response = await fetch(
        `/api/medals/get?medalId=${notification.related_medal_id}`,
      );
      if (response.ok) {
        const { medal } = await response.json();
        setNewMedal(medal);
        setShowMedalReward(true);
        setNotificationsModalVisible(false);
      }
    } else if (
      notification.type === "like" ||
      notification.type === "comment" ||
      notification.type === "mention"
    ) {
      // Navigate to the post (for now just close modal)
      setNotificationsModalVisible(false);
    } else if (
      notification.type === "follow" ||
      notification.type === "follow_request" ||
      notification.type === "follow_accepted"
    ) {
      // Navigate to the related user's profile
      if (notification.related_user_id) {
        setNotificationsModalVisible(false);
        router.push(`/user/${notification.related_user_id}`);
      }
    } else if (
      notification.type === "tier_promotion" ||
      notification.type === "tier_demotion"
    ) {
      // Navigate to trophies page
      setNotificationsModalVisible(false);
      router.push("/trophies");
    } else if (notification.type === "personal_best") {
      // Could navigate to run details in the future
      setNotificationsModalVisible(false);
    }
  };

  const handleMarkAllRead = async () => {
    await markAsRead();
    setHasNewNotifications(false);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#60a5fa" /* COLORS.primary */ />
        <StatusBar style={isDark ? "light" : "dark"} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#60a5fa" /* COLORS.primary */
          />
        }
      >
        {/* Header Section */}
        <HomeHeader
          username={user?.username}
          hasNewNotifications={hasNewNotifications}
          unreadCount={unreadCount}
          onNotificationPress={handleNotificationPress}
          topInset={insets.top}
        />

        {/* Stats Display */}
        <StatsDisplay
          stats={stats}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          streak={streak}
          runCount={runCount}
        />

        {/* Let's Run Button */}
        <RunButton onPress={() => router.push("/run")} />

        {/* Activity Feed */}
        <ActivityFeed
          posts={posts}
          currentUserId={currentUserId}
          onLike={(postId, currentLiked) =>
            handleLike(postId, currentLiked, setPosts)
          }
          onOpenComments={openComments}
          onUpdate={onRefresh}
          onDelete={(postId) => {
            setPosts((prev) => prev.filter((p) => p.id !== postId));
          }}
        />
      </ScrollView>

      {/* Comments Modal */}
      <CommentsModal
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        selectedPost={selectedPost}
        postComments={postComments}
        commentText={commentText}
        onCommentTextChange={setCommentText}
        onSubmitComment={() => submitComment(setPosts)}
        submittingComment={submittingComment}
        bottomInset={insets.bottom}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        visible={notificationsModalVisible}
        onClose={() => setNotificationsModalVisible(false)}
        notifications={notifications}
        onNotificationItemPress={handleNotificationItemPress}
        onMarkAllRead={handleMarkAllRead}
        bottomInset={insets.bottom}
      />

      {/* Medal Reward Modal */}
      <MedalRewardModal
        visible={showMedalReward}
        medal={newMedal}
        onClose={handleCloseMedalModal}
        onShare={(medal) => handleShareMedal(medal, onRefresh)}
      />
    </View>
  );
}
