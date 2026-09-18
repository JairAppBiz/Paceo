// @ts-nocheck
import { useState, useCallback } from "react";

export function useMedalReward(currentUserId) {
  const [showMedalReward, setShowMedalReward] = useState(false);
  const [newMedal, setNewMedal] = useState(null);

  const handleShareMedal = useCallback(
    async (medal, onRefresh) => {
      try {
        const response = await fetch("/api/posts/create-medal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId,
            medalId: medal.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to share medal");
        }

        // Mark medal as displayed
        await fetch("/api/medals/mark-displayed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ medalId: medal.id }),
        });

        // Close the modal and refresh the feed
        setShowMedalReward(false);
        onRefresh();

        alert("Medal shared to your feed! 🎉");
      } catch (error) {
        console.error("Error sharing medal:", error);
        alert("Failed to share medal. Please try again.");
      }
    },
    [currentUserId],
  );

  const handleCloseMedalModal = useCallback(async () => {
    if (newMedal) {
      // Mark medal as displayed when closing
      try {
        await fetch("/api/medals/mark-displayed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ medalId: newMedal.id }),
        });
      } catch (error) {
        console.error("Error marking medal as displayed:", error);
      }
    }
    setShowMedalReward(false);
  }, [newMedal]);

  return {
    showMedalReward,
    setShowMedalReward,
    newMedal,
    setNewMedal,
    handleShareMedal,
    handleCloseMedalModal,
  };
}
