// @ts-nocheck
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import CategoryIcon from "@/components/CategoryIcon";
import { MOODS } from "@/constants/moods";

export function MoodSelectorModal({ visible, currentMood, onSelect, onClose }) {
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
              Select Mood
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
              {MOODS.map((mood, index) => {
                const isSelected = currentMood === mood.id;
                return (
                  <TouchableOpacity
                    key={mood.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      onSelect(mood.id);
                      // Close modal after selection
                      setTimeout(onClose, 150);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 16,
                      borderRadius: 12,
                      backgroundColor: isSelected ? "#0a0a0a" : "transparent",
                      marginBottom: index < MOODS.length - 1 ? 4 : 0,
                    }}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={mood.gradient}
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
                        category={mood.iconCategory}
                        size={36}
                        iconSize={18}
                        customGradient={[
                          "rgba(255,255,255,0.3)",
                          "rgba(255,255,255,0.1)",
                        ]}
                      />
                    </LinearGradient>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: isSelected ? "600" : "400",
                        color: "#fff",
                        flex: 1,
                      }}
                    >
                      {mood.label}
                    </Text>
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
