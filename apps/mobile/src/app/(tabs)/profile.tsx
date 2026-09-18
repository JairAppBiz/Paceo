// @ts-nocheck
import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
  Alert,
  PanResponder,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import useUpload from "@/utils/useUpload";
import { useProfileData } from "@/hooks/useProfileData";
import FollowersSection from "@/components/Profile/FollowersSection";
import { LoadingState } from "@/components/Profile/LoadingState";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { MoodDisplay } from "@/components/Profile/MoodDisplay";
import { GoalDisplay } from "@/components/Profile/GoalDisplay";
import { TierTracking } from "@/components/Profile/TierTracking";
import { TrophyRoomCard } from "@/components/Profile/TrophyRoomCard";
import { StreakDisplay } from "@/components/Profile/StreakDisplay";
import { RankingsDisplay } from "@/components/Profile/RankingsDisplay";
import { EditProfileModal } from "@/components/Profile/EditProfileModal";
import { ActivityGraph } from "@/components/Profile/ActivityGraph";
import MedalRewardModal from "@/components/MedalRewardModal";
import { useTheme } from "@/utils/themeStore";
import useUser from "@/utils/auth/useUser";

export default function ProfilePage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { pickImage } = useUpload();
  const { colors, isDark } = useTheme();

  const { data: currentUser } = useUser();
  const currentUserId = currentUser?.id;

  const {
    loading,
    refreshing,
    user,
    stats,
    statsPeriod,
    runStats,
    personalBests,
    funStats,
    medalData,
    weeklyRunDays,
    goalData,
    setStatsPeriod,
    onRefresh,
    updateUser,
  } = useProfileData(currentUserId);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMedalForView, setSelectedMedalForView] = useState(null);

  // New state for profile customization
  const [selectedMood, setSelectedMood] = useState("unstoppable");
  const [currentRanking, setCurrentRanking] = useState({
    rank: 8,
    category: "Most Miles",
    scope: "City",
    period: "This Week",
  });
  const [bestRanking, setBestRanking] = useState({
    rank: 1,
    category: "Most Miles",
    scope: "State",
    period: "Aug 2024",
  });

  // State for displayed medals
  const [allMedals, setAllMedals] = useState([]);
  const [displayedMedals, setDisplayedMedals] = useState([]);
  const [bestRankingMedal, setBestRankingMedal] = useState(null);

  // State for tier tracking
  const [trackedTierData, setTrackedTierData] = useState(null);
  const [loadingTierData, setLoadingTierData] = useState(false);

  // Fetch all medals and displayed medals
  const fetchMedalsData = async () => {
    try {
      console.log("Fetching medals data for user:", currentUserId);

      // Fetch all medals
      const allMedalsResponse = await fetch(
        `/api/medals/list?userId=${currentUserId}`
      );

      let combinedMedals = [];

      if (allMedalsResponse.ok) {
        const data = await allMedalsResponse.json();
        console.log("All medals fetched:", data.medals?.length || 0);

        // Add tier field to each medal based on rank
        const medalsWithTiers = (data.medals || []).map((medal) => ({
          ...medal,
          tier:
            medal.rank_achieved === 1
              ? "gold"
              : medal.rank_achieved === 2
              ? "silver"
              : medal.rank_achieved === 3
              ? "bronze"
              : null,
        }));
        combinedMedals = medalsWithTiers;

        // Find the best ranking medal (rank 1, most miles)
        const bestMedal = medalsWithTiers.find(
          (medal) => medal.rank_achieved === 1 && medal.category === "miles"
        );
        if (bestMedal) {
          console.log("Best ranking medal found:", bestMedal);
          setBestRankingMedal(bestMedal);
        }
      }

      // Fetch tier promotions and add as badges
      const promotionsResponse = await fetch(
        `/api/tiers/promotions?userId=${currentUserId}`
      );

      if (promotionsResponse.ok) {
        const promotionsData = await promotionsResponse.json();
        const promotionBadges = (promotionsData.promotions || []).map(
          (promo) => ({
            id: promo.id, // Use numeric ID directly instead of string
            type: "promotion",
            category: promo.category,
            tier: promo.to_tier, // scout, ranger, apex, or legend
            promotion_type: promo.promotion_type,
            from_tier: promo.from_tier,
            to_tier: promo.to_tier,
            from_location: promo.from_location,
            to_location: promo.to_location,
            badge_awarded: promo.badge_awarded,
            period_start: promo.period_start,
            period_end: promo.period_end,
            period_start_date: promo.period_start,
            period_end_date: promo.period_end,
            awarded_date: promo.created_at,
            created_at: promo.created_at,
            is_promotion_badge: true,
            value: promo.value,
            unit: promo.unit,
          })
        );

        combinedMedals = [...combinedMedals, ...promotionBadges];
      }

      console.log("Combined medals (with promotions):", combinedMedals.length);
      console.log(
        "Combined medals IDs:",
        combinedMedals.map((m) => m.id)
      );
      setAllMedals(combinedMedals);

      // Fetch the latest user data to get displayed_medals
      const userResponse = await fetch(
        `/api/users/get?userId=${currentUserId}`
      );
      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log(
          "User data fetched, displayed_medals:",
          userData.user?.displayed_medals
        );
        const displayedMedalIds = userData.user?.displayed_medals || [];

        // Map over displayedMedalIds to preserve the user's selected order
        const displayed = displayedMedalIds
          .map((id) => {
            const found = combinedMedals.find((medal) => medal.id === id);
            console.log(`Looking for medal with ID ${id}, found:`, found);
            return found;
          })
          .filter((medal) => medal !== undefined);
        console.log("Displayed medals after filtering:", displayed);
        console.log("Displayed medals count:", displayed.length);
        setDisplayedMedals(displayed);
      }
    } catch (error) {
      console.error("Error fetching medals data:", error);
    }
  };

  // Fetch tracked tier progress
  const fetchTrackedTierProgress = async () => {
    try {
      setLoadingTierData(true);
      const category = user?.tracked_tier_category || "miles";

      const response = await fetch(
        `/api/tiers/get-tracked-progress?userId=${currentUserId}&category=${category}`
      );

      if (response.ok) {
        const data = await response.json();
        setTrackedTierData(data.tierProgress);
      }
    } catch (error) {
      console.error("Error fetching tier progress:", error);
    } finally {
      setLoadingTierData(false);
    }
  };

  // Fetch medals when user data is loaded
  React.useEffect(() => {
    if (user) {
      fetchMedalsData();
      fetchTrackedTierProgress();
    }
  }, [user]);

  // Swipe gesture handler
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          setActiveTab("profile");
        } else if (gestureState.dx < -50) {
          setActiveTab("activity");
        }
      },
    })
  ).current;

  const handleChangeProfilePicture = async () => {
    setUploadingImage(true);
    try {
      const imageUrl = await pickImage();

      if (imageUrl) {
        const res = await fetch("/api/users/update-picture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId,
            profileImage: imageUrl,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          updateUser(data.user);
        }
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUsernameChange = async (newUsername) => {
    try {
      const res = await fetch("/api/users/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          username: newUsername,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        // Refresh the entire profile to ensure consistency
        await onRefresh();
      } else {
        Alert.alert("Error", "Failed to update username");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      Alert.alert("Error", "Failed to update username");
    }
  };

  const handleMoodChange = async (newMood) => {
    // Update local state immediately
    setSelectedMood(newMood);
    // In the future, this could save to the database
    console.log("Mood changed to:", newMood);
  };

  const handleTierCategoryChange = () => {
    setEditModalVisible(true);
  };

  const handleTrackedCategoryChange = async (newCategory) => {
    try {
      const res = await fetch("/api/users/update-tracked-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          category: newCategory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        // Refresh tier progress with new category
        await fetchTrackedTierProgress();
      } else {
        Alert.alert("Error", "Failed to update tracked category");
      }
    } catch (error) {
      console.error("Error updating tracked category:", error);
      Alert.alert("Error", "Failed to update tracked category");
    }
  };

  const handleDisplayedMedalsChange = async (medals) => {
    try {
      console.log("Saving medals:", medals);
      const medalIds = medals.map((m) => m.id);
      console.log("Medal IDs to save:", medalIds);

      const res = await fetch("/api/users/update-displayed-medals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          medalIds,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("API response:", data);
        console.log(
          "Updated user displayed_medals:",
          data.user.displayed_medals
        );
        updateUser(data.user);
        // Update local state immediately
        setDisplayedMedals(medals);
        // Then refresh to ensure consistency
        await fetchMedalsData();
      } else {
        const errorData = await res.json();
        console.error("API error:", errorData);
        Alert.alert("Error", "Failed to update displayed medals");
      }
    } catch (error) {
      console.error("Error updating displayed medals:", error);
      Alert.alert("Error", "Failed to update displayed medals");
    }
  };

  const handleFollowersPress = () => {
    Alert.alert("Followers", "Followers list coming soon!");
  };

  const handleFollowingPress = () => {
    Alert.alert("Following", "Following list coming soon!");
  };

  const handleMedalPress = (medal) => {
    setSelectedMedalForView(medal);
  };

  const handleGoalChange = async (newGoal) => {
    try {
      const res = await fetch("/api/users/update-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          category: newGoal.category,
          period: newGoal.period,
          target: newGoal.target,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        // Refresh the entire profile to ensure consistency
        await onRefresh();
      } else {
        Alert.alert("Error", "Failed to update goal");
      }
    } catch (error) {
      console.error("Error updating goal:", error);
      Alert.alert("Error", "Failed to update goal");
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Gradient Background */}
      <LinearGradient
        colors={
          isDark
            ? ["#1e3a8a", "#1e293b", colors.background]
            : ["#60a5fa20", "#ffffff", colors.background]
        }
        locations={[0, 0.3, 0.6]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 400,
        }}
      />

      <ProfileHeader
        insets={insets}
        onSettingsPress={() => router.push("/settings")}
        onEditPress={() => setEditModalVisible(true)}
        username={user?.username}
      />

      {/* Minimal Tab Selector */}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 12,
          marginTop: 12,
          marginBottom: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={() => setActiveTab("profile")}
          style={{
            flex: 1,
            paddingVertical: 14,
            alignItems: "center",
            borderBottomWidth: activeTab === "profile" ? 2 : 0,
            borderBottomColor: "#60a5fa",
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color:
                activeTab === "profile" ? colors.text : colors.textTertiary,
            }}
          >
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("activity")}
          style={{
            flex: 1,
            paddingVertical: 14,
            alignItems: "center",
            borderBottomWidth: activeTab === "activity" ? 2 : 0,
            borderBottomColor: "#60a5fa",
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color:
                activeTab === "activity" ? colors.text : colors.textTertiary,
            }}
          >
            Activity Logs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Tab Content */}
      {activeTab === "profile" && (
        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 20,
              gap: 4,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#60a5fa"
              />
            }
          >
            <ProfilePicture
              user={user}
              uploadingImage={uploadingImage}
              followersCount={user?.follower_count || 0}
              followingCount={user?.following_count || 0}
              onFollowersPress={handleFollowersPress}
              onFollowingPress={handleFollowingPress}
            />

            <FollowersSection
              userId={user?.id}
              currentUserId={currentUserId}
              followerCount={user?.follower_count || 0}
              followingCount={user?.following_count || 0}
            />

            <MoodDisplay
              selectedMood={selectedMood}
              displayedMedals={displayedMedals}
              onMedalPress={handleMedalPress}
            />

            <GoalDisplay goalData={goalData} />

            <TierTracking
              tierData={trackedTierData}
              onEditPress={handleTierCategoryChange}
            />

            <TrophyRoomCard
              medalData={medalData}
              onPress={() => router.push("/trophies")}
            />

            <StreakDisplay
              currentStreak={stats.currentStreak}
              longestStreak={stats.longestStreak}
              weeklyRunDays={weeklyRunDays}
            />

            <RankingsDisplay
              currentRanking={currentRanking}
              bestRanking={bestRanking}
              bestRankingMedal={bestRankingMedal}
            />
          </ScrollView>
        </View>
      )}

      {/* Activity Logs Tab Content */}
      {activeTab === "activity" && (
        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#60a5fa"
              />
            }
          >
            {/* Activity Graph - Main content */}
            <View style={{ paddingHorizontal: 12, marginTop: 20 }}>
              <ActivityGraph userId={currentUserId} />
            </View>
          </ScrollView>
        </View>
      )}

      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        user={user}
        currentMood={selectedMood}
        currentGoal={
          goalData?.hasGoal
            ? {
                category: goalData.category,
                period: goalData.period,
                target: goalData.target,
              }
            : null
        }
        currentRanking={currentRanking}
        bestRanking={bestRanking}
        uploadingImage={uploadingImage}
        onChangePicture={handleChangeProfilePicture}
        onMoodChange={handleMoodChange}
        onGoalChange={handleGoalChange}
        onRankingChange={() => Alert.alert("Rankings Selector", "Coming soon!")}
        onUsernameChange={handleUsernameChange}
        allMedals={allMedals}
        displayedMedals={displayedMedals}
        onDisplayedMedalsChange={handleDisplayedMedalsChange}
        trackedCategory={user?.tracked_tier_category}
        onTrackedCategoryChange={handleTrackedCategoryChange}
      />

      <MedalRewardModal
        visible={!!selectedMedalForView}
        medal={selectedMedalForView}
        onClose={() => setSelectedMedalForView(null)}
      />
    </View>
  );
}