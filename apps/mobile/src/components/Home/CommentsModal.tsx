// @ts-nocheck
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  ActivityIndicator,
  FlatList,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { X, Send } from "lucide-react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import KeyboardAvoidingAnimatedView from "../KeyboardAvoidingAnimatedView";

export function CommentsModal({
  visible,
  onClose,
  selectedPost,
  postComments,
  commentText,
  onCommentTextChange,
  onSubmitComment,
  submittingComment,
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef(null);
  const flatListRef = useRef(null);

  const comments = selectedPost ? postComments[selectedPost.id] : [];

  // Scroll to bottom when new comment is added
  useEffect(() => {
    if (comments && comments.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [comments?.length]);

  const handleUserPress = (userId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    router.push(`/user/${userId}`);
  };

  const handleSubmit = () => {
    if (commentText.trim() && !submittingComment) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSubmitComment();
    }
  };

  const renderComment = ({ item }) => (
    <View style={{ marginBottom: 16 }}>
      <TouchableOpacity
        onPress={() => handleUserPress(item.user_id)}
        style={{ flexDirection: "row" }}
        activeOpacity={0.7}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: item.profile_image ? "#1a1a1a" : "#60a5fa",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
            overflow: "hidden",
          }}
        >
          {item.profile_image ? (
            <Image
              source={{ uri: item.profile_image }}
              style={{ width: 36, height: 36 }}
              contentFit="cover"
            />
          ) : (
            <Text style={{ color: "#000", fontWeight: "700", fontSize: 14 }}>
              {item.username?.[0]?.toUpperCase() || "?"}
            </Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
              {item.username}
            </Text>
            <Text style={{ color: "#666", fontSize: 11 }}>
              {new Date(item.created_at).toLocaleDateString()} at{" "}
              {new Date(item.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          <Text style={{ color: "#ddd", fontSize: 15, lineHeight: 21 }}>
            {item.comment_text}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingAnimatedView style={{ flex: 1 }}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
            justifyContent: "flex-end",
          }}
          onPress={onClose}
        >
          <Pressable
            style={{
              backgroundColor: "#000",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 20,
              maxHeight: "90%",
              flexDirection: "column",
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                marginBottom: 20,
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 20, color: "#fff", fontWeight: "700" }}
                >
                  Comments
                </Text>
                <Text style={{ color: "#666", fontSize: 13, marginTop: 2 }}>
                  {comments?.length || 0}{" "}
                  {comments?.length === 1 ? "comment" : "comments"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "#1a1a1a",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            {!comments ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 60,
                }}
              >
                <ActivityIndicator size="large" color="#60a5fa" />
              </View>
            ) : comments.length === 0 ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 40,
                  paddingVertical: 60,
                }}
              >
                <Text style={{ fontSize: 48, marginBottom: 12 }}>💬</Text>
                <Text
                  style={{
                    color: "#666",
                    fontSize: 16,
                    textAlign: "center",
                    marginBottom: 6,
                  }}
                >
                  No comments yet
                </Text>
                <Text
                  style={{
                    color: "#555",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  Be the first to comment!
                </Text>
              </View>
            ) : (
              <FlatList
                ref={flatListRef}
                data={comments}
                renderItem={renderComment}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  paddingBottom: 20,
                }}
                style={{ maxHeight: 500 }}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }}
              />
            )}

            {/* Comment Input */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingTop: 12,
                paddingBottom: Math.max(insets.bottom, 12),
                borderTopWidth: 1,
                borderTopColor: "#1a1a1a",
                backgroundColor: "#000",
              }}
            >
              <TextInput
                ref={inputRef}
                style={{
                  flex: 1,
                  backgroundColor: "#1a1a1a",
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  color: "#fff",
                  fontSize: 15,
                  marginRight: 10,
                  maxHeight: 100,
                }}
                placeholder="Add a comment..."
                placeholderTextColor="#666"
                value={commentText}
                onChangeText={onCommentTextChange}
                multiline
                returnKeyType="send"
                blurOnSubmit={false}
                onSubmitEditing={handleSubmit}
              />
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!commentText.trim() || submittingComment}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: commentText.trim() ? "#60a5fa" : "#1a1a1a",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
              >
                {submittingComment ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Send
                    size={20}
                    color={commentText.trim() ? "#000" : "#666"}
                  />
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingAnimatedView>
    </Modal>
  );
}
