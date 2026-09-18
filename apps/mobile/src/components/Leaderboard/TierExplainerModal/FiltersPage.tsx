// @ts-nocheck
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function FiltersPage({
  selectedPeriod,
  onPeriodChange,
  socialFilter,
  onSocialFilterChange,
  locationFilter,
  onLocationFilterChange,
  SOCIAL_FILTERS,
  LOCATION_FILTERS,
}) {
  return (
    <View style={{ width: SCREEN_WIDTH, padding: 20, paddingTop: 80 }}>
      <Text
        style={{
          color: "#fff",
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Filters
      </Text>
      <Text
        style={{
          color: "#888",
          fontSize: 14,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        Customize your leaderboard view
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Period Filter */}
        {onPeriodChange && (
          <>
            <Text style={{ fontSize: 15, color: "#888", marginBottom: 10 }}>
              Period
            </Text>
            <View style={{ flexDirection: "row", gap: 6, marginBottom: 20 }}>
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
                    fontWeight: selectedPeriod === "month" ? "700" : "500",
                    fontSize: 13,
                  }}
                >
                  Month
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Social Filter */}
        {onSocialFilterChange && SOCIAL_FILTERS && (
          <>
            <Text style={{ fontSize: 15, color: "#888", marginBottom: 10 }}>
              Social
            </Text>
            <View style={{ flexDirection: "row", gap: 6, marginBottom: 20 }}>
              {SOCIAL_FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  onPress={() => onSocialFilterChange(filter.id)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor:
                      socialFilter === filter.id ? "#fff" : "#1a1a1a",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: socialFilter === filter.id ? "#000" : "#888",
                      fontWeight: socialFilter === filter.id ? "700" : "500",
                      fontSize: 13,
                    }}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Location Filter */}
        {onLocationFilterChange && LOCATION_FILTERS && (
          <>
            <Text style={{ fontSize: 15, color: "#888", marginBottom: 10 }}>
              Location
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {LOCATION_FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  onPress={() => onLocationFilterChange(filter.id)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor:
                      locationFilter === filter.id ? "#fff" : "#1a1a1a",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: locationFilter === filter.id ? "#000" : "#888",
                      fontWeight: locationFilter === filter.id ? "700" : "500",
                      fontSize: 13,
                    }}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
