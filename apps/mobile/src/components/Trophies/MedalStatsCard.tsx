// @ts-nocheck
import { View, Text } from "react-native";
import { Trophy } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useTheme } from "@/utils/themeStore";

// Medal Icon Component with Blue Ribbon - matching reference design
function MedalIcon({ rank, color }) {
  return (
    <View style={{ alignItems: "center", marginBottom: 8 }}>
      {/* Blue Ribbon */}
      <View
        style={{
          flexDirection: "row",
          gap: 4,
          marginBottom: -8,
          zIndex: 1,
        }}
      >
        <View
          style={{
            width: 18,
            height: 32,
            backgroundColor: "#6b9ff5",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        />
        <View
          style={{
            width: 18,
            height: 32,
            backgroundColor: "#548ff0",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        />
      </View>

      {/* Medal Circle */}
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: color,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3,
        }}
      >
        <Text
          style={{
            fontSize: 28,
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

export function MedalStatsCard({
  username,
  totalMedals,
  goldCount = 0,
  silverCount = 0,
  bronzeCount = 0,
  apexCount = 0,
  rangerCount = 0,
  scoutCount = 0,
}) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.cardBackground,
        borderRadius: 20,
        marginHorizontal: 20,
        marginTop: 20,
        padding: 12,
      }}
    >
      {/* Username and Total - no trophy icon */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: colors.text,
          textAlign: "center",
          marginBottom: 2,
        }}
      >
        {username}
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        {totalMedals} Total Medals
      </Text>

      {/* Divider */}
      <View
        style={{
          height: 1,
          backgroundColor: colors.divider,
          marginBottom: 12,
        }}
      />

      {/* Podium Medals - Podium Style (Silver, Gold elevated, Bronze) */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "flex-end",
          marginBottom: 12,
        }}
      >
        {/* Silver - left */}
        <View style={{ alignItems: "center", marginTop: 16 }}>
          <MedalIcon rank={2} color="#c0c0c0" />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: colors.text,
            }}
          >
            {silverCount}
          </Text>
        </View>

        {/* Gold - center and elevated */}
        <View style={{ alignItems: "center" }}>
          <MedalIcon rank={1} color="#f5c563" />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: colors.text,
            }}
          >
            {goldCount}
          </Text>
        </View>

        {/* Bronze - right */}
        <View style={{ alignItems: "center", marginTop: 16 }}>
          <MedalIcon rank={3} color="#cd9575" />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: colors.text,
            }}
          >
            {bronzeCount}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View
        style={{
          height: 1,
          backgroundColor: colors.divider,
          marginVertical: 10,
        }}
      />

      {/* Tier Badges */}
      <View
        style={{
          flexDirection: "row",
          gap: 6,
        }}
      >
        {/* Apex - Red */}
        <View
          style={{
            flex: 1,
            backgroundColor: colors.tertiaryBackground,
            borderRadius: 12,
            padding: 10,
            alignItems: "center",
            borderWidth: 2,
            borderColor: "#ef4444",
          }}
        >
          <Image
            source={{
              uri: "https://raw.createusercontent.com/20703a77-61e1-416a-9808-bcd9a5b02834/",
            }}
            style={{ width: 24, height: 24, marginBottom: 4 }}
            contentFit="contain"
          />
          <Text
            style={{
              fontSize: 10,
              color: colors.textSecondary,
              marginBottom: 2,
            }}
          >
            Apex
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: colors.text,
            }}
          >
            {apexCount}
          </Text>
        </View>

        {/* Ranger - Blue */}
        <View
          style={{
            flex: 1,
            backgroundColor: colors.tertiaryBackground,
            borderRadius: 12,
            padding: 10,
            alignItems: "center",
            borderWidth: 2,
            borderColor: "#3b82f6",
          }}
        >
          <Image
            source={{
              uri: "https://raw.createusercontent.com/453eff42-636b-45db-8144-afc1e650d023/",
            }}
            style={{ width: 24, height: 24, marginBottom: 4 }}
            contentFit="contain"
          />
          <Text
            style={{
              fontSize: 10,
              color: colors.textSecondary,
              marginBottom: 2,
            }}
          >
            Ranger
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: colors.text,
            }}
          >
            {rangerCount}
          </Text>
        </View>

        {/* Scout - Green */}
        <View
          style={{
            flex: 1,
            backgroundColor: colors.tertiaryBackground,
            borderRadius: 12,
            padding: 10,
            alignItems: "center",
            borderWidth: 2,
            borderColor: "#10b981",
          }}
        >
          <Image
            source={{
              uri: "https://raw.createusercontent.com/018ad631-d524-4678-8feb-729a3737f842/",
            }}
            style={{ width: 24, height: 24, marginBottom: 4 }}
            contentFit="contain"
          />
          <Text
            style={{
              fontSize: 10,
              color: colors.textSecondary,
              marginBottom: 2,
            }}
          >
            Scout
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: colors.text,
            }}
          >
            {scoutCount}
          </Text>
        </View>
      </View>
    </View>
  );
}
