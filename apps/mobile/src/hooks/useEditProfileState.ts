// @ts-nocheck
import { useState, useEffect } from "react";
import { Keyboard } from "react-native";
import * as Haptics from "expo-haptics";

export function useEditProfileState({
  user,
  currentMood,
  displayedMedals,
  trackedCategory,
  onUsernameChange,
  onMoodChange,
  onDisplayedMedalsChange,
  onTrackedCategoryChange,
  onClose,
}) {
  const [username, setUsername] = useState(user?.username || "");
  const [selectedMood, setSelectedMood] = useState(currentMood);
  const [selectedDisplayedMedals, setSelectedDisplayedMedals] = useState(
    displayedMedals || [],
  );
  const [selectedTrackedCategory, setSelectedTrackedCategory] = useState(
    trackedCategory || "miles",
  );
  const [isSaving, setIsSaving] = useState(false);

  // Sync props with local state when they change
  useEffect(() => {
    setUsername(user?.username || "");
    setSelectedMood(currentMood);
    setSelectedDisplayedMedals(displayedMedals || []);
    setSelectedTrackedCategory(trackedCategory || "miles");
  }, [user?.username, currentMood, displayedMedals, trackedCategory]);

  const handleToggleMedal = (medal) => {
    setSelectedDisplayedMedals((prev) => {
      const isSelected = prev.some((m) => m.id === medal.id);
      if (isSelected) {
        // Remove medal
        return prev.filter((m) => m.id !== medal.id);
      } else {
        // Add medal if less than 3 selected
        if (prev.length < 3) {
          return [...prev, medal];
        } else {
          // Replace the first medal
          return [...prev.slice(1), medal];
        }
      }
    });
  };

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSaving(true);
    Keyboard.dismiss();

    try {
      // Save username if changed
      if (username !== user?.username) {
        await onUsernameChange?.(username);
      }

      // Save mood if changed
      if (selectedMood !== currentMood) {
        await onMoodChange?.(selectedMood);
      }

      // Save displayed medals if changed
      const medalsChanged =
        JSON.stringify(selectedDisplayedMedals.map((m) => m.id)) !==
        JSON.stringify(displayedMedals.map((m) => m.id));
      if (medalsChanged) {
        await onDisplayedMedalsChange?.(selectedDisplayedMedals);
      }

      // Save tracked category if changed
      if (selectedTrackedCategory !== trackedCategory) {
        await onTrackedCategoryChange?.(selectedTrackedCategory);
      }

      // Close modal after successful save
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 300);
    } catch (error) {
      console.error("Error saving profile:", error);
      setIsSaving(false);
    }
  };

  const hasChanges =
    username !== user?.username ||
    selectedMood !== currentMood ||
    selectedTrackedCategory !== trackedCategory ||
    JSON.stringify(selectedDisplayedMedals.map((m) => m.id)) !==
      JSON.stringify(displayedMedals.map((m) => m.id));

  return {
    username,
    setUsername,
    selectedMood,
    setSelectedMood,
    selectedDisplayedMedals,
    selectedTrackedCategory,
    setSelectedTrackedCategory,
    handleToggleMedal,
    isSaving,
    hasChanges,
    handleSave,
  };
}
