// @ts-nocheck
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";

export function FunStatsSection({ funStats }) {
  const [expandedFunStat, setExpandedFunStat] = useState(null);

  if (!funStats) return null;

  // Format pace to match activity feed (e.g., 7.5 -> "7:30")
  const formatPace = (pace) => {
    const mins = Math.floor(pace);
    const secs = Math.round((pace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
      <Text
        style={{
          fontSize: 22,
          color: "#fff",
          fontWeight: "700",
          marginBottom: 16,
        }}
      >
        Fun Stats
      </Text>

      {/* Signature Pace Card */}
      <TouchableOpacity
        onPress={() =>
          setExpandedFunStat(expandedFunStat === "pace" ? null : "pace")
        }
        style={{
          marginBottom: 12,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            backgroundColor: "#667eea",
            padding: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                  marginBottom: 8,
                }}
              >
                Signature Pace
              </Text>
              <Text
                style={{
                  fontSize: 48,
                  color: "#fff",
                  fontWeight: "900",
                }}
              >
                {formatPace(parseFloat(funStats.signaturePace))}
              </Text>
            </View>
            {expandedFunStat === "pace" ? (
              <ChevronUp size={24} color="#fff" />
            ) : (
              <ChevronDown size={24} color="#fff" />
            )}
          </View>
          {expandedFunStat === "pace" && (
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.9)",
                marginTop: 16,
                lineHeight: 20,
              }}
            >
              This is the pace you naturally settle into during most of your
              runs. It's your comfort zone - the rhythm your body knows best.
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Run Vibes Score Card */}
      <TouchableOpacity
        onPress={() =>
          setExpandedFunStat(expandedFunStat === "vibes" ? null : "vibes")
        }
        style={{
          marginBottom: 12,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            backgroundColor: "#f093fb",
            padding: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                  marginBottom: 8,
                }}
              >
                Run Vibes Score
              </Text>
              <Text
                style={{
                  fontSize: 36,
                  color: "#fff",
                  fontWeight: "900",
                }}
              >
                {funStats.runVibesScore}%
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.9)",
                  marginTop: 4,
                  fontWeight: "600",
                }}
              >
                {funStats.vibesMessage}
              </Text>
            </View>
            {expandedFunStat === "vibes" ? (
              <ChevronUp size={24} color="#fff" />
            ) : (
              <ChevronDown size={24} color="#fff" />
            )}
          </View>
          {expandedFunStat === "vibes" && (
            <View>
              <View
                style={{
                  height: 8,
                  backgroundColor: "rgba(255,255,255,0.3)",
                  borderRadius: 4,
                  marginTop: 16,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: 8,
                    width: `${funStats.runVibesScore}%`,
                    backgroundColor: "#fff",
                    borderRadius: 4,
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.9)",
                  marginTop: 12,
                  lineHeight: 20,
                }}
              >
                Based on your mood tracking, this score reflects how you
                typically feel during and after your runs.
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Fastest Segments Card */}
      <TouchableOpacity
        onPress={() =>
          setExpandedFunStat(expandedFunStat === "segments" ? null : "segments")
        }
        style={{
          marginBottom: 12,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            backgroundColor: "#4facfe",
            padding: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                  marginBottom: 12,
                }}
              >
                Fastest Segments
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 24,
                      color: "#fff",
                      fontWeight: "900",
                    }}
                  >
                    {funStats.fastestSegments.sprint10sec}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.8)",
                      marginTop: 4,
                    }}
                  >
                    10s Sprint
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 24,
                      color: "#fff",
                      fontWeight: "900",
                    }}
                  >
                    {funStats.fastestSegments.burst30sec}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.8)",
                      marginTop: 4,
                    }}
                  >
                    30s Burst
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 24,
                      color: "#fff",
                      fontWeight: "900",
                    }}
                  >
                    {funStats.fastestSegments.hillPace}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.8)",
                      marginTop: 4,
                    }}
                  >
                    Hill Pace
                  </Text>
                </View>
              </View>
            </View>
            {expandedFunStat === "segments" ? (
              <ChevronUp size={24} color="#fff" />
            ) : (
              <ChevronDown size={24} color="#fff" />
            )}
          </View>
          {expandedFunStat === "segments" && (
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.9)",
                marginTop: 12,
                lineHeight: 20,
              }}
            >
              Your estimated fastest paces for short bursts and hill climbs,
              showing your explosive power and climbing strength.
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Efficiency Breakdown Card */}
      <TouchableOpacity
        onPress={() =>
          setExpandedFunStat(
            expandedFunStat === "efficiency" ? null : "efficiency",
          )
        }
        style={{
          marginBottom: 12,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            backgroundColor: "#fa709a",
            padding: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                  marginBottom: 12,
                }}
              >
                Efficiency Breakdown
              </Text>

              {/* Cardio */}
              <View style={{ marginBottom: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#fff",
                      fontWeight: "600",
                    }}
                  >
                    Cardio
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#fff",
                      fontWeight: "700",
                    }}
                  >
                    {funStats.efficiencyBreakdown.cardio}%
                  </Text>
                </View>
                <View
                  style={{
                    height: 8,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: 8,
                      width: `${funStats.efficiencyBreakdown.cardio}%`,
                      backgroundColor: "#fff",
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>

              {/* Endurance */}
              <View style={{ marginBottom: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#fff",
                      fontWeight: "600",
                    }}
                  >
                    Endurance
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#fff",
                      fontWeight: "700",
                    }}
                  >
                    {funStats.efficiencyBreakdown.endurance}%
                  </Text>
                </View>
                <View
                  style={{
                    height: 8,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: 8,
                      width: `${funStats.efficiencyBreakdown.endurance}%`,
                      backgroundColor: "#fff",
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>

              {/* Speed */}
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#fff",
                      fontWeight: "600",
                    }}
                  >
                    Speed
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#fff",
                      fontWeight: "700",
                    }}
                  >
                    {funStats.efficiencyBreakdown.speed}%
                  </Text>
                </View>
                <View
                  style={{
                    height: 8,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: 8,
                      width: `${funStats.efficiencyBreakdown.speed}%`,
                      backgroundColor: "#fff",
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>
            </View>
            {expandedFunStat === "efficiency" ? (
              <ChevronUp size={24} color="#fff" style={{ marginLeft: 12 }} />
            ) : (
              <ChevronDown size={24} color="#fff" style={{ marginLeft: 12 }} />
            )}
          </View>
          {expandedFunStat === "efficiency" && (
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.9)",
                marginTop: 12,
                lineHeight: 20,
              }}
            >
              Your running profile based on frequency (cardio), distance
              (endurance), and pace (speed). Shows where you excel!
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
