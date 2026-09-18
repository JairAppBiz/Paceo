// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";
import { MoreVertical } from "lucide-react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";

export function PostHeader({ post, isOwnPost, showMenu, onMenuToggle }) {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => router.push(`/user/${post.user_id}`)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: post.profile_image ? "#1a1a1a" : "#60a5fa",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
            overflow: "hidden",
          }}
        >
          {post.profile_image ? (
            <Image
              source={{ uri: post.profile_image }}
              style={{ width: 34, height: 34 }}
            />
          ) : (
            <Text style={{ color: "#000", fontWeight: "700", fontSize: 13 }}>
              {post.username?.[0]?.toUpperCase() || "?"}
            </Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
            {post.username}
          </Text>
          <Text style={{ color: "#666", fontSize: 11 }}>
            {new Date(post.created_at).toLocaleDateString()} at{" "}
            {new Date(post.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </TouchableOpacity>

      {isOwnPost && (
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onMenuToggle();
          }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: showMenu ? "#2a2a2a" : "transparent",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MoreVertical size={20} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
}
