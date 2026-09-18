// @ts-nocheck
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Medal, Trophy, Award } from "lucide-react-native";

// 3D Medal component with depth and shadows
export default function Medal3D({ rank, size = 60, showRibbon = true }) {
  const getMedalConfig = () => {
    if (rank === 1) {
      return {
        colors: ["#ffd700", "#ffed4e", "#ffa500"],
        shadowColor: "#ffa500",
        icon: Medal,
        innerColors: ["#fffacd", "#ffd700"],
        borderWidth: size * 0.04, // Reduced to prevent cropping
      };
    }
    if (rank === 2) {
      return {
        colors: ["#f5f5f5", "#e8e8e8", "#d1d5db"],
        shadowColor: "#d1d5db",
        icon: Medal,
        innerColors: ["#ffffff", "#e8e8e8"],
        borderWidth: size * 0.04, // Same as gold and bronze
      };
    }
    if (rank === 3) {
      return {
        colors: ["#cd7f32", "#b87333", "#8b4513"],
        shadowColor: "#8b4513",
        icon: Medal,
        innerColors: ["#e9967a", "#cd7f32"],
        borderWidth: size * 0.04, // Reduced to prevent cropping
      };
    }
    if (rank <= 10) {
      return {
        colors: ["#6366f1", "#4f46e5", "#4338ca"],
        shadowColor: "#4338ca",
        icon: Trophy,
        innerColors: ["#818cf8", "#6366f1"],
        borderWidth: size * 0.04,
      };
    }
    if (rank <= 50) {
      return {
        colors: ["#10b981", "#059669", "#047857"],
        shadowColor: "#047857",
        icon: Award,
        innerColors: ["#34d399", "#10b981"],
        borderWidth: size * 0.04,
      };
    }
    if (rank <= 100) {
      return {
        colors: ["#8b5cf6", "#7c3aed", "#6d28d9"],
        shadowColor: "#6d28d9",
        icon: Award,
        innerColors: ["#a78bfa", "#8b5cf6"],
        borderWidth: size * 0.04,
      };
    }
    return {
      colors: ["#6b7280", "#4b5563", "#374151"],
      shadowColor: "#374151",
      icon: Award,
      innerColors: ["#9ca3af", "#6b7280"],
      borderWidth: size * 0.04,
    };
  };

  const config = getMedalConfig();
  const IconComponent = config.icon;
  const iconSize = size * 0.5;

  return (
    <View
      style={{
        width: size,
        height: size,
        position: "relative",
      }}
    >
      {/* Shadow layers for 3D effect */}
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: config.shadowColor,
          opacity: 0.3,
          top: 4,
          left: 0,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: config.shadowColor,
          opacity: 0.2,
          top: 6,
          left: 0,
        }}
      />

      {/* Main medal body */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: "hidden",
          position: "relative",
          borderWidth: config.borderWidth,
          borderColor: "#fff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <LinearGradient
          colors={config.colors}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.7, y: 1 }}
        >
          {/* Inner circle for depth */}
          <View
            style={{
              width: size * 0.75,
              height: size * 0.75,
              borderRadius: (size * 0.75) / 2,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LinearGradient
              colors={config.innerColors}
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Shine effect */}
              <View
                style={{
                  position: "absolute",
                  top: size * 0.05,
                  left: size * 0.1,
                  width: size * 0.3,
                  height: size * 0.15,
                  backgroundColor: "rgba(255,255,255,0.4)",
                  borderRadius: size * 0.15,
                  transform: [{ rotate: "-45deg" }],
                }}
              />

              <IconComponent
                size={iconSize}
                color="#fff"
                strokeWidth={2.5}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 2,
                }}
              />
            </LinearGradient>
          </View>
        </LinearGradient>
      </View>

      {/* Ribbon (optional) */}
      {showRibbon && rank <= 3 && (
        <View
          style={{
            position: "absolute",
            top: size * 0.8,
            left: size * 0.35,
            width: size * 0.3,
            height: size * 0.5,
            overflow: "hidden",
          }}
        >
          {/* Left ribbon */}
          <View
            style={{
              position: "absolute",
              width: size * 0.12,
              height: size * 0.4,
              backgroundColor: config.colors[1],
              left: 0,
              top: 0,
              borderBottomLeftRadius: size * 0.06,
              borderBottomRightRadius: size * 0.06,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
            }}
          />
          {/* Right ribbon */}
          <View
            style={{
              position: "absolute",
              width: size * 0.12,
              height: size * 0.4,
              backgroundColor: config.colors[1],
              right: 0,
              top: 0,
              borderBottomLeftRadius: size * 0.06,
              borderBottomRightRadius: size * 0.06,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
            }}
          />
        </View>
      )}
    </View>
  );
}

// Helper component for smaller badges without ribbons
export function MedalBadge({ rank, size = 40 }) {
  return <Medal3D rank={rank} size={size} showRibbon={false} />;
}
