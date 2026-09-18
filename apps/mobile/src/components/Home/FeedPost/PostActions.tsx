// @ts-nocheck
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Heart, MessageCircle } from "lucide-react-native";

export function PostActions({
  post,
  likeScale,
  commentScale,
  onLikePress,
  onLikeCountPress,
  onCommentPress,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Animated.View style={{ transform: [{ scale: likeScale }] }}>
          <TouchableOpacity
            onPress={onLikePress}
            style={{
              paddingVertical: 8,
              paddingLeft: 12,
              paddingRight: 8,
              borderRadius: 9999,
              backgroundColor: post.user_liked
                ? "rgba(239, 68, 68, 0.15)"
                : "#2a2a2a",
            }}
            activeOpacity={0.7}
          >
            <Heart
              size={18}
              color={post.user_liked ? "#ef4444" : "#666"}
              fill={post.user_liked ? "#ef4444" : "transparent"}
            />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          onPress={onLikeCountPress}
          disabled={post.like_count === 0}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 8,
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: 14,
              color: post.like_count > 0 ? "#fff" : "#666",
              fontWeight: "700",
            }}
          >
            {post.like_count || 0}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Animated.View style={{ transform: [{ scale: commentScale }] }}>
          <TouchableOpacity
            onPress={onCommentPress}
            style={{
              paddingVertical: 8,
              paddingLeft: 12,
              paddingRight: 8,
              borderRadius: 9999,
              backgroundColor: "#2a2a2a",
            }}
            activeOpacity={0.7}
          >
            <MessageCircle size={18} color="#666" />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          onPress={onCommentPress}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 8,
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: 14,
              color: post.comment_count > 0 ? "#fff" : "#666",
              fontWeight: "700",
            }}
          >
            {post.comment_count || 0}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
