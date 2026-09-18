// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { X, ChevronDown, ChevronUp } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CategoryIcon from "@/components/CategoryIcon";
import * as Haptics from "expo-haptics";

const CATEGORIES = [
  { id: "miles", name: "Miles", description: "Track total miles" },
  { id: "runs", name: "Runs", description: "Track number of runs" },
  { id: "elevation", name: "Elevation", description: "Track elevation gain" },
  { id: "speed", name: "Pace", description: "Track average pace" },
  { id: "time", name: "Time", description: "Track total time ran" },
  { id: "calories", name: "Calories", description: "Track calories burned" },
  { id: "steps", name: "Steps", description: "Track total steps" },
];

const PERIODS = [
  { id: "week", name: "Week" },
  { id: "month", name: "Month" },
  { id: "year", name: "Year" },
];

export default function GoalEditorModal({
  visible,
  onClose,
  currentGoal,
  onSave,
}) {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState(
    currentGoal?.category || "miles",
  );
  const [selectedPeriod, setSelectedPeriod] = useState(
    currentGoal?.period || "week",
  );
  const [targetValue, setTargetValue] = useState(
    currentGoal?.target?.toString() || "",
  );
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  const handleSave = () => {
    const target = parseFloat(targetValue);
    if (isNaN(target) || target <= 0) {
      alert("Please enter a valid target value");
      return;
    }

    onSave({
      category: selectedCategory,
      period: selectedPeriod,
      target: target,
    });
    onClose();
  };

  const getUnitLabel = (category) => {
    const units = {
      miles: "miles",
      runs: "runs",
      elevation: "feet",
      speed: "min/mile",
      time: "minutes",
      calories: "calories",
      steps: "steps",
    };
    return units[category] || "";
  };

  const selectedCategoryData = CATEGORIES.find(
    (c) => c.id === selectedCategory,
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={{ flex: 1, backgroundColor: "#000", paddingTop: insets.top }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#1a1a1a",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#fff" }}>
            Set Goal
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#999" />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Category Selection - Expandable */}
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#fff",
                marginBottom: 12,
              }}
            >
              Category
            </Text>

            {/* Selected Category Display */}
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCategoriesExpanded(!categoriesExpanded);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#1a1a1a",
                padding: 16,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: "#60a5fa",
              }}
            >
              <CategoryIcon
                category={selectedCategoryData?.id}
                size={24}
                color="#60a5fa"
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}
                >
                  {selectedCategoryData?.name}
                </Text>
                <Text style={{ fontSize: 13, color: "#999", marginTop: 2 }}>
                  {selectedCategoryData?.description}
                </Text>
              </View>
              {categoriesExpanded ? (
                <ChevronUp size={20} color="#60a5fa" />
              ) : (
                <ChevronDown size={20} color="#60a5fa" />
              )}
            </TouchableOpacity>

            {/* Expanded Categories List */}
            {categoriesExpanded && (
              <View style={{ gap: 8, marginTop: 8 }}>
                {CATEGORIES.filter((c) => c.id !== selectedCategory).map(
                  (category) => (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedCategory(category.id);
                        setCategoriesExpanded(false);
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#0a0a0a",
                        padding: 16,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#1a1a1a",
                      }}
                    >
                      <CategoryIcon
                        category={category.id}
                        size={24}
                        color="#60a5fa"
                      />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: "#fff",
                          }}
                        >
                          {category.name}
                        </Text>
                        <Text
                          style={{ fontSize: 13, color: "#999", marginTop: 2 }}
                        >
                          {category.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            )}
          </View>

          {/* Period Selection */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#fff",
                marginBottom: 12,
              }}
            >
              Time Period
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {PERIODS.map((period) => (
                <TouchableOpacity
                  key={period.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedPeriod(period.id);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor:
                      selectedPeriod === period.id ? "#60a5fa" : "#1a1a1a",
                    padding: 14,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: selectedPeriod === period.id ? "#000" : "#fff",
                    }}
                  >
                    {period.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Target Value Input */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#fff",
                marginBottom: 12,
              }}
            >
              Target
            </Text>
            <View
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: 12,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextInput
                value={targetValue}
                onChangeText={setTargetValue}
                placeholder="Enter target"
                placeholderTextColor="#666"
                keyboardType="decimal-pad"
                returnKeyType="done"
                blurOnSubmit={true}
                style={{
                  flex: 1,
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#fff",
                }}
              />
              <Text style={{ fontSize: 16, color: "#999", marginLeft: 8 }}>
                {getUnitLabel(selectedCategory)}
              </Text>
            </View>
          </View>

          {/* Preview */}
          <View
            style={{
              marginHorizontal: 20,
              marginBottom: 20,
              padding: 16,
              backgroundColor: "#0a0a0a",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#1a1a1a",
            }}
          >
            <Text style={{ fontSize: 14, color: "#999", marginBottom: 8 }}>
              Goal Preview
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}>
              {targetValue || "0"} {getUnitLabel(selectedCategory)} per{" "}
              {selectedPeriod}
            </Text>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View
          style={{
            padding: 20,
            paddingBottom: insets.bottom + 20,
            borderTopWidth: 1,
            borderTopColor: "#1a1a1a",
          }}
        >
          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: "#60a5fa",
              padding: 16,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#000" }}>
              Save Goal
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
