// @ts-nocheck
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Camera } from "lucide-react-native";

export function ProfilePictureSection({
  user,
  uploadingImage,
  onChangePicture,
}) {
  return (
    <View
      style={{
        paddingTop: 32,
        paddingBottom: 24,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <TouchableOpacity
        onPress={onChangePicture}
        disabled={uploadingImage}
        activeOpacity={0.7}
      >
        <View style={{ position: "relative", alignItems: "center" }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: user?.profile_image ? "#0a0a0a" : "#60a5fa",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {user?.profile_image ? (
              <Image
                source={{ uri: user.profile_image }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <Text style={{ fontSize: 40, color: "#000", fontWeight: "700" }}>
                {user?.username?.[0]?.toUpperCase() || "?"}
              </Text>
            )}

            {uploadingImage && (
              <View
                style={{
                  position: "absolute",
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator color="#60a5fa" size="small" />
              </View>
            )}
          </View>

          {/* Camera badge */}
          <View
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#60a5fa",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 3,
              borderColor: "#000",
            }}
          >
            <Camera size={16} color="#000" />
          </View>
        </View>

        {/* Edit profile picture text */}
        <Text
          style={{
            fontSize: 14,
            color: "#60a5fa",
            fontWeight: "600",
            marginTop: 12,
            textAlign: "center",
          }}
        >
          Edit profile picture
        </Text>
      </TouchableOpacity>
    </View>
  );
}
