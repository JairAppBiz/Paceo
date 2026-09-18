// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";

// Medal Icon Component with Blue Ribbon - compact version
function MedalIcon({ rank, color }) {
  return (
    <View style={{ alignItems: "center" }}>
      {/* Blue Ribbon */}
      <View
        style={{
          flexDirection: "row",
          gap: 2,
          marginBottom: -4,
          zIndex: 1,
        }}
      >
        <View
          style={{
            width: 8,
            height: 14,
            backgroundColor: "#6b9ff5",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        />
        <View
          style={{
            width: 8,
            height: 14,
            backgroundColor: "#548ff0",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        />
      </View>

      {/* Medal Circle */}
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: color,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: rank === 2 ? "#4a4a4a" : "#5a3a2a",
          }}
        >
          {rank}
        </Text>
      </View>
    </View>
  );
}

export function TrophyRoomCard({ medalData, onPress }) {
  const goldMedals = medalData?.counts?.gold || 0;
  const silverMedals = medalData?.counts?.silver || 0;
  const bronzeMedals = medalData?.counts?.bronze || 0;

  // Total podium medals only
  const totalMedals = goldMedals + silverMedals + bronzeMedals;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View
        style={{
          backgroundColor: "#1a1a1a",
          padding: 16,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side - Title */}
        <View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: "#fff",
              marginBottom: 2,
            }}
          >
            Trophy Room
          </Text>
          <Text style={{ fontSize: 12, color: "#888", fontWeight: "600" }}>
            {totalMedals} Podium Medal{totalMedals !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Center/Right - Medals and Arrow */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {totalMedals > 0 ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                gap: 12,
              }}
            >
              {/* Silver */}
              <View style={{ alignItems: "center", marginTop: 4 }}>
                <MedalIcon rank={2} color="#c0c0c0" />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#fff",
                    marginTop: 2,
                  }}
                >
                  {silverMedals}
                </Text>
              </View>

              {/* Gold - elevated */}
              <View style={{ alignItems: "center" }}>
                <MedalIcon rank={1} color="#f5c563" />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#fff",
                    marginTop: 2,
                  }}
                >
                  {goldMedals}
                </Text>
              </View>

              {/* Bronze */}
              <View style={{ alignItems: "center", marginTop: 4 }}>
                <MedalIcon rank={3} color="#cd9575" />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#fff",
                    marginTop: 2,
                  }}
                >
                  {bronzeMedals}
                </Text>
              </View>
            </View>
          ) : (
            <Text
              style={{
                fontSize: 11,
                color: "#666",
                fontWeight: "600",
              }}
            >
              No medals yet
            </Text>
          )}

          {/* Right side - Arrow */}
          <ChevronRight size={18} color="#666" strokeWidth={2.5} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
