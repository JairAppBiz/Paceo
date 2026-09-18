// @ts-nocheck
import { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfileData } from '@/hooks/useProfileData';
import { LoadingState } from '@/components/Profile/LoadingState';
import { ProfilePicture } from '@/components/Profile/ProfilePicture';
import FollowersSection from '@/components/Profile/FollowersSection';
import FollowButton from '@/components/Profile/FollowButton';
import { MoodDisplay } from '@/components/Profile/MoodDisplay';
import { GoalDisplay } from '@/components/Profile/GoalDisplay';
import { TierTracking } from '@/components/Profile/TierTracking';
import { TrophyRoomCard } from '@/components/Profile/TrophyRoomCard';
import { StreakDisplay } from '@/components/Profile/StreakDisplay';
import { RankingsDisplay } from '@/components/Profile/RankingsDisplay';
import { ActivityGraph } from '@/components/Profile/ActivityGraph';
import MedalRewardModal from '@/components/MedalRewardModal';
import useUser from '@/utils/auth/useUser';
import { useTheme } from '@/utils/themeStore';
import { useAuthStore } from '@/utils/auth';

export default function UserProfilePage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = parseInt(params.id);
  const { colors, isDark } = useTheme();
  const { auth } = useAuthStore();

  const { data: currentUser } = useUser();
  const currentUserId = currentUser?.id;

  const { loading, refreshing, user, stats, medalData, weeklyRunDays, goalData, onRefresh } =
    useProfileData(userId);

  const [activeTab, setActiveTab] = useState('profile');
  const [displayedMedals, setDisplayedMedals] = useState([]);
  const [bestRankingMedal, setBestRankingMedal] = useState(null);
  const [localFollowerCount, setLocalFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [trackedTierData, setTrackedTierData] = useState(null);
  const [selectedMedalForView, setSelectedMedalForView] = useState(null);

  // Mock data for mood and rankings
  const [selectedMood] = useState('unstoppable');
  const [currentRanking] = useState({
    rank: 8,
    category: 'Most Miles',
    scope: 'City',
    period: 'This Week',
  });
  const [bestRanking] = useState({
    rank: 1,
    category: 'Most Miles',
    scope: 'State',
    period: 'Aug 2024',
  });

  // Fetch displayed medals
  useEffect(() => {
    if (user && (!user.profile_private || isFollowing || currentUserId === userId)) {
      const fetchMedals = async () => {
        try {
          const headers = {};
          if (auth?.jwt) {
            headers['Authorization'] = `Bearer ${auth.jwt}`;
          }

          const allMedalsResponse = await fetch(`/api/medals/list?userId=${userId}`, { headers });
          if (allMedalsResponse.ok) {
            const data = await allMedalsResponse.json();
            const displayedMedalIds = user.displayed_medals || [];
            const displayed = displayedMedalIds
              .map((id) => (data.medals || []).find((medal) => medal.id === id))
              .filter((medal) => medal !== undefined);
            setDisplayedMedals(displayed);

            const bestMedal = (data.medals || []).find(
              (medal) => medal.rank_achieved === 1 && medal.category === 'miles'
            );
            if (bestMedal) {
              setBestRankingMedal(bestMedal);
            }
          }
        } catch (error) {
          console.error('Error fetching medals:', error);
        }
      };
      fetchMedals();
    }
  }, [user, userId, isFollowing, currentUserId, auth]);

  // Fetch tier progress - Always visible even on private profiles
  useEffect(() => {
    if (user) {
      const fetchTierProgress = async () => {
        try {
          const headers = {};
          if (auth?.jwt) {
            headers['Authorization'] = `Bearer ${auth.jwt}`;
          }

          const category = user?.tracked_tier_category || 'miles';
          const response = await fetch(
            `/api/tiers/get-tracked-progress?userId=${userId}&category=${category}`,
            { headers }
          );
          if (response.ok) {
            const data = await response.json();
            setTrackedTierData(data.tierProgress);
          }
        } catch (error) {
          console.error('Error fetching tier progress:', error);
        }
      };
      fetchTierProgress();
    }
  }, [user, userId, auth]);

  // Check follow status
  useEffect(() => {
    if (currentUserId && userId && currentUserId !== userId) {
      const fetchFollowStatus = async () => {
        try {
          const headers = {};
          if (auth?.jwt) {
            headers.Cookie = `authjs.session-token=${auth.jwt}`;
          }

          const response = await fetch(`/api/users/follow-status?userId=${userId}`, { headers });
          if (response.ok) {
            const data = await response.json();
            setIsFollowing(data.isFollowing);
          }
        } catch (error) {
          console.error('Error fetching follow status:', error);
        }
      };
      fetchFollowStatus();
    }
  }, [currentUserId, userId, auth]);

  const handleFollowChange = (delta) => {
    setLocalFollowerCount((prev) => prev + delta);
    setIsFollowing(delta > 0);
    onRefresh();
  };

  const handleMedalPress = (medal) => {
    setSelectedMedalForView(medal);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: insets.top,
        }}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.textTertiary, fontSize: 16 }}>User not found</Text>
        </View>
      </View>
    );
  }

  const isOwnProfile = currentUserId === userId;
  const isPrivate = user?.profile_private && !isOwnProfile && !isFollowing;
  const displayFollowerCount = (user?.follower_count || 0) + localFollowerCount;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Gradient Background */}
      <LinearGradient
        colors={
          isDark
            ? ['#1e3a8a', '#1e293b', colors.background]
            : ['#60a5fa20', '#ffffff', colors.background]
        }
        locations={[0, 0.3, 0.6]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 400,
        }}
      />

      {/* Header with Back Button */}
      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          marginBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.cardBackground,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, color: colors.text, fontWeight: '700' }}>
          {user?.username}
        </Text>
      </View>

      {/* Tab Selector */}
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 12,
          marginBottom: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={() => setActiveTab('profile')}
          style={{
            flex: 1,
            paddingVertical: 14,
            alignItems: 'center',
            borderBottomWidth: activeTab === 'profile' ? 2 : 0,
            borderBottomColor: '#60a5fa',
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: activeTab === 'profile' ? colors.text : colors.textTertiary,
            }}
          >
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('activity')}
          style={{
            flex: 1,
            paddingVertical: 14,
            alignItems: 'center',
            borderBottomWidth: activeTab === 'activity' ? 2 : 0,
            borderBottomColor: '#60a5fa',
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: activeTab === 'activity' ? colors.text : colors.textTertiary,
            }}
          >
            Activity Logs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20, gap: 4 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#60a5fa" />
          }
        >
          <ProfilePicture user={user} uploadingImage={false} />

          <FollowersSection
            userId={userId}
            currentUserId={currentUserId}
            followerCount={displayFollowerCount}
            followingCount={user?.following_count || 0}
          />

          {!isOwnProfile && currentUserId && (
            <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
              <FollowButton userId={userId} onFollowChange={handleFollowChange} />
            </View>
          )}

          {/* Show tier badge even when private */}
          <TierTracking tierData={trackedTierData} onEditPress={() => {}} />

          {isPrivate ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 80,
              }}
            >
              <Lock size={48} color="#444" />
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 16,
                  marginTop: 16,
                  textAlign: 'center',
                }}
              >
                This account is private
              </Text>
              <Text
                style={{
                  color: colors.textTertiary,
                  fontSize: 14,
                  marginTop: 8,
                  textAlign: 'center',
                }}
              >
                Follow to see their activity
              </Text>
            </View>
          ) : (
            <>
              <MoodDisplay
                selectedMood={selectedMood}
                displayedMedals={displayedMedals}
                onMedalPress={handleMedalPress}
              />

              <GoalDisplay goalData={goalData} />

              <TrophyRoomCard medalData={medalData} onPress={() => {}} />

              <StreakDisplay
                currentStreak={stats?.currentStreak}
                longestStreak={stats?.longestStreak}
                weeklyRunDays={weeklyRunDays}
              />

              <RankingsDisplay
                currentRanking={currentRanking}
                bestRanking={bestRanking}
                bestRankingMedal={bestRankingMedal}
              />
            </>
          )}
        </ScrollView>
      )}

      {/* Activity Logs Tab Content */}
      {activeTab === 'activity' && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#60a5fa" />
          }
        >
          {isPrivate ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 80,
              }}
            >
              <Lock size={48} color="#444" />
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 16,
                  marginTop: 16,
                  textAlign: 'center',
                }}
              >
                This account is private
              </Text>
              <Text
                style={{
                  color: colors.textTertiary,
                  fontSize: 14,
                  marginTop: 8,
                  textAlign: 'center',
                }}
              >
                Follow to see their activity
              </Text>
            </View>
          ) : (
            <View style={{ paddingHorizontal: 12, marginTop: 20 }}>
              <ActivityGraph userId={userId} />
            </View>
          )}
        </ScrollView>
      )}

      <MedalRewardModal
        visible={!!selectedMedalForView}
        medal={selectedMedalForView}
        onClose={() => setSelectedMedalForView(null)}
      />
    </View>
  );
}
