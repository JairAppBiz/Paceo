// @ts-nocheck
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X, Check, Map, MapPin, EyeOff } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import {
  COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@/constants/design";

const STAT_OPTIONS = [
  { id: "distance", label: "Distance" },
  { id: "pace", label: "Pace" },
  { id: "time", label: "Time" },
  { id: "elevation", label: "Elevation" },
  { id: "calories", label: "Calories" },
  { id: "temperature", label: "Temperature" },
];

// How many metres to trim from each end of the route
const TRIM_OPTIONS = [
  { label: "None", value: 0, description: "Full route" },
  { label: "200m", value: 200, description: "~2 min" },
  { label: "500m", value: 500, description: "~5 min" },
  { label: "800m", value: 804, description: "Half mile" },
];

export default function PrivacySettingsModal({
  visible,
  hiddenStats,
  onToggleStat,
  primaryStats,
  onTogglePrimaryStat,
  // Route privacy props
  showRoute,
  onToggleShowRoute,
  routeTrimMetres,
  onSetRouteTrim,
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
            borderTopLeftRadius: RADIUS.xl,
            borderTopRightRadius: RADIUS.xl,
            paddingTop: SPACING.xl,
            paddingBottom: insets.bottom + SPACING.xl,
            height: "90%",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: SPACING.xl,
              marginBottom: SPACING.lg,
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.xxl,
                color: "#fff",
                fontWeight: FONT_WEIGHT.bold,
              }}
            >
              Post Settings
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
            contentContainerStyle={{
              paddingHorizontal: SPACING.xl,
              paddingBottom: SPACING.xl,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* ── Route Privacy Section ── */}
            <View style={{ marginBottom: SPACING.xxl }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <Map size={18} color={COLORS.primary} />
                <Text
                  style={{
                    fontSize: FONT_SIZE.lg,
                    color: "#fff",
                    fontWeight: FONT_WEIGHT.bold,
                  }}
                >
                  Route Map Privacy
                </Text>
              </View>
              <Text
                style={{
                  fontSize: FONT_SIZE.sm,
                  color: "#888",
                  marginBottom: SPACING.md,
                }}
              >
                Protect your home address by hiding or trimming your route
              </Text>

              {/* Show route toggle */}
              <View
                style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: RADIUS.md,
                  padding: SPACING.lg,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: SPACING.sm,
                }}
              >
                <View style={{ flex: 1, marginRight: SPACING.md }}>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: FONT_SIZE.md,
                      fontWeight: FONT_WEIGHT.semibold,
                    }}
                  >
                    Show route map
                  </Text>
                  <Text
                    style={{
                      color: "#888",
                      fontSize: FONT_SIZE.sm,
                      marginTop: 2,
                    }}
                  >
                    {showRoute
                      ? "Route visible on your post"
                      : "Route hidden from post"}
                  </Text>
                </View>
                <Switch
                  value={showRoute}
                  onValueChange={(val) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onToggleShowRoute?.(val);
                  }}
                  trackColor={{ false: "#333", true: COLORS.primary }}
                  thumbColor="#fff"
                />
              </View>

              {/* Trim start/end — only shown when route is visible */}
              {showRoute && (
                <View
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderRadius: RADIUS.md,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      padding: SPACING.lg,
                      borderBottomWidth: 1,
                      borderBottomColor: "#2a2a2a",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 2,
                      }}
                    >
                      <MapPin size={14} color="#888" />
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: FONT_SIZE.md,
                          fontWeight: FONT_WEIGHT.semibold,
                        }}
                      >
                        Trim start & end
                      </Text>
                    </View>
                    <Text style={{ color: "#888", fontSize: FONT_SIZE.sm }}>
                      Hides the first and last portion of your route
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    {TRIM_OPTIONS.map((opt, index) => {
                      const isSelected = routeTrimMetres === opt.value;
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          onPress={() => {
                            Haptics.impactAsync(
                              Haptics.ImpactFeedbackStyle.Light
                            );
                            onSetRouteTrim?.(opt.value);
                          }}
                          style={{
                            flex: 1,
                            paddingVertical: SPACING.md,
                            alignItems: "center",
                            backgroundColor: isSelected
                              ? COLORS.primary
                              : "transparent",
                            borderRightWidth:
                              index < TRIM_OPTIONS.length - 1 ? 1 : 0,
                            borderRightColor: "#2a2a2a",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: FONT_SIZE.sm,
                              fontWeight: FONT_WEIGHT.bold,
                              color: isSelected ? "#000" : "#fff",
                            }}
                          >
                            {opt.label}
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              color: isSelected ? "#000" : "#666",
                              marginTop: 2,
                            }}
                          >
                            {opt.description}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {!showRoute && (
                <View
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderRadius: RADIUS.md,
                    padding: SPACING.md,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <EyeOff size={16} color="#666" />
                  <Text style={{ color: "#666", fontSize: FONT_SIZE.sm }}>
                    Route map will not appear on your post
                  </Text>
                </View>
              )}
            </View>

            {/* Divider */}
            <View
              style={{
                height: 1,
                backgroundColor: "#2a2a2a",
                marginBottom: SPACING.xxl,
              }}
            />

            {/* ── Primary Stats Section ── */}
            <View style={{ marginBottom: SPACING.xxl }}>
              <Text
                style={{
                  fontSize: FONT_SIZE.lg,
                  color: "#fff",
                  fontWeight: FONT_WEIGHT.bold,
                  marginBottom: 4,
                }}
              >
                Choose stats to display
              </Text>
              <Text
                style={{
                  fontSize: FONT_SIZE.sm,
                  color: "#888",
                  marginBottom: SPACING.md,
                }}
              >
                Select up to 3 stats to show first on your post
              </Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {STAT_OPTIONS.map((stat) => {
                  const isSelected = primaryStats?.includes(stat.id);
                  const selectionIndex = primaryStats?.indexOf(stat.id);
                  return (
                    <TouchableOpacity
                      key={stat.id}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onTogglePrimaryStat?.(stat.id);
                      }}
                      style={{
                        backgroundColor: isSelected
                          ? COLORS.primary
                          : "#1a1a1a",
                        borderRadius: RADIUS.sm,
                        paddingVertical: SPACING.md,
                        paddingHorizontal: SPACING.lg,
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 2,
                        borderColor: isSelected ? COLORS.primary : "#333",
                      }}
                    >
                      {isSelected && (
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: "#000",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 8,
                          }}
                        >
                          <Text
                            style={{
                              color: COLORS.primary,
                              fontSize: FONT_SIZE.sm,
                              fontWeight: FONT_WEIGHT.bold,
                            }}
                          >
                            {selectionIndex + 1}
                          </Text>
                        </View>
                      )}
                      <Text
                        style={{
                          fontSize: FONT_SIZE.md,
                          color: isSelected ? "#000" : "#fff",
                          fontWeight: isSelected
                            ? FONT_WEIGHT.bold
                            : FONT_WEIGHT.semibold,
                        }}
                      >
                        {stat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Divider */}
            <View
              style={{
                height: 1,
                backgroundColor: "#2a2a2a",
                marginBottom: SPACING.xxl,
              }}
            />

            {/* ── Hidden Stats Section ── */}
            <View>
              <Text
                style={{
                  fontSize: FONT_SIZE.lg,
                  color: "#fff",
                  fontWeight: FONT_WEIGHT.bold,
                  marginBottom: 4,
                }}
              >
                Hide stats from viewers
              </Text>
              <Text
                style={{
                  fontSize: FONT_SIZE.sm,
                  color: "#888",
                  marginBottom: SPACING.md,
                }}
              >
                These stats will be completely hidden from your post
              </Text>

              <View
                style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: RADIUS.md,
                  padding: 4,
                }}
              >
                {STAT_OPTIONS.map((stat, index) => (
                  <TouchableOpacity
                    key={stat.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      onToggleStat(stat.id);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: SPACING.lg,
                      borderBottomWidth:
                        index < STAT_OPTIONS.length - 1 ? 1 : 0,
                      borderBottomColor: "#2a2a2a",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: FONT_SIZE.lg,
                        fontWeight: FONT_WEIGHT.semibold,
                      }}
                    >
                      Hide {stat.label}
                    </Text>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        backgroundColor: hiddenStats.includes(stat.id)
                          ? COLORS.primary
                          : "#2a2a2a",
                        borderWidth: 2,
                        borderColor: hiddenStats.includes(stat.id)
                          ? COLORS.primary
                          : "#444",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {hiddenStats.includes(stat.id) && (
                        <Check size={16} color="#000" strokeWidth={3} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}