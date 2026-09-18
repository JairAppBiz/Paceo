// @ts-nocheck
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  Share,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  User,
  Palette,
  Trophy,
  Bell,
  Lock,
  Share2,
  FileText,
  LogOut,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import { useTheme } from "@/utils/themeStore";
import useUser from "@/utils/auth/useUser";
import { useAuth } from "@/utils/auth";
import {
  COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  SPACING,
  RADIUS,
} from "@/constants/design";

export default function SettingsPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { data: currentUser } = useUser();
  const { signOut } = useAuth();
  const currentUserId = currentUser?.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [includeInLeaderboard, setIncludeInLeaderboard] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profilePrivate, setProfilePrivate] = useState(false);

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const res = await fetch(`/api/users/get?userId=${currentUserId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setUsername(data.user.username || "");
        setEmail(data.user.email || "");
        setCity(data.user.city || "");
        setWeightKg(data.user.weight_kg ? String(data.user.weight_kg) : "");
        setIncludeInLeaderboard(data.user.include_in_leaderboard ?? true);
        setNotificationsEnabled(data.user.notifications_enabled ?? true);
        setProfilePrivate(data.user.profile_private ?? false);
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (field, value) => {
    try {
      const res = await fetch("/api/users/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          [field]: value,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error updating setting:", error);
    }
  };

  const handleSaveAccountInfo = async () => {
    try {
      const res = await fetch("/api/users/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          username,
          email,
          city,
          weightKg: weightKg ? parseFloat(weightKg) : undefined,
        }),
      });

      if (res.ok) {
        Alert.alert("Success", "Account info updated!");
      }
    } catch (error) {
      console.error("Error updating account info:", error);
      Alert.alert("Error", "Failed to update account info");
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: "Check out this awesome running app!",
        title: "RunMate App",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          signOut();
          router.replace("/");
        },
      },
    ]);
  };

  const openPrivacyPolicy = () => {
    Linking.openURL("https://example.com/privacy");
  };

  const openTermsOfService = () => {
    Linking.openURL("https://example.com/terms");
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
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingAnimatedView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={28} color={colors.text} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: FONT_SIZE.xxl,
              fontWeight: FONT_WEIGHT.bold,
              color: colors.text,
            }}
          >
            Settings
          </Text>
          <View style={{ width: 28 }} />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <User size={20} color="#60a5fa" /* COLORS.primary */ />
            <Text
              style={{
                fontSize: FONT_SIZE.xl,
                fontWeight: FONT_WEIGHT.semibold,
                color: colors.text,
                marginLeft: 8,
              }}
            >
              Account
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: RADIUS.lg,
              padding: 20,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.base,
                color: colors.textSecondary,
                marginBottom: 8,
              }}
            >
              Username
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor={colors.textTertiary}
              returnKeyType="done"
              blurOnSubmit={true}
              style={{
                backgroundColor: colors.secondaryBackground,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: RADIUS.sm,
                padding: 12,
                color: colors.text,
                fontSize: FONT_SIZE.lg,
                marginBottom: 16,
              }}
            />

            <Text
              style={{
                fontSize: FONT_SIZE.base,
                color: colors.textSecondary,
                marginBottom: 8,
              }}
            >
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
              blurOnSubmit={true}
              style={{
                backgroundColor: colors.secondaryBackground,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: RADIUS.sm,
                padding: 12,
                color: colors.text,
                fontSize: FONT_SIZE.lg,
                marginBottom: 16,
              }}
            />

            <Text
              style={{
                fontSize: FONT_SIZE.base,
                color: colors.textSecondary,
                marginBottom: 8,
              }}
            >
              City
            </Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Enter city"
              placeholderTextColor={colors.textTertiary}
              returnKeyType="done"
              blurOnSubmit={true}
              style={{
                backgroundColor: colors.secondaryBackground,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: RADIUS.sm,
                padding: 12,
                color: colors.text,
                fontSize: FONT_SIZE.lg,
                marginBottom: 16,
              }}
            />

            <Text
              style={{
                fontSize: FONT_SIZE.base,
                color: colors.textSecondary,
                marginBottom: 8,
              }}
            >
              Weight (kg) — used for calorie accuracy
            </Text>
            <TextInput
              value={weightKg}
              onChangeText={setWeightKg}
              placeholder="e.g. 70"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
              returnKeyType="done"
              blurOnSubmit={true}
              style={{
                backgroundColor: colors.secondaryBackground,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: RADIUS.sm,
                padding: 12,
                color: colors.text,
                fontSize: FONT_SIZE.lg,
                marginBottom: 16,
              }}
            />

            <TouchableOpacity
              onPress={handleSaveAccountInfo}
              style={{
                backgroundColor: "#60a5fa" /* COLORS.primary */,
                borderRadius: RADIUS.sm,
                padding: 14,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: FONT_SIZE.lg,
                  fontWeight: FONT_WEIGHT.semibold,
                }}
              >
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Section */}
        <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Palette size={20} color="#8b5cf6" />
            <Text
              style={{
                fontSize: FONT_SIZE.xl,
                fontWeight: FONT_WEIGHT.semibold,
                color: colors.text,
                marginLeft: 8,
              }}
            >
              Theme
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: RADIUS.lg,
              padding: 20,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: FONT_SIZE.lg, color: colors.text }}>
                Dark Mode
              </Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{
                  false: "#475569",
                  true: "#60a5fa" /* COLORS.primary */,
                }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Leaderboard Section */}
        <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Trophy size={20} color="#fbbf24" />
            <Text
              style={{
                fontSize: FONT_SIZE.xl,
                fontWeight: FONT_WEIGHT.semibold,
                color: colors.text,
                marginLeft: 8,
              }}
            >
              Leaderboard
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: RADIUS.lg,
              padding: 20,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: FONT_SIZE.lg, color: colors.text }}>
                Include in Leaderboards
              </Text>
              <Switch
                value={includeInLeaderboard}
                onValueChange={(value) => {
                  setIncludeInLeaderboard(value);
                  updateSetting("includeInLeaderboard", value);
                }}
                trackColor={{
                  false: "#475569",
                  true: "#60a5fa" /* COLORS.primary */,
                }}
                thumbColor="#fff"
              />
            </View>
            <Text
              style={{
                fontSize: FONT_SIZE.sm,
                color: colors.textSecondary,
                marginTop: 8,
              }}
            >
              Your runs will be hidden from leaderboards when disabled
            </Text>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Bell size={20} color="#34d399" />
            <Text
              style={{
                fontSize: FONT_SIZE.xl,
                fontWeight: FONT_WEIGHT.semibold,
                color: colors.text,
                marginLeft: 8,
              }}
            >
              Notifications
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: RADIUS.lg,
              padding: 20,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: FONT_SIZE.lg, color: colors.text }}>
                Enable Notifications
              </Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={(value) => {
                  setNotificationsEnabled(value);
                  updateSetting("notificationsEnabled", value);
                }}
                trackColor={{
                  false: "#475569",
                  true: "#60a5fa" /* COLORS.primary */,
                }}
                thumbColor="#fff"
              />
            </View>
            <Text
              style={{
                fontSize: FONT_SIZE.sm,
                color: colors.textSecondary,
                marginTop: 8,
              }}
            >
              Get notified about new achievements, likes, and comments
            </Text>
          </View>
        </View>

        {/* Privacy Section */}
        <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Lock size={20} color="#ec4899" />
            <Text
              style={{
                fontSize: FONT_SIZE.xl,
                fontWeight: FONT_WEIGHT.semibold,
                color: colors.text,
                marginLeft: 8,
              }}
            >
              Privacy
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: RADIUS.lg,
              padding: 20,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: FONT_SIZE.lg, color: colors.text }}>
                Private Profile
              </Text>
              <Switch
                value={profilePrivate}
                onValueChange={(value) => {
                  setProfilePrivate(value);
                  updateSetting("profilePrivate", value);
                }}
                trackColor={{
                  false: "#475569",
                  true: "#60a5fa" /* COLORS.primary */,
                }}
                thumbColor="#fff"
              />
            </View>
            <Text
              style={{
                fontSize: FONT_SIZE.sm,
                color: colors.textSecondary,
                marginTop: 8,
              }}
            >
              Only approved followers can see your stats and activities
            </Text>
          </View>
        </View>

        {/* Share Section */}
        <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={handleShareApp}>
            <View
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: RADIUS.lg,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Share2 size={20} color="#60a5fa" /* COLORS.primary */ />
                <Text
                  style={{
                    fontSize: FONT_SIZE.lg,
                    color: colors.text,
                    marginLeft: 12,
                  }}
                >
                  Share App
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Legal Section */}
        <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={openPrivacyPolicy}>
            <View
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: RADIUS.lg,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FileText size={20} color={colors.textSecondary} />
                <Text
                  style={{
                    fontSize: FONT_SIZE.lg,
                    color: colors.text,
                    marginLeft: 12,
                  }}
                >
                  Privacy Policy
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={openTermsOfService}>
            <View
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: RADIUS.lg,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FileText size={20} color={colors.textSecondary} />
                <Text
                  style={{
                    fontSize: FONT_SIZE.lg,
                    color: colors.text,
                    marginLeft: 12,
                  }}
                >
                  Terms of Service
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={handleLogout}>
            <LinearGradient
              colors={["#7f1d1d", "#450a0a"]}
              style={{
                borderRadius: RADIUS.lg,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LogOut size={20} color="#fff" />
              <Text
                style={{
                  fontSize: FONT_SIZE.lg,
                  color: "#fff",
                  fontWeight: FONT_WEIGHT.semibold,
                  marginLeft: 12,
                }}
              >
                Logout
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingAnimatedView>
  );
}