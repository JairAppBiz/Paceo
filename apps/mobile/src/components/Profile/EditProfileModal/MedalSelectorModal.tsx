// @ts-nocheck
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { HexagonBadge } from "@/components/Trophies/HexagonBadge";

export function MedalSelectorModal({
  visible,
  allMedals,
  selectedMedals,
  onToggleMedal,
  onClose,
}) {
  const insets = useSafeAreaInsets();

  // Separate regular medals and tier promotions
  const regularMedals = allMedals.filter((m) => !m.is_promotion_badge);
  const tierPromotions = allMedals.filter((m) => m.is_promotion_badge);

  // Organize regular medals by tier - only gold, silver, bronze
  const goldMedals = regularMedals.filter((m) => m.rank_achieved === 1);
  const silverMedals = regularMedals.filter((m) => m.rank_achieved === 2);
  const bronzeMedals = regularMedals.filter((m) => m.rank_achieved === 3);

  // Organize tier promotions by tier level
  const legendBadges = tierPromotions.filter((m) => m.tier === "legend");
  const apexBadges = tierPromotions.filter((m) => m.tier === "apex");
  const rangerBadges = tierPromotions.filter((m) => m.tier === "ranger");
  const scoutBadges = tierPromotions.filter((m) => m.tier === "scout");

  const renderMedalTier = (title, medals, tierColor) => {
    if (medals.length === 0) return null;

    return (
      <View style={{ marginBottom: 20 }}>
        {/* Tier Title */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#fff",
            marginBottom: 12,
          }}
        >
          {title}
        </Text>

        {/* Bordered Container - matching trophies page exactly */}
        <View
          style={{
            borderWidth: 2,
            borderColor: tierColor,
            borderRadius: 16,
            padding: 12,
            backgroundColor: "#1a1a1a",
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 12,
              paddingRight: 4,
            }}
          >
            {medals.map((medal) => {
              const selectedIndex = selectedMedals.findIndex(
                (m) => m.id === medal.id,
              );
              const isSelected = selectedIndex !== -1;
              const displayNumber = isSelected ? selectedIndex + 1 : null;

              return (
                <TouchableOpacity
                  key={medal.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onToggleMedal(medal);
                  }}
                  style={{
                    alignItems: "center",
                  }}
                  activeOpacity={0.7}
                >
                  <View style={{ position: "relative" }}>
                    <HexagonBadge
                      category={medal.category}
                      rank={medal.rank_achieved}
                      tier={medal.is_promotion_badge ? medal.tier : undefined}
                      color={tierColor}
                      size={75}
                    />
                    {isSelected && (
                      <View
                        style={{
                          position: "absolute",
                          top: -2,
                          right: -2,
                          backgroundColor: "#60a5fa",
                          borderRadius: 10,
                          width: 20,
                          height: 20,
                          justifyContent: "center",
                          alignItems: "center",
                          borderWidth: 2,
                          borderColor: "#000",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "700",
                            color: "#000",
                          }}
                        >
                          {displayNumber}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  };

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
            maxHeight: "80%",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginBottom: 8,
            }}
          >
            <View>
              <Text style={{ fontSize: 20, color: "#fff", fontWeight: "700" }}>
                Display Badges
              </Text>
              <Text style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
                {selectedMedals.length}/3 selected
              </Text>
            </View>
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
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12 }}
            showsVerticalScrollIndicator={false}
          >
            {allMedals.length === 0 ? (
              <View style={{ padding: 40, alignItems: "center" }}>
                <Text
                  style={{ fontSize: 15, color: "#666", textAlign: "center" }}
                >
                  No medals earned yet.{"\n"}Start running to earn your first
                  medal!
                </Text>
              </View>
            ) : (
              <>
                {/* Regular Medals */}
                {renderMedalTier("Gold Medals", goldMedals, "#fbbf24")}
                {renderMedalTier("Silver Medals", silverMedals, "#c0c0c0")}
                {renderMedalTier("Bronze Medals", bronzeMedals, "#cd7f32")}

                {/* Tier Promotion Badges */}
                {renderMedalTier("Legend Badges", legendBadges, "#f59e0b")}
                {renderMedalTier("Apex Badges", apexBadges, "#ef4444")}
                {renderMedalTier("Ranger Badges", rangerBadges, "#3b82f6")}
                {renderMedalTier("Scout Badges", scoutBadges, "#10b981")}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
