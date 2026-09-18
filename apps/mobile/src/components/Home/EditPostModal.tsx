// @ts-nocheck
import { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  X,
  Image as ImageIcon,
  ChevronRight,
  Check,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import useUpload from "@/utils/useUpload";
import PrivacySettingsModal from "@/components/PrivacySettingsModal";

const STAT_OPTIONS = [
  { id: "distance", label: "Distance" },
  { id: "pace", label: "Pace" },
  { id: "time", label: "Time" },
  { id: "elevation", label: "Elevation" },
  { id: "calories", label: "Calories" },
  { id: "temperature", label: "Temperature" },
];

export function EditPostModal({
  visible,
  post,
  currentUserId,
  onClose,
  onUpdate,
}) {
  const insets = useSafeAreaInsets();
  const [caption, setCaption] = useState(post?.caption || "");
  const [imageUrl, setImageUrl] = useState(post?.image_url || null);
  const [hiddenStats, setHiddenStats] = useState(post?.hidden_stats || []);
  const [primaryStats, setPrimaryStats] = useState(
    post?.primary_stats || ["distance", "pace", "time"],
  );
  const [saving, setSaving] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const { uploadFile, uploading } = useUpload();

  if (!post) return null;

  const toggleStatVisibility = (statId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHiddenStats((prev) =>
      prev.includes(statId)
        ? prev.filter((s) => s !== statId)
        : [...prev, statId],
    );
  };

  const togglePrimaryStat = (statId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPrimaryStats((prev) => {
      if (prev.includes(statId)) {
        return prev.filter((s) => s !== statId);
      } else if (prev.length < 3) {
        return [...prev, statId];
      } else {
        return [...prev.slice(1), statId];
      }
    });
  };

  const handlePickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const url = await uploadFile();
      if (url) {
        setImageUrl(url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Upload Failed", "Could not upload image. Please try again.");
    }
  };

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaving(true);

    try {
      const response = await fetch("/api/posts/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
          caption: caption || null,
          imageUrl: imageUrl || null,
          hiddenStats,
          primaryStats, // Add primaryStats to update request
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating post:", error);
      Alert.alert("Update Failed", "Could not update post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getPrivacyStatusText = () => {
    if (hiddenStats.length === 0) return "All stats visible";
    if (hiddenStats.length === 6) return "All stats hidden";
    return `${hiddenStats.length} stat${hiddenStats.length > 1 ? "s" : ""} hidden`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 12,
            paddingHorizontal: 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#1a1a1a",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#1a1a1a",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <X size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={{ fontSize: 18, color: "#fff", fontWeight: "700" }}>
            Edit Post
          </Text>

          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: saving ? "#333" : "#60a5fa",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Check size={22} color="#000" strokeWidth={2.5} />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Caption */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              Caption
            </Text>
            <TextInput
              value={caption}
              onChangeText={setCaption}
              placeholder="Add a caption..."
              placeholderTextColor="#666"
              multiline
              returnKeyType="done"
              blurOnSubmit={true}
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: 12,
                padding: 14,
                color: "#fff",
                fontSize: 15,
                minHeight: 90,
                textAlignVertical: "top",
              }}
            />
          </View>

          {/* Run Photo */}
          {post.post_type === "run" && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "700",
                  marginBottom: 8,
                }}
              >
                Run Photo
              </Text>

              {imageUrl ? (
                <View>
                  <Image
                    source={{ uri: imageUrl }}
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: 12,
                      marginBottom: 8,
                    }}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => setImageUrl(null)}
                    style={{
                      backgroundColor: "#1a1a1a",
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#ef4444", fontWeight: "600" }}>
                      Remove Photo
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handlePickImage}
                  disabled={uploading}
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderRadius: 12,
                    padding: 20,
                    alignItems: "center",
                    borderWidth: 2,
                    borderColor: "#333",
                    borderStyle: "dashed",
                  }}
                >
                  {uploading ? (
                    <ActivityIndicator size="small" color="#60a5fa" />
                  ) : (
                    <>
                      <ImageIcon size={32} color="#666" />
                      <Text
                        style={{
                          color: "#888",
                          fontSize: 14,
                          marginTop: 8,
                        }}
                      >
                        Tap to add a photo
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Post Settings Button */}
          {post.post_type === "run" && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "700",
                  marginBottom: 8,
                }}
              >
                Post Settings
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowPrivacyModal(true);
                }}
                style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{ fontSize: 15, color: "#fff", fontWeight: "600" }}
                  >
                    Manage Stats & Privacy
                  </Text>
                  <Text style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
                    {primaryStats.length} stat
                    {primaryStats.length > 1 ? "s" : ""} to display •{" "}
                    {getPrivacyStatusText()}
                  </Text>
                </View>
                <ChevronRight size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Privacy Settings Modal */}
        <PrivacySettingsModal
          visible={showPrivacyModal}
          hiddenStats={hiddenStats}
          onToggleStat={toggleStatVisibility}
          primaryStats={primaryStats}
          onTogglePrimaryStat={togglePrimaryStat}
          onClose={() => setShowPrivacyModal(false)}
        />
      </View>
    </Modal>
  );
}
