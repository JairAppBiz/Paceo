// @ts-nocheck
import { View, Text } from "react-native";
import { TrendingUp, Shield, TrendingDown } from "lucide-react-native";

export function TierRulesCard() {
  return (
    <View
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 16,
          fontWeight: "bold",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        How Tiers Work
      </Text>

      {/* Promotion Zone */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <TrendingUp size={18} color="#10b981" />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#10b981",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            Top 15% Promoted
          </Text>
          <Text style={{ color: "#888", fontSize: 12 }}>
            Advance to the next tier
          </Text>
        </View>
      </View>

      {/* Safe Zone */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <Shield size={18} color="#3b82f6" />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#3b82f6",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            Middle 75% Safe
          </Text>
          <Text style={{ color: "#888", fontSize: 12 }}>
            Remain in current tier
          </Text>
        </View>
      </View>

      {/* Demotion Zone */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <TrendingDown size={18} color="#ef4444" />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#ef4444",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            Bottom 10% Demoted
          </Text>
          <Text style={{ color: "#888", fontSize: 12 }}>
            Drop to the previous tier
          </Text>
        </View>
      </View>

      {/* Timing Information */}
      <View
        style={{
          marginTop: 16,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: "#333",
        }}
      >
        <Text
          style={{
            color: "#888",
            fontSize: 12,
            lineHeight: 18,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Monthly Leaderboards:{" "}
          </Text>
          Promotions and demotions happen at the end of every month. Podium
          medals are also awarded at month-end, and leaderboards reset at the
          start of the new month.
        </Text>
        <Text
          style={{
            color: "#888",
            fontSize: 12,
            lineHeight: 18,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Weekly Leaderboards:{" "}
          </Text>
          Only award podium medals and reset at the start of every week. No
          promotions or demotions.
        </Text>
      </View>
    </View>
  );
}
