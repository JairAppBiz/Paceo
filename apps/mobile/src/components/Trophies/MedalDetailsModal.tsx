// @ts-nocheck
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { X } from "lucide-react-native";
import { MedalListItem } from "./MedalListItem";
import { getMedalLabel } from "@/utils/medalHelpers";

export function MedalDetailsModal({
  visible,
  selectedMedalType,
  loadingDetails,
  insets,
  modalFilter,
  modalSort,
  filteredMedals,
  onClose,
  onMedalClick,
  onFilterChange,
  onSortChange,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.95)" }}>
        <View
          style={{
            flex: 1,
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
          }}
        >
          {/* Modal Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <View>
              <Text style={{ fontSize: 28, color: "#fff", fontWeight: "700" }}>
                {selectedMedalType && getMedalLabel(selectedMedalType)} Medals
              </Text>
              <Text style={{ fontSize: 14, color: "#888", marginTop: 4 }}>
                {filteredMedals?.length || 0}{" "}
                {modalFilter !== "all" ? `(${modalFilter})` : "total"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#1a1a1a",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Filter Tabs */}
          <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              <TouchableOpacity
                onPress={() => onFilterChange("all")}
                activeOpacity={0.7}
                style={{
                  backgroundColor:
                    modalFilter === "all" ? "#fbbf24" : "#1a1a1a",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: modalFilter === "all" ? "#000" : "#fff",
                    fontWeight: "700",
                  }}
                >
                  All Time
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onFilterChange("monthly")}
                activeOpacity={0.7}
                style={{
                  backgroundColor:
                    modalFilter === "monthly" ? "#fbbf24" : "#1a1a1a",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: modalFilter === "monthly" ? "#000" : "#fff",
                    fontWeight: "700",
                  }}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onFilterChange("weekly")}
                activeOpacity={0.7}
                style={{
                  backgroundColor:
                    modalFilter === "weekly" ? "#fbbf24" : "#1a1a1a",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: modalFilter === "weekly" ? "#000" : "#fff",
                    fontWeight: "700",
                  }}
                >
                  Weekly
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Sort Options */}
          <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
            <Text style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
              Sort by
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={() => onSortChange("date")}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor: modalSort === "date" ? "#3b82f6" : "#1a1a1a",
                  paddingVertical: 10,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 14, color: "#fff", fontWeight: "600" }}
                >
                  Date
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onSortChange("rank")}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor: modalSort === "rank" ? "#3b82f6" : "#1a1a1a",
                  paddingVertical: 10,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 14, color: "#fff", fontWeight: "600" }}
                >
                  Rank
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Medal List */}
          {loadingDetails ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#fbbf24" />
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 20,
              }}
              showsVerticalScrollIndicator={false}
            >
              {filteredMedals &&
                filteredMedals.map((medal) => (
                  <MedalListItem
                    key={medal.id}
                    medal={medal}
                    onPress={onMedalClick}
                  />
                ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
