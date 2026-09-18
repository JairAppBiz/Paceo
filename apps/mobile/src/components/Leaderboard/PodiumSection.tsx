// @ts-nocheck
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Crown } from "lucide-react-native";
import { useRouter } from "expo-router";
import Medal3D from "@/components/Medal3D";

export function PodiumSection({ topThree }) {
  const router = useRouter();

  if (topThree.length === 0) return null;

  const handleUserPress = (user) => {
    if (!user.isCurrentUser && user.id) {
      router.push(`/user/${user.id}`);
    }
  };

  const PodiumCard = ({ user, rank, borderColor, size = "normal" }) => {
    const isLarge = size === "large";
    const avatarSize = isLarge ? 90 : 70;
    const medalSize = isLarge ? 70 : 56;

    const CardWrapper = user.isCurrentUser ? View : TouchableOpacity;
    const cardProps = user.isCurrentUser
      ? {}
      : { onPress: () => handleUserPress(user), activeOpacity: 0.7 };

    return (
      <CardWrapper
        style={{
          alignItems: "center",
          width: 110,
          marginBottom: isLarge ? 0 : 20,
        }}
        {...cardProps}
      >
        {isLarge && (
          <Crown
            size={40}
            color="#fbbf24"
            fill="#fbbf24"
            style={{ marginBottom: 4 }}
          />
        )}
        <View
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            borderWidth: 4,
            borderColor: borderColor,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: user.profileImage ? "#1a1a1a" : "#000",
            overflow: "hidden",
          }}
        >
          {user.profileImage ? (
            <Image
              source={{ uri: user.profileImage }}
              style={{
                width: avatarSize - 8,
                height: avatarSize - 8,
                borderRadius: (avatarSize - 8) / 2,
              }}
            />
          ) : (
            <Text
              style={{
                fontSize: isLarge ? 36 : 28,
                color: "#fff",
                fontWeight: "700",
              }}
            >
              {user.username[0].toUpperCase()}
            </Text>
          )}
        </View>
        <Text
          style={{
            fontSize: isLarge ? 18 : 16,
            color: "#fff",
            fontWeight: isLarge ? "700" : "600",
            marginBottom: 2,
          }}
          numberOfLines={1}
        >
          {user.username}
          {user.isCurrentUser ? " (You)" : ""}
        </Text>
        <Text
          style={{
            fontSize: isLarge ? 16 : 14,
            color: borderColor,
            fontWeight: "700",
          }}
        >
          {user.value} {user.unit}
        </Text>
        <View
          style={{
            marginTop: 8,
          }}
        >
          <Medal3D rank={rank} size={medalSize} showRibbon={true} />
        </View>
      </CardWrapper>
    );
  };

  return (
    <View style={{ marginBottom: 40 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {/* 2nd Place */}
        {topThree[1] && (
          <PodiumCard user={topThree[1]} rank={2} borderColor="#e5e7eb" />
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <PodiumCard
            user={topThree[0]}
            rank={1}
            borderColor="#fbbf24"
            size="large"
          />
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <PodiumCard user={topThree[2]} rank={3} borderColor="#f97316" />
        )}
      </View>
    </View>
  );
}
