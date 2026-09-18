// @ts-nocheck
import {
  Modal,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import { TIER_STRUCTURE } from "@/constants/tierStructure";
import { CurrentTierCard } from "./TierExplainerModal/CurrentTierCard";
import { TierRulesCard } from "./TierExplainerModal/TierRulesCard";
import { TierProgressionPage } from "./TierExplainerModal/TierProgressionPage";
import { X } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function TierExplainerModal({
  visible,
  onClose,
  currentTier = "scout",
  currentLocation = "city",
  // Filter props
  selectedPeriod,
  onPeriodChange,
}) {
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef(null);

  const getCurrentTierData = () => {
    const locationTiers =
      TIER_STRUCTURE[currentLocation.toLowerCase()] || TIER_STRUCTURE.city;
    const tierData = locationTiers.find(
      (t) => t.tier.toLowerCase() === currentTier.toLowerCase(),
    );
    return tierData || locationTiers[0];
  };

  const currentTierData = getCurrentTierData();
  const locationLabel =
    currentLocation.charAt(0).toUpperCase() + currentLocation.slice(1);

  const handleScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const pageWidth = event.nativeEvent.layoutMeasurement.width;
    const page = Math.round(scrollX / pageWidth);
    setCurrentPage(page);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.95)",
        }}
      >
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: "absolute",
            top: insets.top + 16,
            right: 20,
            zIndex: 10,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(255,255,255,0.1)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={20} color="#fff" />
        </TouchableOpacity>

        {/* Page Indicators */}
        <View
          style={{
            position: "absolute",
            top: insets.top + 16,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
            zIndex: 10,
          }}
        >
          {[0, 1].map((index) => (
            <View
              key={index}
              style={{
                width: currentPage === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  currentPage === index ? "#fff" : "rgba(255, 255, 255, 0.3)",
              }}
            />
          ))}
        </View>

        {/* Swipeable Pages */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Page 1: Current Tier & Rules */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width: SCREEN_WIDTH }}
            contentContainerStyle={{
              paddingTop: insets.top + 60,
              paddingHorizontal: 20,
              paddingBottom: insets.bottom + 40,
            }}
          >
            <CurrentTierCard
              tierData={currentTierData}
              locationLabel={locationLabel}
            />
            <TierRulesCard />

            {/* Filters Section */}
            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 12,
                  textAlign: "center",
                }}
              >
                Filters
              </Text>

              {/* Period Filter Only */}
              {onPeriodChange && (
                <>
                  <Text
                    style={{ fontSize: 14, color: "#888", marginBottom: 8 }}
                  >
                    Period
                  </Text>
                  <View
                    style={{ flexDirection: "row", gap: 6, marginBottom: 16 }}
                  >
                    <TouchableOpacity
                      onPress={() => onPeriodChange("week")}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 10,
                        backgroundColor:
                          selectedPeriod === "week" ? "#fff" : "#1a1a1a",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: selectedPeriod === "week" ? "#000" : "#888",
                          fontWeight: selectedPeriod === "week" ? "700" : "500",
                          fontSize: 13,
                        }}
                      >
                        Week
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onPeriodChange("month")}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 10,
                        backgroundColor:
                          selectedPeriod === "month" ? "#fff" : "#1a1a1a",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: selectedPeriod === "month" ? "#000" : "#888",
                          fontWeight:
                            selectedPeriod === "month" ? "700" : "500",
                          fontSize: 13,
                        }}
                      >
                        Month
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          {/* Page 2: Tier Progression */}
          <TierProgressionPage
            currentTier={currentTier}
            currentLocation={currentLocation}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}
