// @ts-nocheck
import { View, Text, Image } from "react-native";

export function CurrentUserRank({ currentUserRank, category }) {
  if (!currentUserRank) return null;

  // Format pace as MM:SS /mi
  const formatPace = (pace) => {
    const paceNum = parseFloat(pace);
    const mins = Math.floor(paceNum);
    const secs = Math.round((paceNum - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")} /mi`;
  };

  // Format value based on category
  const formatValue = (value, unit) => {
    if (category === "speed" || unit === "min/mi") {
      return formatPace(value);
    }

    // Format number with commas and handle decimals
    const numValue = parseFloat(value);
    let formatted;

    if (
      unit === "runs" ||
      unit === "steps" ||
      unit === "ft" ||
      unit === "cal" ||
      unit === "min"
    ) {
      formatted = Math.round(numValue).toLocaleString();
    } else {
      formatted = numValue.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }

    return `${formatted} ${unit}`;
  };

  return (
    <View
      style={{
        marginTop: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#1a1a2e",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2a2a3e",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side: Rank and Avatar */}
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View
            style={{
              width: 32,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#9ca3af",
                fontWeight: "600",
              }}
            >
              {currentUserRank.rank}
            </Text>
          </View>

          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: currentUserRank.profileImage
                ? "#1a1a1a"
                : "#60a5fa",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
              overflow: "hidden",
            }}
          >
            {currentUserRank.profileImage ? (
              <Image
                source={{ uri: currentUserRank.profileImage }}
                style={{ width: 36, height: 36 }}
              />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color: "#000",
                  fontWeight: "600",
                }}
              >
                {currentUserRank.username[0].toUpperCase()}
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                color: "#fff",
                fontWeight: "600",
              }}
              numberOfLines={1}
            >
              {currentUserRank.username} (You)
            </Text>
          </View>
        </View>

        {/* Right side: Value */}
        <View style={{ marginLeft: 8 }}>
          <Text
            style={{
              fontSize: 13,
              color: "#9ca3af",
              fontWeight: "600",
            }}
          >
            {formatValue(currentUserRank.value, currentUserRank.unit)}
          </Text>
        </View>
      </View>
    </View>
  );
}
