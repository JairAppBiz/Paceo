// @ts-nocheck
import { View, Text, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useEffect } from "react";

export function ProfilePicture({ user, uploadingImage }) {
  // Debug logging
  useEffect(() => {
    console.log("=== PROFILE PICTURE DEBUG ===");
    console.log("user:", user);
    console.log("user.profile_image:", user?.profile_image);
    console.log("user.username:", user?.username);
    console.log("============================");
  }, [user]);

  return (
    <View style={{ alignItems: "center", paddingTop: 20, paddingBottom: 24 }}>
      <View style={{ position: "relative" }}>
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: user?.profile_image ? "#1a1a1a" : "#60a5fa",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 4,
            borderColor: "#1a1a1a",
          }}
        >
          {user?.profile_image ? (
            <Image
              source={{ uri: user.profile_image }}
              style={{ width: 112, height: 112, borderRadius: 56 }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <Text style={{ fontSize: 48, color: "#000", fontWeight: "700" }}>
              {user?.username?.[0]?.toUpperCase() || "?"}
            </Text>
          )}

          {uploadingImage && (
            <View
              style={{
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "rgba(0,0,0,0.7)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator color="#60a5fa" />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
