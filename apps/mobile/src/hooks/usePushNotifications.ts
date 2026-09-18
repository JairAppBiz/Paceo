// @ts-nocheck
import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  // Skip push notifications on web
  if (Platform.OS === "web") {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#60a5fa",
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export function usePushNotifications(userId) {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    if (!userId) return;

    registerForPushNotificationsAsync().then(async (token) => {
      if (!token) return;

      try {
        await fetch("/api/notifications/register-push-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, token }),
        });
      } catch (error) {
        console.error("Failed to register push token:", error);
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {});

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [userId]);
}
