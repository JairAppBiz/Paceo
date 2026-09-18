// @ts-nocheck
import { View } from "react-native";
import { EditPostModal } from "./EditPostModal";
import { LikesModal } from "./LikesModal";
import { PostHeader } from "./FeedPost/PostHeader";
import { PostMenu } from "./FeedPost/PostMenu";
import { RunPost } from "./FeedPost/RunPost";
import { AchievementPost } from "./FeedPost/AchievementPost";
import { MedalPost } from "./FeedPost/MedalPost";
import { TierPromotionPost } from "./FeedPost/TierPromotionPost";
import { PostActions } from "./FeedPost/PostActions";
import { useFeedPostActions } from "@/hooks/useFeedPostActions";
import { useShimmerAnimation } from "@/hooks/useShimmerAnimation";

export function FeedPost({
  post,
  onLike,
  onOpenComments,
  currentUserId,
  onUpdate,
  onDelete,
}) {
  const isOwnPost = post.user_id === currentUserId;
  const shouldShimmer =
    post.post_type === "achievement" ||
    post.post_type === "medal" ||
    post.post_type === "tier_promotion";

  const shimmerAnim = useShimmerAnimation(shouldShimmer);

  const {
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
  } = useFeedPostActions({ post, onLike, onDelete });

  return (
    <View
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 0,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 4,
      }}
    >
      <PostHeader
        post={post}
        isOwnPost={isOwnPost}
        showMenu={showMenu}
        onMenuToggle={toggleMenu}
      />

      <PostMenu
        visible={showMenu && isOwnPost}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {post.post_type === "run" && (
        <RunPost
          post={post}
          expanded={expanded}
          onToggleExpanded={toggleExpanded}
        />
      )}

      {post.post_type === "achievement" && (
        <AchievementPost post={post} shimmerAnim={shimmerAnim} />
      )}

      {post.post_type === "medal" && (
        <MedalPost post={post} shimmerAnim={shimmerAnim} />
      )}

      {post.post_type === "tier_promotion" && (
        <TierPromotionPost post={post} shimmerAnim={shimmerAnim} />
      )}

      <PostActions
        post={post}
        likeScale={likeScale}
        commentScale={commentScale}
        onLikePress={handleLikePress}
        onLikeCountPress={handleLikeCountPress}
        onCommentPress={() => handleCommentPress(onOpenComments)}
      />

      <EditPostModal
        visible={editModalVisible}
        post={post}
        currentUserId={currentUserId}
        onClose={() => setEditModalVisible(false)}
        onUpdate={onUpdate}
      />

      <LikesModal
        visible={likesModalVisible}
        postId={post.id}
        onClose={() => setLikesModalVisible(false)}
      />
    </View>
  );
}
