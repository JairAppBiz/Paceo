// @ts-nocheck
import { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Trophy,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  Send,
  X,
  Sparkles,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import CategoryIcon from "@/components/CategoryIcon";
import Medal3D from "@/components/Medal3D";

const CATEGORY_INFO = {
  miles: { label: "Miles", iconCategory: "distance", unit: "mi" },
  runs: { label: "Runs", iconCategory: "runs", unit: "runs" },
  elevation: { label: "Elevation", iconCategory: "elevation", unit: "ft" },
  speed: { label: "Speed", iconCategory: "pace", unit: "mph" },
  time: { label: "Time", iconCategory: "time", unit: "min" },
  calories: { label: "Calories", iconCategory: "calories", unit: "kcal" },
  heat: { label: "Heat", iconCategory: "heat", unit: "°F" },
  icy: { label: "Icy", iconCategory: "cold", unit: "°F" },
  steps: { label: "Steps", iconCategory: "steps", unit: "steps" },
  unstoppable: {
    label: "Unstoppable",
    iconCategory: "unstoppable",
    unit: "runs",
  },
  relaxed: { label: "Easy & relaxed", iconCategory: "relaxed", unit: "runs" },
  grinding: { label: "Grinding", iconCategory: "grinding", unit: "runs" },
  focused: { label: "Focused", iconCategory: "focused", unit: "runs" },
  happy: { label: "Happy miles", iconCategory: "happy", unit: "runs" },
  meh: { label: "Meh", iconCategory: "meh", unit: "runs" },
  clearing: { label: "Clearing head", iconCategory: "clearing", unit: "runs" },
  race: { label: "Race mode", iconCategory: "race", unit: "runs" },
};

const getMedalLabel = (rank) => {
  if (rank === 1) return "Gold Medal";
  if (rank === 2) return "Silver Medal";
  if (rank === 3) return "Bronze Medal";
  if (rank <= 10) return "Top 10";
  if (rank <= 50) return "Top 50";
  if (rank <= 100) return "Top 100";
  return "Ranked";
};

const getLocationLabel = (isGlobal, location) => {
  if (isGlobal || location === "global") return "🌍 Global";
  if (location === "country") return "🏳️ Country";
  if (location === "state") return "🗺️ State";
  if (location === "city") return "🏙️ City";
  return "📍 " + location;
};

// Medal Icon Component with Blue Ribbon - matching TrophyRoomCard
function MedalIcon({ rank, color, size = 160 }) {
  const ribbonWidth = size * 0.15;
  const ribbonHeight = size * 0.25;
  const medalSize = size * 0.6;
  const fontSize = size * 0.3;

  return (
    <View style={{ alignItems: "center" }}>
      {/* Blue Ribbon */}
      <View
        style={{
          flexDirection: "row",
          gap: 4,
          marginBottom: -8,
          zIndex: 1,
        }}
      >
        <View
          style={{
            width: ribbonWidth,
            height: ribbonHeight,
            backgroundColor: "#6b9ff5",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        />
        <View
          style={{
            width: ribbonWidth,
            height: ribbonHeight,
            backgroundColor: "#548ff0",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        />
      </View>

      {/* Medal Circle */}
      <View
        style={{
          width: medalSize,
          height: medalSize,
          borderRadius: medalSize / 2,
          backgroundColor: color,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}
      >
        <Text
          style={{
            fontSize: fontSize,
            fontWeight: "700",
            color: rank === 2 ? "#4a4a4a" : "#5a3a2a",
          }}
        >
          {rank}
        </Text>
      </View>
    </View>
  );
}

// Tier badge icon configs
const TIER_CONFIG = {
  scout: {
    label: "Scout",
    iconUrl:
      "https://raw.createusercontent.com/018ad631-d524-4678-8feb-729a3737f842/",
    gradient: ["#10b981", "#34d399"],
  },
  ranger: {
    label: "Ranger",
    iconUrl:
      "https://raw.createusercontent.com/453eff42-636b-45db-8144-afc1e650d023/",
    gradient: ["#3b82f6", "#60a5fa"],
  },
  apex: {
    label: "Apex",
    iconUrl:
      "https://raw.createusercontent.com/20703a77-61e1-416a-9808-bcd9a5b02834/",
    gradient: ["#ef4444", "#f87171"],
  },
  legend: {
    label: "Legend",
    iconUrl:
      "https://raw.createusercontent.com/70ea0c42-0563-4d67-a000-a4244c5345f4/",
    gradient: ["#f59e0b", "#fbbf24"],
  },
};

// Tier Badge Icon Component
function TierBadgeIcon({ tier, size = 160 }) {
  const config = TIER_CONFIG[tier];
  if (!config) return null;

  const iconSize = size * 0.5;

  return (
    <LinearGradient
      colors={config.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      }}
    >
      <Image
        source={{ uri: config.iconUrl }}
        style={{ width: iconSize, height: iconSize }}
        contentFit="contain"
      />
    </LinearGradient>
  );
}

export default function MedalRewardModal({ visible, medal, onClose, onShare }) {
  const insets = useSafeAreaInsets();
  const [sharing, setSharing] = useState(false);

  if (!medal) return null;

  const isPromotion = medal.type === "promotion";

  const categoryInfo = CATEGORY_INFO[medal.category] || {
    label: medal.category,
    iconCategory: "trophy",
    unit: "",
  };

  // For regular medals
  const medalLabel = isPromotion ? null : getMedalLabel(medal.rank_achieved);

  // For promotions - format tier names
  const getTierLabel = (tier) => {
    const labels = {
      scout: "Scout",
      ranger: "Ranger",
      apex: "Apex",
      legend: "Legend",
    };
    return labels[tier] || tier;
  };

  // Format the medal value based on category
  const formatMedalValue = (value, unit) => {
    if (!value) return null;

    const numValue = parseFloat(value);

    // Categories that should show whole numbers
    const wholeNumberCategories = ["runs", "steps", "ft", "kcal", "min", "°F"];
    const shouldBeWholeNumber = wholeNumberCategories.some((cat) =>
      unit.includes(cat),
    );

    if (shouldBeWholeNumber) {
      return Math.round(numValue).toLocaleString();
    }

    // For other values like miles, show up to 2 decimals
    return numValue.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      if (onShare) {
        await onShare(medal);
      }
    } catch (error) {
      console.error("Error sharing medal:", error);
    } finally {
      setSharing(false);
    }
  };

  // Format date
  const date = new Date(
    isPromotion ? medal.created_at : medal.awarded_date || Date.now(),
  );
  const dateStr = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Get medal emoji based on rank or tier
  const getMedalEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    if (rank <= 10) return "🔴";
    if (rank <= 50) return "🔵";
    return "🟢";
  };

  // Get tier emoji for promotions
  const getTierEmoji = (tier) => {
    const emojis = {
      scout: "🟢",
      ranger: "🔵",
      apex: "🔴",
      legend: "🏆",
    };
    return emojis[tier] || "🎖️";
  };

  const badgeEmoji = isPromotion
    ? getTierEmoji(medal.to_tier)
    : getMedalEmoji(medal.rank_achieved);
  const isTopTierMedal = !isPromotion && medal.rank_achieved <= 3; // Gold, Silver, Bronze

  // Get medal color for podium medals
  const getMedalColor = (rank) => {
    if (rank === 1) return "#f5c563"; // Gold
    if (rank === 2) return "#c0c0c0"; // Silver
    if (rank === 3) return "#cd9575"; // Bronze
    return "#888";
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.95)",
        }}
      >
        <StatusBar style="light" />

        {/* Confetti-like sparkles overlay */}
        <View
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {[...Array(20)].map((_, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <Text style={{ fontSize: 20, opacity: 0.3 }}>✨</Text>
            </View>
          ))}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 40,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: "absolute",
              top: insets.top + 20,
              right: 20,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#1a1a1a",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>

          {/* 3D Medal Display - Use custom icons */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            {isPromotion ? (
              // Use tier badge icon for promotions
              <TierBadgeIcon tier={medal.to_tier} size={160} />
            ) : isTopTierMedal ? (
              // Use custom medal icon for podium medals
              <MedalIcon
                rank={medal.rank_achieved}
                color={getMedalColor(medal.rank_achieved)}
                size={160}
              />
            ) : (
              // Use ribbon for other medals
              <Medal3D
                rank={medal.rank_achieved}
                size={160}
                showRibbon={true}
              />
            )}

            {/* "MEDAL/BADGE UNLOCKED" Badge */}
            <View
              style={{
                position: "absolute",
                bottom: -16,
                backgroundColor: isPromotion ? "#10b981" : "#ec4899",
                paddingHorizontal: 20,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 3,
                borderColor: "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#fff",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {isPromotion ? "Badge Unlocked" : "Medal Unlocked"}
              </Text>
            </View>
          </View>

          {/* Main Achievement Message */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            {isPromotion ? (
              <>
                <Text
                  style={{
                    fontSize: 28,
                    color: "#fff",
                    fontWeight: "900",
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  {getTierLabel(medal.to_tier)} Badge Earned!
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: "#888",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  Promoted from {getTierLabel(medal.from_tier)} to{" "}
                  {getTierLabel(medal.to_tier)}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#666",
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  {categoryInfo.label} •{" "}
                  {getLocationLabel(false, medal.to_location)}
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={{
                    fontSize: 28,
                    color: "#fff",
                    fontWeight: "900",
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  {medalLabel} Achieved!
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: "#888",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  You ranked #{medal.rank_achieved} in {categoryInfo.label}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#666",
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  {medal.period} •{" "}
                  {getLocationLabel(medal.is_global, medal.location)}
                </Text>
              </>
            )}
          </View>

          {/* Details Section */}
          <View
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 16,
              padding: 4,
              marginBottom: 24,
            }}
          >
            {/* Category Row */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#2a2a2a",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <CategoryIcon
                  category={categoryInfo.iconCategory || "trophy"}
                  size={36}
                  iconSize={18}
                  style={{ marginRight: 12 }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}
                  >
                    {categoryInfo.label}
                  </Text>
                </View>
              </View>
            </View>

            {/* For regular medals: show rank */}
            {!isPromotion && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#2a2a2a",
                }}
              >
                <Text
                  style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}
                >
                  Rank
                </Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Text style={{ fontSize: 24 }}>{badgeEmoji}</Text>
                  <Text style={{ fontSize: 16, color: "#888" }}>
                    #{medal.rank_achieved}
                  </Text>
                </View>
              </View>
            )}

            {/* For regular medals: show the stat that earned the medal */}
            {!isPromotion && medal.value && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#2a2a2a",
                }}
              >
                <Text
                  style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}
                >
                  Your Performance
                </Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: "#fbbf24",
                      fontWeight: "700",
                    }}
                  >
                    {formatMedalValue(
                      medal.value,
                      medal.unit || categoryInfo.unit,
                    )}{" "}
                    {medal.unit || categoryInfo.unit}
                  </Text>
                </View>
              </View>
            )}

            {/* For promotions: show tier progression */}
            {isPromotion && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: "#2a2a2a",
                  }}
                >
                  <Text
                    style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}
                  >
                    Promotion
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "#888" }}>
                      {getTierLabel(medal.from_tier)} →{" "}
                      {getTierLabel(medal.to_tier)}
                    </Text>
                    <Text style={{ fontSize: 20 }}>{badgeEmoji}</Text>
                  </View>
                </View>

                {/* For promotions: always show the stat that earned the promotion */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: "#2a2a2a",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#fff",
                      fontWeight: "500",
                    }}
                  >
                    Your Performance
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {medal.value ? (
                      <Text
                        style={{
                          fontSize: 18,
                          color: "#fbbf24",
                          fontWeight: "700",
                        }}
                      >
                        {formatMedalValue(
                          medal.value,
                          medal.unit || categoryInfo.unit,
                        )}{" "}
                        {medal.unit || categoryInfo.unit}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#666",
                          fontStyle: "italic",
                        }}
                      >
                        Top 15% performer
                      </Text>
                    )}
                  </View>
                </View>
              </>
            )}

            {/* Location Row */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#2a2a2a",
              }}
            >
              <Text style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}>
                Location
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                {isPromotion && medal.to_location === "global" && (
                  <Sparkles size={18} color="#fbbf24" fill="#fbbf24" />
                )}
                <Text style={{ fontSize: 16, color: "#888" }}>
                  {isPromotion
                    ? getLocationLabel(false, medal.to_location)
                    : getLocationLabel(medal.is_global, medal.location)}
                </Text>
              </View>
            </View>

            {/* Period Row */}
            {!isPromotion && medal.period && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#2a2a2a",
                }}
              >
                <Text
                  style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}
                >
                  Period
                </Text>
                <Text style={{ fontSize: 16, color: "#888" }}>
                  {medal.period}
                </Text>
              </View>
            )}

            {/* For promotions: show period dates */}
            {isPromotion && medal.period_start && medal.period_end && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#2a2a2a",
                }}
              >
                <Text
                  style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}
                >
                  Period
                </Text>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 16, color: "#888" }}>
                    {new Date(medal.period_start).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(medal.period_end).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            )}

            {/* Date Earned Row */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 16,
              }}
            >
              <Text style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}>
                Earned On
              </Text>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ fontSize: 16, color: "#888" }}>{dateStr}</Text>
                <Text style={{ fontSize: 14, color: "#666", marginTop: 2 }}>
                  {timeStr}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
            }}
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#1a1a1a",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#333",
              }}
            >
              <X size={28} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity
              onPress={handleShare}
              disabled={sharing}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#fbbf24",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#f59e0b",
              }}
            >
              {sharing ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Send size={26} color="#000" strokeWidth={2.5} />
              )}
            </TouchableOpacity>
          </View>

          {/* Encouragement Message */}
          <View
            style={{
              marginTop: 24,
              padding: 20,
              backgroundColor: "#1a1a1a",
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#888",
                textAlign: "center",
                lineHeight: 24,
              }}
            >
              {isPromotion
                ? "Congrats on your promotion! Keep climbing! 🚀"
                : "Keep going! You're doing amazing 💪"}
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
