// @ts-nocheck
import { useState, useCallback } from "react";
import * as Haptics from "expo-haptics";

export function usePostInteractions(currentUserId, onNotificationUpdate) {
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [postComments, setPostComments] = useState({});
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleLike = useCallback(
    async (postId, currentLiked, setPosts) => {
      // Haptic feedback for like action
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Optimistic update - update UI immediately
      const optimisticLiked = !currentLiked;
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              user_liked: optimisticLiked,
              like_count: optimisticLiked
                ? post.like_count + 1
                : Math.max(0, post.like_count - 1),
            };
          }
          return post;
        }),
      );

      // Send request to server in background
      try {
        const res = await fetch("/api/posts/like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId, userId: currentUserId }),
        });

        if (res.ok) {
          const data = await res.json();
          // Update with actual server data to ensure consistency
          setPosts((prev) =>
            prev.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  user_liked: data.liked,
                  like_count: data.likesCount,
                };
              }
              return post;
            }),
          );

          // Trigger notification update if callback provided
          if (onNotificationUpdate) {
            onNotificationUpdate();
          }
        } else {
          // Revert optimistic update if request failed
          setPosts((prev) =>
            prev.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  user_liked: currentLiked,
                  like_count: currentLiked
                    ? post.like_count + 1
                    : Math.max(0, post.like_count - 1),
                };
              }
              return post;
            }),
          );
        }
      } catch (error) {
        console.error("Error liking post:", error);
        // Revert optimistic update on error
        setPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                user_liked: currentLiked,
                like_count: currentLiked
                  ? post.like_count + 1
                  : Math.max(0, post.like_count - 1),
              };
            }
            return post;
          }),
        );
      }
    },
    [currentUserId, onNotificationUpdate],
  );

  const openComments = useCallback(async (post) => {
    setSelectedPost(post);
    setCommentModalVisible(true);

    // Fetch comments for this post
    try {
      const res = await fetch(`/api/comments/list?postId=${post.id}`);
      if (res.ok) {
        const data = await res.json();
        setPostComments((prev) => ({ ...prev, [post.id]: data.comments }));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, []);

  const submitComment = useCallback(
    async (setPosts) => {
      if (!commentText.trim() || !selectedPost) return;

      // Haptic feedback for submit
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const tempComment = {
        id: Date.now(), // Temporary ID
        user_id: currentUserId,
        comment_text: commentText.trim(),
        created_at: new Date().toISOString(),
        username: "You", // Placeholder, will be replaced by server response
      };

      // Optimistic update - add comment immediately
      setPostComments((prev) => ({
        ...prev,
        [selectedPost.id]: [...(prev[selectedPost.id] || []), tempComment],
      }));

      // Update comment count optimistically
      setPosts((prev) =>
        prev.map((p) =>
          p.id === selectedPost.id
            ? { ...p, comment_count: p.comment_count + 1 }
            : p,
        ),
      );

      const textToSubmit = commentText.trim();
      setCommentText(""); // Clear input immediately

      setSubmittingComment(true);
      try {
        const res = await fetch("/api/comments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId: selectedPost.id,
            userId: currentUserId,
            commentText: textToSubmit,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          // Replace temporary comment with actual server data
          setPostComments((prev) => ({
            ...prev,
            [selectedPost.id]: [
              ...(prev[selectedPost.id] || []).filter(
                (c) => c.id !== tempComment.id,
              ),
              data.comment,
            ],
          }));

          // Trigger notification update if callback provided
          if (onNotificationUpdate) {
            onNotificationUpdate();
          }
        } else {
          // Revert optimistic updates if request failed
          setPostComments((prev) => ({
            ...prev,
            [selectedPost.id]: (prev[selectedPost.id] || []).filter(
              (c) => c.id !== tempComment.id,
            ),
          }));
          setPosts((prev) =>
            prev.map((p) =>
              p.id === selectedPost.id
                ? { ...p, comment_count: Math.max(0, p.comment_count - 1) }
                : p,
            ),
          );
          setCommentText(textToSubmit); // Restore the comment text
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
        // Revert optimistic updates on error
        setPostComments((prev) => ({
          ...prev,
          [selectedPost.id]: (prev[selectedPost.id] || []).filter(
            (c) => c.id !== tempComment.id,
          ),
        }));
        setPosts((prev) =>
          prev.map((p) =>
            p.id === selectedPost.id
              ? { ...p, comment_count: Math.max(0, p.comment_count - 1) }
              : p,
          ),
        );
        setCommentText(textToSubmit); // Restore the comment text
      } finally {
        setSubmittingComment(false);
      }
    },
    [commentText, selectedPost, currentUserId, onNotificationUpdate],
  );

  return {
    commentModalVisible,
    setCommentModalVisible,
    selectedPost,
    commentText,
    setCommentText,
    postComments,
    submittingComment,
    handleLike,
    openComments,
    submitComment,
  };
}
