// @ts-nocheck
import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  X,
  MapPin,
  Clock,
  Flame,
  TrendingUp,
  Heart,
  Footprints,
} from "lucide-react-native";
import { format } from "date-fns";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

export default function RunDetailModal({ visible, run, onClose }) {
  const insets = useSafeAreaInsets();

  if (!run) return null;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatPace = (pace) => {
    const mins = Math.floor(pace);
    const secs = Math.round((pace - mins) * 60);
    return `${mins}'${secs.toString().padStart(2, "0")}"`;
  };

  const formatDate = (date) => {
    return format(new Date(date), "EEEE, MMMM d, yyyy");
  };

  const formatStartTime = (date) => {
    return format(new Date(date), "h:mm a");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View
        style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
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
            borderBottomColor: "#f0f0f0",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#000" }}>
            Run Details
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Date and Time */}
          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            <Text style={{ fontSize: 15, color: "#666", marginBottom: 4 }}>
              {formatDate(run.date)}
            </Text>
            {run.startTime && (
              <Text style={{ fontSize: 14, color: "#999" }}>
                Started at {formatStartTime(run.startTime)}
              </Text>
            )}
          </View>

          {/* Big Distance */}
          <View
            style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}
          >
            <Text
              style={{
                fontSize: 64,
                fontWeight: "700",
                color: "#000",
                letterSpacing: -3,
              }}
            >
              {run.distance.toFixed(2)}
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: "#999",
                fontWeight: "500",
                marginTop: -4,
              }}
            >
              Miles
            </Text>
          </View>

          {/* Main Stats Grid */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderTopWidth: 1,
              borderTopColor: "#f0f0f0",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              {/* Avg Pace */}
              <View style={{ width: (screenWidth - 56) / 2 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Clock size={16} color="#60a5fa" />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#999",
                      marginLeft: 6,
                      fontWeight: "500",
                    }}
                  >
                    AVG. PACE
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: "#000",
                    letterSpacing: -0.5,
                  }}
                >
                  {formatPace(run.pace)}
                </Text>
                <Text style={{ fontSize: 13, color: "#666", marginTop: 2 }}>
                  per mile
                </Text>
              </View>

              {/* Time */}
              <View style={{ width: (screenWidth - 56) / 2 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Clock size={16} color="#60a5fa" />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#999",
                      marginLeft: 6,
                      fontWeight: "500",
                    }}
                  >
                    TIME
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: "#000",
                    letterSpacing: -0.5,
                  }}
                >
                  {formatTime(run.duration)}
                </Text>
              </View>

              {/* Calories */}
              {run.calories && (
                <View style={{ width: (screenWidth - 56) / 2, marginTop: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Flame size={16} color="#ff6b6b" />
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#999",
                        marginLeft: 6,
                        fontWeight: "500",
                      }}
                    >
                      CALORIES
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "700",
                      color: "#000",
                      letterSpacing: -0.5,
                    }}
                  >
                    {Math.round(run.calories)}
                  </Text>
                </View>
              )}

              {/* Elevation Gain */}
              {run.elevationGain && (
                <View style={{ width: (screenWidth - 56) / 2, marginTop: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <TrendingUp size={16} color="#22c55e" />
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#999",
                        marginLeft: 6,
                        fontWeight: "500",
                      }}
                    >
                      ELEVATION
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "700",
                      color: "#000",
                      letterSpacing: -0.5,
                    }}
                  >
                    {Math.round(run.elevationGain)}
                  </Text>
                  <Text style={{ fontSize: 13, color: "#666", marginTop: 2 }}>
                    feet
                  </Text>
                </View>
              )}

              {/* Cadence */}
              {run.cadence && (
                <View style={{ width: (screenWidth - 56) / 2, marginTop: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Footprints size={16} color="#a855f7" />
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#999",
                        marginLeft: 6,
                        fontWeight: "500",
                      }}
                    >
                      CADENCE
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "700",
                      color: "#000",
                      letterSpacing: -0.5,
                    }}
                  >
                    {Math.round(run.cadence)}
                  </Text>
                  <Text style={{ fontSize: 13, color: "#666", marginTop: 2 }}>
                    spm
                  </Text>
                </View>
              )}

              {/* Steps */}
              {run.steps && (
                <View style={{ width: (screenWidth - 56) / 2, marginTop: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Footprints size={16} color="#60a5fa" />
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#999",
                        marginLeft: 6,
                        fontWeight: "500",
                      }}
                    >
                      STEPS
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "700",
                      color: "#000",
                      letterSpacing: -0.5,
                    }}
                  >
                    {run.steps.toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Location */}
          {run.location && (
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 20,
                borderTopWidth: 1,
                borderTopColor: "#f0f0f0",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <MapPin size={16} color="#60a5fa" />
                <Text
                  style={{
                    fontSize: 12,
                    color: "#999",
                    marginLeft: 6,
                    fontWeight: "500",
                  }}
                >
                  LOCATION
                </Text>
              </View>
              <Text style={{ fontSize: 16, color: "#000", fontWeight: "500" }}>
                {run.location}
              </Text>
            </View>
          )}

          {/* Notes */}
          {run.notes && (
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 20,
                borderTopWidth: 1,
                borderTopColor: "#f0f0f0",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#999",
                  marginBottom: 8,
                  fontWeight: "500",
                }}
              >
                NOTES
              </Text>
              <Text style={{ fontSize: 15, color: "#000", lineHeight: 22 }}>
                {run.notes}
              </Text>
            </View>
          )}

          {/* Map Placeholder */}
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 20,
              height: 200,
              backgroundColor: "#f5f5f5",
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MapPin size={32} color="#999" />
            <Text style={{ fontSize: 14, color: "#999", marginTop: 8 }}>
              Route map coming soon
            </Text>
          </View>
        </ScrollView>

        {/* Close Button */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: insets.bottom + 16,
            borderTopWidth: 1,
            borderTopColor: "#f0f0f0",
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: "#60a5fa",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
