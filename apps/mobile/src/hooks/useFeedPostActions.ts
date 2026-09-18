// @ts-nocheck
import { useRef, useState } from "react";
import { Animated, Alert } from "react-native";
import * as Haptics from "expo-haptics";

export function useFeedPostActions({ post, onLike, onDelete }) {
  const likeScale = useRef(new Animated.Value(1)).current;
  const commentScale = useRef(new Animated.Value(1)).current;
  const [showMenu, setShowMenu] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const animateButton = (animValue) => {
    Animated.sequence([
      Animated.spring(animValue, {
        toValue: 0.85,
        useNativeDriver: true,
      }),
      Animated.spring(animValue, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLikePress = () => {
    animateButton(likeScale);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLike(post.id, post.user_liked);
  };

  const handleLikeCountPress = () => {
    if (post.like_count > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setLikesModalVisible(true);
    }
  };

  const handleCommentPress = (onOpenComments) => {
    animateButton(commentScale);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onOpenComments(post);
  };

  const handleEdit = () => {
    setShowMenu(false);
    setEditModalVisible(true);
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowMenu(false);

    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch("/api/posts/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: post.id }),
              });

              if (response.ok) {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success,
                );
                onDelete(post.id);
              } else {
                throw new Error("Failed to delete");
              }
            } catch (error) {
              console.error("Error deleting post:", error);
              Alert.alert(
                "Delete Failed",
                "Could not delete post. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const toggleMenu = () => setShowMenu(!showMenu);
  const toggleExpanded = () => setExpanded(!expanded);

  return {
    likeScale,
    commentScale,
    showMenu,
    editModalVisible,
    likesModalVisible,
    expanded,
    setEditModalVisible,
    setLikesModalVisible,
    handleLikePress,
    handleLikeCountPress,
    handleCommentPress,
    handleEdit,
    handleDelete,
    toggleMenu,
    toggleExpanded,
  };
}
