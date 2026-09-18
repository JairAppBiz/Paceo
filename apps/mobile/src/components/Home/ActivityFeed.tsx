// @ts-nocheck
import { View, Text } from "react-native";
import { FeedPost } from "./FeedPost";

export function ActivityFeed({
  posts,
  onLike,
  onOpenComments,
  currentUserId,
  onUpdate,
  onDelete,
}) {
  return (
    <View>
      {/* Activity Feed Header - with padding */}
      <View style={{ marginBottom: 20, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 28, color: "#fff", fontWeight: "700" }}>
          Activity Feed
        </Text>
      </View>

      {/* Activity Feed Posts - no horizontal padding */}
      {posts.length === 0 ? (
        <View
          style={{
            paddingVertical: 40,
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ color: "#666", fontSize: 16 }}>No activity yet</Text>
          <Text style={{ color: "#444", fontSize: 14, marginTop: 8 }}>
            Start running to see posts here!
          </Text>
        </View>
      ) : (
        posts.map((post) => (
          <FeedPost
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onLike={onLike}
            onOpenComments={onOpenComments}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))
      )}
    </View>
  );
}
