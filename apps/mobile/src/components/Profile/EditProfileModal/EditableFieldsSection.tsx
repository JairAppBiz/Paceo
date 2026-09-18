// @ts-nocheck
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import CategoryIcon from "@/components/CategoryIcon";
import { HexagonBadge } from "@/components/Trophies/HexagonBadge";
import { MOODS } from "@/constants/moods";
import { CATEGORIES } from "@/constants/leaderboard";

export function EditableFieldsSection({
  username,
  onUsernameChange,
  selectedMood,
  onMoodPress,
  selectedDisplayedMedals,
  onMedalPress,
  selectedTrackedCategory,
  onCategoryPress,
  currentGoal,
  onGoalPress,
  currentRanking,
  bestRanking,
  onRankingPress,
}) {
  const currentMoodData = MOODS.find((m) => m.id === selectedMood);
  const currentCategoryData = CATEGORIES.find(
    (c) => c.id === selectedTrackedCategory,
  );

  return (
    <View
      style={{
        marginHorizontal: 20,
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 4,
      }}
    >
      {/* Username Row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#2a2a2a",
        }}
      >
        <Text style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}>
          Username
        </Text>
        <TextInput
          value={username}
          onChangeText={onUsernameChange}
          onSubmitEditing={Keyboard.dismiss}
          returnKeyType="done"
          blurOnSubmit={true}
          placeholder="Enter username"
          placeholderTextColor="#666"
          style={{
            fontSize: 16,
            color: "#fff",
            textAlign: "right",
            flex: 1,
            marginLeft: 16,
          }}
        />
      </View>

      {/* Current Mood Row */}
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onMoodPress();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#2a2a2a",
        }}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}>
          Current mood
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {currentMoodData && (
            <LinearGradient
              colors={currentMoodData.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CategoryIcon
                category={currentMoodData.iconCategory}
                size={20}
                iconSize={10}
                customGradient={[
                  "rgba(255,255,255,0.3)",
                  "rgba(255,255,255,0.1)",
                ]}
              />
            </LinearGradient>
          )}
          <Text style={{ fontSize: 16, color: "#888" }}>
            {currentMoodData?.label || "Select mood"}
          </Text>
          <ChevronRight size={20} color="#666" />
        </View>
      </TouchableOpacity>

      {/* Display Badges Row */}
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onMedalPress();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#2a2a2a",
        }}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}>
          Display badges
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {selectedDisplayedMedals.length > 0 ? (
            <View style={{ flexDirection: "row", gap: 4, marginRight: 4 }}>
              {selectedDisplayedMedals.slice(0, 3).map((medal, index) => {
                // Determine tier color for each medal
                let tierColor = "#10b981"; // default top100
                if (medal.rank_achieved === 1) tierColor = "#fbbf24";
                else if (medal.rank_achieved === 2) tierColor = "#c0c0c0";
                else if (medal.rank_achieved === 3) tierColor = "#cd7f32";
                else if (medal.rank_achieved <= 10) tierColor = "#ef4444";
                else if (medal.rank_achieved <= 50) tierColor = "#3b82f6";

                return (
                  <HexagonBadge
                    key={medal.id || index}
                    category={medal.category}
                    rank={medal.rank_achieved}
                    color={tierColor}
                    size={24}
                    iconSize={10}
                  />
                );
              })}
            </View>
          ) : (
            <Text style={{ fontSize: 16, color: "#888" }}>Select badges</Text>
          )}
          <ChevronRight size={20} color="#666" />
        </View>
      </TouchableOpacity>

      {/* Tracked Tier Progress Row */}
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onCategoryPress();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#2a2a2a",
        }}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}>
            Tracked Tier Progress
          </Text>
          <Text style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
            Display on your profile
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {currentCategoryData && (
            <LinearGradient
              colors={currentCategoryData.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CategoryIcon
                category={currentCategoryData.iconCategory}
                size={20}
                iconSize={10}
                customGradient={[
                  "rgba(255,255,255,0.3)",
                  "rgba(255,255,255,0.1)",
                ]}
              />
            </LinearGradient>
          )}
          <Text style={{ fontSize: 16, color: "#888" }}>
            {currentCategoryData?.label || "Select category"}
          </Text>
          <ChevronRight size={20} color="#666" />
        </View>
      </TouchableOpacity>

      {/* Current Goal Row */}
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onGoalPress();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#2a2a2a",
        }}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}>
          Current goal
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 16, color: "#888" }}>
            {currentGoal
              ? `${currentGoal.target} ${currentGoal.category}`
              : "Set a goal"}
          </Text>
          <ChevronRight size={20} color="#666" />
        </View>
      </TouchableOpacity>

      {/* My Rankings Row */}
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onRankingPress();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
        }}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}>
          My rankings
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 16, color: "#888" }}>
            {currentRanking || bestRanking ? "Customize" : "Select rankings"}
          </Text>
          <ChevronRight size={20} color="#666" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
