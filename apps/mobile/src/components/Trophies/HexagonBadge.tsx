// @ts-nocheck
import { View } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { MedalBadge } from "@/components/Medal3D";
import CategoryIcon from "@/components/CategoryIcon";

export function HexagonBadge({
  rank,
  category,
  color = "#fbbf24",
  locked = false,
  size = 80,
  iconSize,
  tier, // Add tier prop for promotion badges
}) {
  const hexPoints = "50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5";
  const medalSize = size * 0.5;
  const actualIconSize = iconSize || size * 0.45;

  // Check if this is a podium finish (1st, 2nd, or 3rd)
  const isPodium = rank >= 1 && rank <= 3;

  // Use even brighter, shinier colors for podium finishes
  let displayColor = color;
  if (isPodium && !locked) {
    if (rank === 1) {
      displayColor = "#fbbf24"; // Vibrant gold
    } else if (rank === 2) {
      displayColor = "#e8e8e8"; // Brighter, more visible silver
    } else if (rank === 3) {
      displayColor = "#fb923c"; // Vibrant bronze
    }
  }

  // Override color for tier badges
  if (tier && !locked) {
    if (tier === "apex") {
      displayColor = "#ef4444"; // Red for apex
    } else if (tier === "ranger") {
      displayColor = "#3b82f6"; // Blue for ranger
    } else if (tier === "scout") {
      displayColor = "#10b981"; // Green for scout
    }
  }

  // Same stroke width for all podium finishes
  let strokeWidth = 3;
  if (isPodium) {
    strokeWidth = 4; // All podium medals get same border width - smaller to prevent cropping
  } else if (tier) {
    strokeWidth = 3; // Tier badges get outlined border
  } else {
    strokeWidth = 3;
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Enhanced glow effect for podium finishes - gold and bronze are extra shiny */}
        {isPodium && !locked && (
          <>
            {rank === 1 && (
              <>
                {/* Gold - shiny but contained to prevent cropping */}
                <Polygon
                  points={hexPoints}
                  fill="none"
                  stroke={displayColor}
                  strokeWidth="12"
                  opacity="0.35"
                />
                <Polygon
                  points={hexPoints}
                  fill="none"
                  stroke={displayColor}
                  strokeWidth="9"
                  opacity="0.5"
                />
                <Polygon
                  points={hexPoints}
                  fill="none"
                  stroke={displayColor}
                  strokeWidth="7"
                  opacity="0.7"
                />
              </>
            )}
            {rank === 2 && (
              <>
                {/* Silver - reduced glow to prevent cropping */}
                <Polygon
                  points={hexPoints}
                  fill="none"
                  stroke={displayColor}
                  strokeWidth="12"
                  opacity="0.25"
                />
                <Polygon
                  points={hexPoints}
                  fill="none"
                  stroke={displayColor}
                  strokeWidth="8"
                  opacity="0.35"
                />
                <Polygon
                  points={hexPoints}
                  fill="none"
                  stroke={displayColor}
                  strokeWidth="6"
                  opacity="0.5"
                />
              </>
            )}
            {rank === 3 && (
              <>
                {/* Bronze - shiny but contained to prevent cropping */}
                <Polygon
                  points={hexPoints}
                  fill="none"
                  stroke={displayColor}
                  strokeWidth="12"
                  opacity="0.35"
                />
                <Polygon
                  points={hexPoints}
                  fill="none"
                  stroke={displayColor}
                  strokeWidth="9"
                  opacity="0.5"
                />
                <Polygon
                  points={hexPoints}
                  fill="none"
                  stroke={displayColor}
                  strokeWidth="7"
                  opacity="0.7"
                />
              </>
            )}
          </>
        )}

        {/* Main hexagon */}
        <Polygon
          points={hexPoints}
          fill={locked ? "#e5e7eb" : "#fff"}
          stroke={locked ? "#d1d5db" : displayColor}
          strokeWidth={strokeWidth}
        />
      </Svg>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ opacity: locked ? 0.3 : 1 }}>
          {category ? (
            <CategoryIcon
              category={category}
              size={actualIconSize}
              iconSize={actualIconSize * 0.55}
            />
          ) : (
            <MedalBadge rank={rank} size={medalSize} />
          )}
        </View>
      </View>
    </View>
  );
}
