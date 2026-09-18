// @ts-nocheck
import * as React from "react";
import * as ImagePicker from "expo-image-picker";
import { UploadClient } from "@uploadcare/upload-client";
const client = new UploadClient({
  publicKey: process.env.EXPO_PUBLIC_UPLOADCARE_PUBLIC_KEY,
});

function useUpload() {
  const [loading, setLoading] = React.useState(false);
  const upload = React.useCallback(async (input) => {
    try {
      setLoading(true);
      let response;

      if ("reactNativeAsset" in input && input.reactNativeAsset) {
        let asset = input.reactNativeAsset;

        if (asset.file) {
          const formData = new FormData();
          formData.append("file", asset.file);

          response = await fetch("/_create/api/upload/", {
            method: "POST",
            body: formData,
          });
        } else {
          // Fallback to presigned Uploadcare upload
          const presignRes = await fetch("/_create/api/upload/presign/", {
            method: "POST",
          });
          const { secureSignature, secureExpire } = await presignRes.json();

          const result = await client.uploadFile(asset, {
            fileName: asset.name ?? asset.uri.split("/").pop(),
            contentType: asset.mimeType,
            secureSignature,
            secureExpire,
          });
          return {
            url: `${process.env.EXPO_PUBLIC_BASE_CREATE_USER_CONTENT_URL}/${result.uuid}/`,
            mimeType: result.mimeType || null,
          };
        }
      } else if ("url" in input) {
        response = await fetch("/_create/api/upload/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: input.url }),
        });
      } else if ("base64" in input) {
        response = await fetch("/_create/api/upload/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ base64: input.base64 }),
        });
      } else {
        response = await fetch("/_create/api/upload/", {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
          },
          body: input.buffer,
        });
      }
      if (!response.ok) {
        if (response.status === 413) {
          throw new Error("Upload failed: File too large.");
        }
        throw new Error("Upload failed");
      }
      const data = await response.json();
      return { url: data.url, mimeType: data.mimeType || null };
    } catch (uploadError) {
      if (uploadError instanceof Error) {
        return { error: uploadError.message };
      }
      if (typeof uploadError === "string") {
        return { error: uploadError };
      }
      return { error: "Upload failed" };
    } finally {
      setLoading(false);
    }
  }, []);

  const pickImage = React.useCallback(async () => {
    try {
      // Request permission to access media library
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        alert("Permission to access camera roll is required!");
        return null;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return null;
      }

      // Upload the selected image
      const uploadResult = await upload({
        reactNativeAsset: {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName || "profile-image.jpg",
          mimeType: result.assets[0].mimeType || "image/jpeg",
        },
      });

      if (uploadResult.error) {
        alert("Failed to upload image: " + uploadResult.error);
        return null;
      }

      return uploadResult.url;
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Failed to pick image");
      return null;
    }
  }, [upload]);

  return {
    upload,
    pickImage,
    uploadFile: pickImage,
    loading,
    uploading: loading,
  };
}

export { useUpload };
export default useUpload;
