// @ts-nocheck
import { useState, useEffect, useCallback } from "react";

export function useNotifications(currentUserId) {
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const checkForNotifications = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/notifications/list?userId=${currentUserId}&limit=50`,
      );
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
        setHasNewNotifications(data.unreadCount > 0);
      }
    } catch (error) {
      console.error("Error checking for notifications:", error);
    }
  }, [currentUserId]);

  const markAsRead = useCallback(
    async (notificationId = null) => {
      try {
        await fetch("/api/notifications/mark-read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId,
            notificationId,
          }),
        });

        // Refresh notifications
        await checkForNotifications();
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [currentUserId, checkForNotifications],
  );

  useEffect(() => {
    checkForNotifications();
  }, [checkForNotifications]);

  return {
    hasNewNotifications,
    setHasNewNotifications,
    notifications,
    unreadCount,
    checkForNotifications,
    markAsRead,
  };
}
