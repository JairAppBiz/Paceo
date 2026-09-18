// @ts-nocheck
import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Activity,
  Flame,
  Mountain,
  Gauge,
  Hourglass,
  Zap,
  Thermometer,
  Snowflake,
  Footprints,
  Sparkles,
  Leaf,
  Settings,
  Target,
  CloudRain,
  Flag,
  Trophy,
  TrendingUp,
  Sun,
  Meh as MehIcon,
  Route,
  Dog,
  Sunrise,
  Moon,
} from "lucide-react-native";

// Icon mapping for different categories
const ICON_MAP = {
  // Leaderboard categories (generic names)
  distance: Route,
  runs: Flame,
  elevation: Mountain,
  pace: Gauge,
  time: Hourglass,
  calories: Zap,
  heat: Thermometer,
  cold: Snowflake,
  steps: Footprints,

  // Database category names (actual medal categories)
  miles: Route,
  speed: Gauge,
  icy: Snowflake,

  // New categories
  pet: Dog,
  earlybird: Sunrise,
  nightowl: Moon,

  // Moods
  unstoppable: Sparkles,
  relaxed: Leaf,
  grinding: Settings,
  focused: Target,
  clearing: CloudRain,
  race: Flag,
  happy: Sun,
  meh: MehIcon,

  // Generic
  trophy: Trophy,
  trending: TrendingUp,
};

// Color schemes for each category
const COLOR_SCHEMES = {
  distance: {
    gradient: ["#60a5fa", "#3b82f6"],
    iconColor: "#fff",
  },
  runs: {
    gradient: ["#ef4444", "#dc2626"],
    iconColor: "#fff",
  },
  elevation: {
    gradient: ["#10b981", "#059669"],
    iconColor: "#fff",
  },
  pace: {
    gradient: ["#8b5cf6", "#7c3aed"],
    iconColor: "#fff",
  },
  time: {
    gradient: ["#a855f7", "#9333ea"],
    iconColor: "#fff",
  },
  calories: {
    gradient: ["#f59e0b", "#d97706"],
    iconColor: "#fff",
  },
  heat: {
    gradient: ["#f97316", "#ea580c"],
    iconColor: "#fff",
  },
  cold: {
    gradient: ["#06b6d4", "#0891b2"],
    iconColor: "#fff",
  },
  steps: {
    gradient: ["#14b8a6", "#0d9488"],
    iconColor: "#fff",
  },
  // Database category names (matching their equivalent generic categories)
  miles: {
    gradient: ["#60a5fa", "#3b82f6"],
    iconColor: "#fff",
  },
  speed: {
    gradient: ["#8b5cf6", "#7c3aed"],
    iconColor: "#fff",
  },
  icy: {
    gradient: ["#06b6d4", "#0891b2"],
    iconColor: "#fff",
  },
  // New categories
  pet: {
    gradient: ["#fb923c", "#fbbf24"],
    iconColor: "#fff",
  },
  earlybird: {
    gradient: ["#f97316", "#fb923c"],
    iconColor: "#fff",
  },
  nightowl: {
    gradient: ["#ec4899", "#f472b6"],
    iconColor: "#fff",
  },
  unstoppable: {
    gradient: ["#ec4899", "#db2777"],
    iconColor: "#fff",
  },
  relaxed: {
    gradient: ["#22c55e", "#16a34a"],
    iconColor: "#fff",
  },
  grinding: {
    gradient: ["#6366f1", "#4f46e5"],
    iconColor: "#fff",
  },
  focused: {
    gradient: ["#3b82f6", "#2563eb"],
    iconColor: "#fff",
  },
  clearing: {
    gradient: ["#06b6d4", "#0891b2"],
    iconColor: "#fff",
  },
  race: {
    gradient: ["#dc2626", "#b91c1c"],
    iconColor: "#fff",
  },
  happy: {
    gradient: ["#fbbf24", "#f59e0b"],
    iconColor: "#fff",
  },
  meh: {
    gradient: ["#6b7280", "#4b5563"],
    iconColor: "#fff",
  },
  trophy: {
    gradient: ["#fbbf24", "#f59e0b"],
    iconColor: "#fff",
  },
  trending: {
    gradient: ["#10b981", "#059669"],
    iconColor: "#fff",
  },
};

export default function CategoryIcon({
  category,
  size = 48,
  iconSize,
  customGradient,
  customIconColor,
  style,
}) {
  const iconDefinition = ICON_MAP[category] || Trophy;
  const colorScheme = COLOR_SCHEMES[category] || COLOR_SCHEMES.trophy;

  const gradient = customGradient || colorScheme.gradient;
  const iconColor = customIconColor || colorScheme.iconColor;
  const actualIconSize = iconSize || size * 0.5;

  // Check if it's an Ionicons icon (string) or Lucide component
  const isIonicon = typeof iconDefinition === "string";

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          // Add subtle shadow for depth
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={gradient}
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {isIonicon ? (
          <Ionicons
            name={iconDefinition}
            size={actualIconSize}
            color={iconColor}
          />
        ) : (
          React.createElement(iconDefinition, {
            size: actualIconSize,
            color: iconColor,
            strokeWidth: 2.5,
          })
        )}
      </LinearGradient>
    </View>
  );
}

// Helper component for just the icon without background (for smaller uses)
export function CategoryIconSimple({ category, size = 24, color = "#fff" }) {
  const iconDefinition = ICON_MAP[category] || Trophy;
  const isIonicon = typeof iconDefinition === "string";

  if (isIonicon) {
    return <Ionicons name={iconDefinition} size={size} color={color} />;
  }

  return React.createElement(iconDefinition, {
    size,
    color,
    strokeWidth: 2.5,
  });
}
