// @ts-nocheck
import { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Image as ImageIcon, ChevronRight, Check, Sparkles, EyeOff } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { RouteMap } from '@/components/Home/FeedPost/RouteMap';
import useUpload from '@/utils/useUpload';
import PrivacySettingsModal from '@/components/PrivacySettingsModal';
import useUser from '@/utils/auth/useUser';
import { useAuthModal } from '@/utils/auth';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';
import CategoryIcon from '@/components/CategoryIcon';
import { useTheme } from '@/utils/themeStore';
import { COLORS, FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '@/constants/design';

const MOODS = [
  {
    id: 'unstoppable',
    iconCategory: 'unstoppable',
    label: 'Unstoppable',
    gradient: ['#ff6b6b', '#ff8c42'],
  },
  {
    id: 'relaxed',
    iconCategory: 'relaxed',
    label: 'Easy & relaxed',
    gradient: ['#a8e6cf', '#80d4ff'],
  },
  {
    id: 'grinding',
    iconCategory: 'grinding',
    label: 'Grinding',
    gradient: ['#b24592', '#f15f79'],
  },
  {
    id: 'focused',
    iconCategory: 'focused',
    label: 'Focused',
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: 'happy',
    iconCategory: 'happy',
    label: 'Happy miles',
    gradient: ['#ffd89b', '#ff9a9e'],
  },
  {
    id: 'meh',
    iconCategory: 'meh',
    label: 'Meh / just exercising',
    gradient: ['#757575', '#9e9e9e'],
  },
  {
    id: 'clearing',
    iconCategory: 'clearing',
    label: 'Clearing my head',
    gradient: ['#4facfe', '#00f2fe'],
  },
  {
    id: 'race',
    iconCategory: 'race',
    label: 'Race mode',
    gradient: ['#e52d27', '#b31217'],
  },
  {
    id: 'pet',
    iconCategory: 'pet',
    label: 'With my pup',
    gradient: ['#fb923c', '#fbbf24'],
  },
];

const STAT_OPTIONS = [
  { id: 'distance', label: 'Distance' },
  { id: 'pace', label: 'Pace' },
  { id: 'time', label: 'Time' },
  { id: 'elevation', label: 'Elevation' },
  { id: 'calories', label: 'Calories' },
  { id: 'temperature', label: 'Temperature' },
];

export default function RunCompletePage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { uploadFile, uploading } = useUpload();
  const { data: user, loading: userLoading } = useUser();
  const { open: openAuthModal } = useAuthModal();
  const { colors, isDark } = useTheme();

  // Add debug logging
  useEffect(() => {}, [user, userLoading]);

  const [selectedMood, setSelectedMood] = useState(null);
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [hiddenStats, setHiddenStats] = useState(['elevation', 'calories', 'temperature']);
  const [primaryStats, setPrimaryStats] = useState(['distance', 'pace', 'time']);
  const [saving, setSaving] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showRoute, setShowRoute] = useState(true);
  const [routeTrimMetres, setRouteTrimMetres] = useState(0);

  const distance = parseFloat(params.distance || 0);
  const duration = parseInt(params.duration || 0);
  const pace = parseFloat(params.pace || 0);
  const steps = parseInt(params.steps || 0);
  const cadence = parseFloat(params.cadence || 0);
  const calories = parseFloat(params.calories || 0);
  const elevation = parseFloat(params.elevation || 0);
  const temperature =
    params.temperature && params.temperature !== 'null' ? parseFloat(params.temperature) : null;
  const routeCoordinates = params.routeCoordinates ? JSON.parse(params.routeCoordinates) : [];

  // Calculate map region from route
  const mapRegion =
    routeCoordinates.length > 1
      ? (() => {
          const lats = routeCoordinates.map((c) => c.latitude);
          const lngs = routeCoordinates.map((c) => c.longitude);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);
          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);
          const padding = 0.002;
          return {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: Math.max(maxLat - minLat + padding, 0.005),
            longitudeDelta: Math.max(maxLng - minLng + padding, 0.005),
          };
        })()
      : null;

  useEffect(() => {
    // Success haptic when page loads
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatPace = (pace) => {
    const mins = Math.floor(pace);
    const secs = Math.round((pace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const url = await uploadFile();
      if (url) {
        setImageUrl(url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Failed', 'Could not upload image. Please try again.');
    }
  };

  const toggleStatVisibility = (statId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHiddenStats((prev) =>
      prev.includes(statId) ? prev.filter((s) => s !== statId) : [...prev, statId]
    );
  };

  const togglePrimaryStat = (statId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPrimaryStats((prev) => {
      if (prev.includes(statId)) {
        // Remove if already selected
        return prev.filter((s) => s !== statId);
      } else if (prev.length < 3) {
        // Add if less than 3 selected
        return [...prev, statId];
      } else {
        // Replace the first one if 3 are already selected
        return [...prev.slice(1), statId];
      }
    });
  };

  // Trim the first and last N metres from a route for privacy
  const trimRoute = (coords, trimMetres) => {
    if (!trimMetres || coords.length < 3) return coords;
    const R = 6371e3;
    const haversine = (a, b) => {
      const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
      const dLng = ((b.longitude - a.longitude) * Math.PI) / 180;
      const x =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((a.latitude * Math.PI) / 180) *
          Math.cos((b.latitude * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    };

    // Find start trim index
    let startIdx = 0;
    let accumulated = 0;
    for (let i = 1; i < coords.length; i++) {
      accumulated += haversine(coords[i - 1], coords[i]);
      if (accumulated >= trimMetres) {
        startIdx = i;
        break;
      }
    }

    // Find end trim index
    let endIdx = coords.length - 1;
    accumulated = 0;
    for (let i = coords.length - 2; i >= 0; i--) {
      accumulated += haversine(coords[i], coords[i + 1]);
      if (accumulated >= trimMetres) {
        endIdx = i;
        break;
      }
    }

    if (startIdx >= endIdx) return [];
    return coords.slice(startIdx, endIdx + 1);
  };

  const saveRun = async (shareToFeed = false) => {
    // Better error checking

    if (!user || !user.id) {
      Alert.alert('Error', 'You must be signed in to save runs.');
      return;
    }

    setSaving(true);

    try {
      // First, ensure the user exists in the users table
      const ensureResponse = await fetch('/api/users/ensure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!ensureResponse.ok) {
        const errorData = await ensureResponse.json();
        console.error('Ensure user error:', errorData);
        throw new Error(
          `Failed to ensure user exists: ${
            errorData.error || 'Unknown error'
          }. ${errorData.details || ''}`
        );
      }

      const { user: appUser } = await ensureResponse.json();

      const runData = {
        userId: appUser.id,
        distance,
        duration,
        pace,
        steps,
        cadence,
        calories,
        elevation,
        temperature,
        mood: selectedMood || null,
        shareToFeed,
        caption: caption || null,
        imageUrl: imageUrl || null,
        hiddenStats,
        primaryStats,
        withPet: selectedMood === 'pet',
        weightKg: user?.weight_kg ?? 70,
        routeCoordinates:
          showRoute && routeCoordinates.length > 0
            ? JSON.stringify(trimRoute(routeCoordinates, routeTrimMetres))
            : null,
      };

      const response = await fetch('/api/runs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(runData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server error:', data);
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      Alert.alert(
        'Run Saved! 🎉',
        shareToFeed
          ? 'Your run has been saved and shared to your feed!'
          : 'Your run has been saved!',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(tabs)/home');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error saving run:', error);
      Alert.alert(
        "Couldn't Save Run",
        `Something went wrong: ${error.message}. Please check your internet connection and try again.`,
        [{ text: 'OK' }]
      );
    } finally {
      setSaving(false);
    }
  };

  const getPrivacyStatusText = () => {
    const parts = [];
    if (!showRoute) parts.push('Route hidden');
    else if (routeTrimMetres > 0) parts.push(`Route trimmed ${routeTrimMetres}m`);
    if (hiddenStats.length > 0)
      parts.push(`${hiddenStats.length} stat${hiddenStats.length > 1 ? 's' : ''} hidden`);
    return parts.length > 0 ? parts.join(' • ') : 'All visible';
  };

  if (userLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#60a5fa" /* COLORS.primary */ />
      </View>
    );
  }

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: SPACING.xl,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: FONT_SIZE.xl,
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          You need to be signed in to save runs
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: FONT_SIZE.base,
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          Sign in to save your runs and share them with friends
        </Text>
        <TouchableOpacity
          onPress={() => openAuthModal({ mode: 'signin' })}
          style={{
            backgroundColor: '#60a5fa' /* COLORS.primary */,
            paddingVertical: SPACING.lg,
            paddingHorizontal: 24,
            borderRadius: 10,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#000', fontWeight: FONT_WEIGHT.bold }}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/home')}
          style={{
            backgroundColor: colors.cardBackground,
            paddingVertical: SPACING.lg,
            paddingHorizontal: 24,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: colors.text, fontWeight: FONT_WEIGHT.bold }}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: SPACING.xl,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.sm,
          }}
        >
          <Text
            style={{
              fontSize: FONT_SIZE.xxxl,
              color: colors.text,
              fontWeight: FONT_WEIGHT.bold,
            }}
          >
            Run Complete!
          </Text>
          <Sparkles size={24} color="#fbbf24" fill="#fbbf24" />
        </View>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/home')}
          style={{
            width: 40,
            height: 40,
            borderRadius: RADIUS.xl,
            backgroundColor: colors.cardBackground,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <X size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: SPACING.xl,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Primary Stats */}
        <View
          style={{
            backgroundColor: '#60a5fa' /* COLORS.primary */,
            borderRadius: RADIUS.lg,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 52,
                color: '#000',
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: -2,
              }}
            >
              {distance.toFixed(2)}
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE.xxl,
                color: '#000',
                marginLeft: 8,
                fontWeight: FONT_WEIGHT.semibold,
              }}
            >
              miles
            </Text>
          </View>
          <Text
            style={{
              fontSize: FONT_SIZE.xl,
              color: '#000',
              fontWeight: FONT_WEIGHT.semibold,
            }}
          >
            {formatTime(duration)}
          </Text>
        </View>

        {/* Route Map Preview — respects privacy settings */}
        {showRoute && routeCoordinates.length > 1 && (
          <RouteMap routeCoordinates={trimRoute(routeCoordinates, routeTrimMetres)} height={200} />
        )}
        {!showRoute && routeCoordinates.length > 1 && (
          <View
            style={{
              height: 60,
              borderRadius: RADIUS.md,
              backgroundColor: colors.cardBackground,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
              flexDirection: 'row',
              gap: 8,
            }}
          >
            <EyeOff size={16} color={colors.textTertiary} />
            <Text style={{ color: colors.textTertiary, fontSize: FONT_SIZE.sm }}>
              Route map hidden from post
            </Text>
          </View>
        )}

        {/* Secondary Stats Grid */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: SPACING.sm,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flex: 1,
              minWidth: '30%',
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.xs,
                color: colors.textSecondary,
                marginBottom: 2,
              }}
            >
              Pace
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE.md,
                color: colors.text,
                fontWeight: FONT_WEIGHT.semibold,
              }}
            >
              {formatPace(pace)} /mi
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              minWidth: '30%',
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.xs,
                color: colors.textSecondary,
                marginBottom: 2,
              }}
            >
              Steps
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE.md,
                color: colors.text,
                fontWeight: FONT_WEIGHT.semibold,
              }}
            >
              {steps.toLocaleString()}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              minWidth: '30%',
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.xs,
                color: colors.textSecondary,
                marginBottom: 2,
              }}
            >
              Cadence
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE.md,
                color: colors.text,
                fontWeight: FONT_WEIGHT.semibold,
              }}
            >
              {cadence.toFixed(0)} spm
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              minWidth: '30%',
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.xs,
                color: colors.textSecondary,
                marginBottom: 2,
              }}
            >
              Calories
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE.md,
                color: colors.text,
                fontWeight: FONT_WEIGHT.semibold,
              }}
            >
              {Math.round(calories).toLocaleString()} kcal
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              minWidth: '30%',
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.xs,
                color: colors.textSecondary,
                marginBottom: 2,
              }}
            >
              Elevation
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE.md,
                color: colors.text,
                fontWeight: FONT_WEIGHT.semibold,
              }}
            >
              {Math.round(elevation).toLocaleString()} ft
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              minWidth: '30%',
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.xs,
                color: colors.textSecondary,
                marginBottom: 2,
              }}
            >
              Temperature
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE.md,
                color: colors.text,
                fontWeight: FONT_WEIGHT.semibold,
              }}
            >
              {temperature !== null ? `${temperature.toFixed(0)}°F` : '--'}
            </Text>
          </View>
        </View>

        {/* Mood Selection */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: FONT_SIZE.lg,
              color: colors.text,
              fontWeight: FONT_WEIGHT.semibold,
              marginBottom: 10,
            }}
          >
            Post run vibes
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
            style={{ marginHorizontal: -20, paddingLeft: 20, flexGrow: 0 }}
          >
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                onPress={() => setSelectedMood(mood.id)}
                style={{
                  marginRight: 10,
                  width: 100,
                  height: 120,
                  borderRadius: RADIUS.lg,
                  overflow: 'hidden',
                  borderWidth: selectedMood === mood.id ? 3 : 2,
                  borderColor:
                    selectedMood === mood.id
                      ? '#10b981' /* COLORS.success */
                      : '#333' /* COLORS.border */,
                }}
              >
                <LinearGradient
                  colors={mood.gradient}
                  style={{
                    flex: 1,
                    padding: 12,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <CategoryIcon
                    category={mood.iconCategory}
                    size={48}
                    iconSize={24}
                    customGradient={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                  />
                  <Text
                    style={{
                      fontSize: FONT_SIZE.sm,
                      color: '#000',
                      fontWeight: FONT_WEIGHT.bold,
                      lineHeight: 14,
                      textAlign: 'center',
                    }}
                  >
                    {mood.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Caption Input */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: FONT_SIZE.lg,
              color: colors.text,
              fontWeight: FONT_WEIGHT.semibold,
              marginBottom: 8,
            }}
          >
            Add a caption (optional)
          </Text>
          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder="Share your thoughts..."
            placeholderTextColor={colors.textTertiary}
            multiline
            returnKeyType="done"
            blurOnSubmit={true}
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: RADIUS.md,
              padding: 14,
              color: colors.text,
              fontSize: FONT_SIZE.md,
              minHeight: 65,
              textAlignVertical: 'top',
            }}
          />
        </View>

        {/* Run Photo */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: FONT_SIZE.lg,
              color: colors.text,
              fontWeight: FONT_WEIGHT.semibold,
              marginBottom: 8,
            }}
          >
            Add a photo (optional)
          </Text>

          {imageUrl ? (
            <View>
              <Image
                source={{ uri: imageUrl }}
                style={{
                  width: '100%',
                  height: 200,
                  borderRadius: RADIUS.md,
                  marginBottom: 8,
                }}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setImageUrl(null)}
                style={{
                  backgroundColor: colors.cardBackground,
                  paddingVertical: 10,
                  borderRadius: RADIUS.sm,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#ef4444' /* COLORS.danger */,
                    fontWeight: FONT_WEIGHT.semibold,
                  }}
                >
                  Remove Photo
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handlePickImage}
              disabled={uploading}
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: RADIUS.md,
                padding: 14,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: colors.border,
                borderStyle: 'dashed',
              }}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#60a5fa" /* COLORS.primary */ />
              ) : (
                <>
                  <ImageIcon size={24} color={colors.textTertiary} />
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 13,
                      marginTop: 6,
                    }}
                  >
                    Tap to add a photo
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Privacy Settings Button */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: FONT_SIZE.lg,
              color: colors.text,
              fontWeight: FONT_WEIGHT.semibold,
              marginBottom: 8,
            }}
          >
            Post Settings
          </Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowPrivacyModal(true);
            }}
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: RADIUS.md,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: FONT_SIZE.md,
                  color: colors.text,
                  fontWeight: FONT_WEIGHT.semibold,
                }}
              >
                Manage Stats & Privacy
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  marginTop: 4,
                }}
              >
                {primaryStats.length} stat{primaryStats.length > 1 ? 's' : ''} to display •{' '}
                {getPrivacyStatusText()}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={{ gap: SPACING.md }}>
          <TouchableOpacity
            onPress={() => saveRun(true)}
            disabled={saving}
            style={{
              backgroundColor: '#60a5fa' /* COLORS.primary */,
              paddingVertical: SPACING.xl,
              borderRadius: RADIUS.md,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {saving ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text
                style={{
                  color: '#000',
                  fontSize: 17,
                  fontWeight: FONT_WEIGHT.bold,
                }}
              >
                Share to Feed
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => saveRun(false)}
            disabled={saving}
            style={{
              backgroundColor: colors.cardBackground,
              paddingVertical: SPACING.xl,
              borderRadius: RADIUS.md,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {saving ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text
                style={{
                  color: colors.text,
                  fontSize: 17,
                  fontWeight: FONT_WEIGHT.bold,
                }}
              >
                Save Only
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Privacy Settings Modal */}
      <PrivacySettingsModal
        visible={showPrivacyModal}
        hiddenStats={hiddenStats}
        onToggleStat={toggleStatVisibility}
        primaryStats={primaryStats}
        onTogglePrimaryStat={togglePrimaryStat}
        showRoute={showRoute}
        onToggleShowRoute={setShowRoute}
        routeTrimMetres={routeTrimMetres}
        onSetRouteTrim={setRouteTrimMetres}
        onClose={() => setShowPrivacyModal(false)}
      />
    </KeyboardAvoidingAnimatedView>
  );
}
