// @ts-nocheck
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Crown } from "lucide-react-native";

export function LeaderboardList({ users, category }) {
  const router = useRouter();

  const getMedalForRank = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  const getSizeForRank = (rank) => {
    if (rank === 1)
      return {
        avatarSize: 46,
        nameSize: 16,
        valueSize: 14,
        paddingVertical: 12,
      };
    if (rank === 2)
      return {
        avatarSize: 44,
        nameSize: 15.5,
        valueSize: 13.5,
        paddingVertical: 11,
      };
    if (rank === 3)
      return {
        avatarSize: 42,
        nameSize: 15,
        valueSize: 13,
        paddingVertical: 10.5,
      };
    return {
      avatarSize: 40,
      nameSize: 14.5,
      valueSize: 13,
      paddingVertical: 10,
    };
  };

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

    // For whole number categories or elevation, show no decimals
    if (
      unit === "runs" ||
      unit === "steps" ||
      unit === "ft" ||
      unit === "cal" ||
      unit === "min"
    ) {
      formatted = Math.round(numValue).toLocaleString();
    } else {
      // For miles and other decimal values
      formatted = numValue.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }

    return `${formatted} ${unit}`;
  };

  return (
    <>
      {users.map((user) => {
        const medal = getMedalForRank(user.rank);
        const isFirstPlace = user.rank === 1;
        const sizes = getSizeForRank(user.rank);

        // If it's the current user, make it non-clickable
        if (user.isCurrentUser) {
          return (
            <View
              key={user.rank}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: sizes.paddingVertical,
                paddingHorizontal: 16,
                marginBottom: 2,
                backgroundColor: "#1a1a2e",
                borderRadius: 12,
              }}
            >
              {/* Rank or Medal */}
              <View
                style={{
                  width: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                {medal ? (
                  <Text style={{ fontSize: 32 }}>{medal}</Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 18,
                      color: "#6b7280",
                      fontWeight: "600",
                    }}
                  >
                    {user.rank}
                  </Text>
                )}
              </View>

              {/* Avatar with Crown */}
              <View style={{ marginRight: 12, position: "relative" }}>
                {isFirstPlace && (
                  <View
                    style={{
                      position: "absolute",
                      top: -24,
                      left: (sizes.avatarSize - 24) / 2,
                      zIndex: 10,
                    }}
                  >
                    <Crown size={24} color="#fbbf24" fill="#fbbf24" />
                  </View>
                )}
                <View
                  style={{
                    width: sizes.avatarSize,
                    height: sizes.avatarSize,
                    borderRadius: sizes.avatarSize / 2,
                    backgroundColor: user.profileImage ? "#1a1a1a" : "#1e40af",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  {user.profileImage ? (
                    <Image
                      source={{ uri: user.profileImage }}
                      style={{
                        width: sizes.avatarSize,
                        height: sizes.avatarSize,
                      }}
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: sizes.avatarSize * 0.4,
                        color: "#fff",
                        fontWeight: "600",
                      }}
                    >
                      {user.username[0].toUpperCase()}
                    </Text>
                  )}
                </View>
              </View>

              {/* Username and Value */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: sizes.nameSize,
                    color: "#fff",
                    fontWeight: "600",
                    marginBottom: 2,
                  }}
                >
                  {user.username} (You)
                </Text>
                <Text
                  style={{
                    fontSize: sizes.valueSize,
                    color: "#9ca3af",
                    fontWeight: "500",
                  }}
                >
                  {formatValue(user.value, user.unit)}
                </Text>
              </View>
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={user.rank}
            onPress={() => router.push(`/user/${user.id}`)}
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: sizes.paddingVertical,
              paddingHorizontal: 16,
              marginBottom: 2,
              backgroundColor: "transparent",
              borderRadius: 12,
            }}
          >
            {/* Rank or Medal */}
            <View
              style={{
                width: 40,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              {medal ? (
                <Text style={{ fontSize: 32 }}>{medal}</Text>
              ) : (
                <Text
                  style={{
                    fontSize: 18,
                    color: "#6b7280",
                    fontWeight: "600",
                  }}
                >
                  {user.rank}
                </Text>
              )}
            </View>

            {/* Avatar with Crown */}
            <View style={{ marginRight: 12, position: "relative" }}>
              {isFirstPlace && (
                <View
                  style={{
                    position: "absolute",
                    top: -24,
                    left: (sizes.avatarSize - 24) / 2,
                    zIndex: 10,
                  }}
                >
                  <Crown size={24} color="#fbbf24" fill="#fbbf24" />
                </View>
              )}
              <View
                style={{
                  width: sizes.avatarSize,
                  height: sizes.avatarSize,
                  borderRadius: sizes.avatarSize / 2,
                  backgroundColor: user.profileImage ? "#1a1a1a" : "#1e40af",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                {user.profileImage ? (
                  <Image
                    source={{ uri: user.profileImage }}
                    style={{
                      width: sizes.avatarSize,
                      height: sizes.avatarSize,
                    }}
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: sizes.avatarSize * 0.4,
                      color: "#fff",
                      fontWeight: "600",
                    }}
                  >
                    {user.username[0].toUpperCase()}
                  </Text>
                )}
              </View>
            </View>

            {/* Username and Value */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: sizes.nameSize,
                  color: "#fff",
                  fontWeight: "600",
                  marginBottom: 2,
                }}
              >
                {user.username}
              </Text>
              <Text
                style={{
                  fontSize: sizes.valueSize,
                  color: "#9ca3af",
                  fontWeight: "500",
                }}
              >
                {formatValue(user.value, user.unit)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </>
  );
}
