// @ts-nocheck
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import CategoryIcon from "@/components/CategoryIcon";

// This would need to be imported from a constants file if CATEGORIES is defined elsewhere
// For now, defining tier categories inline
const TIER_CATEGORIES = [
  {
    id: "miles",
    iconCategory: "miles",
    label: "Miles",
    description: "Track total distance",
    gradient: ["#3b82f6", "#2563eb"],
  },
  {
    id: "runs",
    iconCategory: "runs",
    label: "Runs",
    description: "Track number of runs",
    gradient: ["#10b981", "#059669"],
  },
  {
    id: "elevation",
    iconCategory: "elevation",
    label: "Elevation",
    description: "Track elevation gain",
    gradient: ["#f59e0b", "#d97706"],
  },
  {
    id: "speed",
    iconCategory: "speed",
    label: "Pace",
    description: "Track average pace",
    gradient: ["#ef4444", "#dc2626"],
  },
  {
    id: "time",
    iconCategory: "time",
    label: "Time",
    description: "Track total time ran",
    gradient: ["#8b5cf6", "#7c3aed"],
  },
  {
    id: "calories",
    iconCategory: "calories",
    label: "Calories",
    description: "Track calories burned",
    gradient: ["#ec4899", "#db2777"],
  },
  {
    id: "steps",
    iconCategory: "steps",
    label: "Steps",
    description: "Track total steps",
    gradient: ["#06b6d4", "#0891b2"],
  },
];

export function CategorySelectorModal({
  visible,
  currentCategory,
  onSelect,
  onClose,
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "#000",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 20,
            paddingBottom: insets.bottom + 20,
            maxHeight: "70%",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 20, color: "#fff", fontWeight: "700" }}>
              Track Category
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
            contentContainerStyle={{ paddingHorizontal: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: 16,
                padding: 4,
              }}
            >
              {TIER_CATEGORIES.map((category, index) => {
                const isSelected = currentCategory === category.id;
                return (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      onSelect(category.id);
                      setTimeout(onClose, 150);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 16,
                      borderRadius: 12,
                      backgroundColor: isSelected ? "#0a0a0a" : "transparent",
                      marginBottom: index < TIER_CATEGORIES.length - 1 ? 4 : 0,
                    }}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={category.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 14,
                      }}
                    >
                      <CategoryIcon
                        category={category.iconCategory}
                        size={36}
                        iconSize={18}
                        customGradient={[
                          "rgba(255,255,255,0.3)",
                          "rgba(255,255,255,0.1)",
                        ]}
                      />
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: isSelected ? "600" : "400",
                          color: "#fff",
                        }}
                      >
                        {category.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#888",
                          marginTop: 2,
                        }}
                      >
                        {category.description}
                      </Text>
                    </View>
                    {isSelected && (
                      <View
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 11,
                          backgroundColor: "#60a5fa",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: "#000",
                          }}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
