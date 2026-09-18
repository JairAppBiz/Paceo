// @ts-nocheck
import { Modal, Pressable, View, Text, TouchableOpacity } from "react-native";
import { X, Star } from "lucide-react-native";
import { SOCIAL_FILTERS, LOCATION_FILTERS } from "@/constants/leaderboard";

export function FilterModal({
  visible,
  onClose,
  currentCategory,
  selectedCategory,
  defaultCategory,
  onSaveDefaultCategory,
  selectedPeriod,
  onPeriodChange,
  socialFilter,
  onSocialFilterChange,
  locationFilter,
  onLocationFilterChange,
  insets,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: "#000",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 20,
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: 20,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Text style={{ fontSize: 28, color: "#fff", fontWeight: "700" }}>
              Leaderboard
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#1a1a1a",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Default Category Section */}
          <Text style={{ fontSize: 16, color: "#888", marginBottom: 12 }}>
            Default Category
          </Text>
          <TouchableOpacity
            onPress={() => onSaveDefaultCategory(selectedCategory)}
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 24, marginRight: 12 }}>
                {currentCategory.emoji}
              </Text>
              <View>
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: 16,
                  }}
                >
                  {defaultCategory === selectedCategory
                    ? currentCategory.label
                    : `Set "${currentCategory.label}" as default`}
                </Text>
                <Text style={{ color: "#666", fontSize: 13 }}>
                  {defaultCategory === selectedCategory
                    ? "Current default"
                    : "Tap to set as default"}
                </Text>
              </View>
            </View>
            <Star
              size={24}
              color={defaultCategory === selectedCategory ? "#fbbf24" : "#666"}
              fill={
                defaultCategory === selectedCategory ? "#fbbf24" : "transparent"
              }
            />
          </TouchableOpacity>

          {/* Period Filter */}
          <Text style={{ fontSize: 16, color: "#888", marginBottom: 12 }}>
            Period
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 24 }}>
            <TouchableOpacity
              onPress={() => onPeriodChange("week")}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: selectedPeriod === "week" ? "#fff" : "#1a1a1a",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: selectedPeriod === "week" ? "#000" : "#888",
                  fontWeight: selectedPeriod === "week" ? "700" : "500",
                  fontSize: 14,
                }}
              >
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPeriodChange("month")}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor:
                  selectedPeriod === "month" ? "#fff" : "#1a1a1a",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: selectedPeriod === "month" ? "#000" : "#888",
                  fontWeight: selectedPeriod === "month" ? "700" : "500",
                  fontSize: 14,
                }}
              >
                Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPeriodChange("year")}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: selectedPeriod === "year" ? "#fff" : "#1a1a1a",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: selectedPeriod === "year" ? "#000" : "#888",
                  fontWeight: selectedPeriod === "year" ? "700" : "500",
                  fontSize: 14,
                }}
              >
                Year
              </Text>
            </TouchableOpacity>
          </View>

          {/* Social Filter */}
          <Text style={{ fontSize: 16, color: "#888", marginBottom: 12 }}>
            Social
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 24 }}>
            {SOCIAL_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => onSocialFilterChange(filter.id)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor:
                    socialFilter === filter.id ? "#fff" : "#1a1a1a",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: socialFilter === filter.id ? "#000" : "#888",
                    fontWeight: socialFilter === filter.id ? "700" : "500",
                    fontSize: 14,
                  }}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Location Filter */}
          <Text style={{ fontSize: 16, color: "#888", marginBottom: 12 }}>
            Location
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {LOCATION_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => onLocationFilterChange(filter.id)}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor:
                    locationFilter === filter.id ? "#fff" : "#1a1a1a",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: locationFilter === filter.id ? "#000" : "#888",
                    fontWeight: locationFilter === filter.id ? "700" : "500",
                    fontSize: 14,
                  }}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
