// @ts-nocheck
import { Tabs } from "expo-router";
import { Home, BarChart3, User } from "lucide-react-native";
import {
  COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  SPACING,
  RADIUS,
} from "@/constants/design";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 1,
          borderTopColor: "#1a1a1a" /* COLORS.surface */,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#60a5fa" /* COLORS.primary */,
        tabBarInactiveTintColor: "#666" /* COLORS.textTertiary */,
        tabBarShowLabel: false,
        lazy: false,
      }}
    >
      <Tabs.Screen
        name="leaderboard"
        options={{
          tabBarIcon: ({ color }) => <BarChart3 color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}