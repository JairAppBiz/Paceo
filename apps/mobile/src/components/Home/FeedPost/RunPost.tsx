// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import CategoryIcon from "@/components/CategoryIcon";
import { MOODS } from "@/constants/moods";
import { RouteMap } from "./RouteMap";
import { formatDuration, formatPace } from "@/utils/formatters";

export function RunPost({ post, expanded, onToggleExpanded }) {
  const mood = post.run_mood ? MOODS.find((m) => m.id === post.run_mood) : null;
  const primaryStats = post.primary_stats || ["distance", "pace", "time"];

  const getStatDisplay = (statId) => {
    if (post.hidden_stats?.includes(statId)) {
      return null;
    }

    switch (statId) {
      case "distance":
        return {
          label: "Distance",
          value: `${Number(post.run_distance || 0).toFixed(2)} mi`,
        };
      case "pace":
        if (!post.run_pace) return null;
        return {
          label: "Pace",
          value: formatPace(Number(post.run_pace)),
        };
      case "time":
        if (!post.run_duration) return null;
        return {
          label: "Time",
          value: formatDuration(Number(post.run_duration)),
        };
      case "elevation":
        if (!post.run_elevation) return null;
        return {
          label: "Elevation",
          value: `${Math.round(
            Number(post.run_elevation)
          ).toLocaleString()} ft`,
        };
      case "calories":
        if (!post.run_calories) return null;
        return {
          label: "Calories",
          value: `${Math.round(
            Number(post.run_calories)
          ).toLocaleString()} kcal`,
        };
      case "temperature":
        if (!post.run_temperature) return null;
        return {
          label: "Temperature",
          value: `${Number(post.run_temperature).toFixed(0)}°F`,
        };
      default:
        return null;
    }
  };

  const allStatIds = [
    "distance",
    "pace",
    "time",
    "elevation",
    "calories",
    "temperature",
  ];

  const primaryStatData = primaryStats.map(getStatDisplay).filter(Boolean);
  const secondaryStatIds = allStatIds.filter(
    (id) => !primaryStats.includes(id)
  );
  const secondaryStatData = secondaryStatIds
    .map(getStatDisplay)
    .filter(Boolean);
  const hasSecondaryStats = secondaryStatData.length > 0;

  return (
    <View style={{ marginBottom: 10 }}>
      {post.caption && (
        <Text
          style={{
            color: "#fff",
            fontSize: 15,
            fontWeight: "700",
            marginBottom: 10,
          }}
        >
          {post.caption}
        </Text>
      )}

      {mood && (
        <LinearGradient
          colors={mood.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 20,
            marginBottom: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <CategoryIcon
            category={mood.iconCategory}
            size={24}
            iconSize={12}
            customGradient={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
          />
          <Text
            style={{
              fontSize: 12,
              color: "#fff",
              fontWeight: "700",
            }}
          >
            {mood.label}
          </Text>
        </LinearGradient>
      )}

      {post.image_url && (
        <Image
          source={{ uri: post.image_url }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 10,
            marginBottom: 12,
          }}
          contentFit="cover"
        />
      )}

      {/* Route Map — shown if run has GPS coordinates */}
      {post.run_route_coordinates && (
        <RouteMap routeCoordinates={post.run_route_coordinates} height={160} />
      )}

      {primaryStatData.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 8,
          }}
        >
          {primaryStatData.map((stat, index) => (
            <View key={index} style={{ width: "31%" }}>
              <Text
                style={{
                  color: "#888",
                  fontSize: 11,
                  marginBottom: 2,
                }}
              >
                {stat.label}
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {stat.value}
              </Text>
            </View>
          ))}
        </View>
      )}

      {primaryStatData.length === 0 && (
        <View
          style={{
            backgroundColor: "#2a2a2a",
            borderRadius: 8,
            padding: 10,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#888", fontSize: 13, textAlign: "center" }}>
            Stats hidden by user
          </Text>
        </View>
      )}

      {hasSecondaryStats && (
        <View>
          {expanded && (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 8,
              }}
            >
              {secondaryStatData.map((stat, index) => (
                <View key={index} style={{ width: "31%" }}>
                  <Text
                    style={{
                      color: "#888",
                      fontSize: 12,
                      marginBottom: 3,
                    }}
                  >
                    {stat.label}
                  </Text>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    {stat.value}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onToggleExpanded();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 6,
              gap: 4,
            }}
          >
            <Text
              style={{
                color: "#888",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {expanded ? "Show less" : `+${secondaryStatData.length} more`}
            </Text>
            {expanded ? (
              <ChevronUp size={14} color="#888" />
            ) : (
              <ChevronDown size={14} color="#888" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}