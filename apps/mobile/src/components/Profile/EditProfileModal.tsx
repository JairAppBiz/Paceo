// @ts-nocheck
import { useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import {
  MoodSelectorModal,
  MedalSelectorModal,
  CategorySelectorModal,
  ProfilePictureSection,
  EditableFieldsSection,
  SaveButton,
} from "./EditProfileModal/index";
import GoalEditorModal from "./EditProfileModal/GoalEditorModal";
import { useEditProfileState } from "@/hooks/useEditProfileState";

export function EditProfileModal({
  visible,
  onClose,
  user,
  currentMood,
  currentGoal,
  currentRanking,
  bestRanking,
  uploadingImage,
  onChangePicture,
  onMoodChange,
  onGoalChange,
  onRankingChange,
  onUsernameChange,
  allMedals = [],
  displayedMedals = [],
  onDisplayedMedalsChange,
  trackedCategory,
  onTrackedCategoryChange,
}) {
  const insets = useSafeAreaInsets();
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showMedalModal, setShowMedalModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const {
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
  } = useEditProfileState({
    user,
    currentMood,
    displayedMedals,
    trackedCategory,
    onUsernameChange,
    onMoodChange,
    onDisplayedMedalsChange,
    onTrackedCategoryChange,
    onClose,
  });

  const handleGoalSave = async (goalData) => {
    if (onGoalChange) {
      await onGoalChange(goalData);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#1a1a1a",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#000",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#fff" }}>
            Edit Profile
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#1a1a1a",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <X size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Picture Section */}
          <ProfilePictureSection
            user={user}
            uploadingImage={uploadingImage}
            onChangePicture={onChangePicture}
          />

          {/* Editable Fields Section */}
          <EditableFieldsSection
            username={username}
            onUsernameChange={setUsername}
            selectedMood={selectedMood}
            onMoodPress={() => setShowMoodModal(true)}
            selectedDisplayedMedals={selectedDisplayedMedals}
            onMedalPress={() => setShowMedalModal(true)}
            selectedTrackedCategory={selectedTrackedCategory}
            onCategoryPress={() => setShowCategoryModal(true)}
            currentGoal={currentGoal}
            onGoalPress={() => setShowGoalModal(true)}
            currentRanking={currentRanking}
            bestRanking={bestRanking}
            onRankingPress={onRankingChange}
          />
        </ScrollView>

        {/* Save Button */}
        <SaveButton
          hasChanges={hasChanges}
          isSaving={isSaving}
          onSave={handleSave}
        />

        {/* Mood Selector Modal */}
        <MoodSelectorModal
          visible={showMoodModal}
          currentMood={selectedMood}
          onSelect={setSelectedMood}
          onClose={() => setShowMoodModal(false)}
        />

        {/* Medal Selector Modal */}
        <MedalSelectorModal
          visible={showMedalModal}
          allMedals={allMedals}
          selectedMedals={selectedDisplayedMedals}
          onToggleMedal={handleToggleMedal}
          onClose={() => setShowMedalModal(false)}
        />

        {/* Category Selector Modal */}
        <CategorySelectorModal
          visible={showCategoryModal}
          currentCategory={selectedTrackedCategory}
          onSelect={setSelectedTrackedCategory}
          onClose={() => setShowCategoryModal(false)}
        />

        {/* Goal Editor Modal */}
        <GoalEditorModal
          visible={showGoalModal}
          onClose={() => setShowGoalModal(false)}
          currentGoal={currentGoal}
          onSave={handleGoalSave}
        />
      </View>
    </Modal>
  );
}
