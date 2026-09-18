// @ts-nocheck
// Design System Constants

// Gradients - matching leaderboard colors for consistency
export const GRADIENTS = {
  blue: ["#3b82f6", "#60a5fa"],
  cyan: ["#0ea5e9", "#38bdf8"],
  teal: ["#06b6d4", "#22d3ee"],
  emerald: ["#10b981", "#34d399"],
  green: ["#22c55e", "#4ade80"],
  lime: ["#84cc16", "#a3e635"],
  yellow: ["#eab308", "#fde047"],
  orange: ["#f59e0b", "#fbbf24"],
  red: ["#ef4444", "#f87171"],
  pink: ["#ec4899", "#f472b6"],
  purple: ["#8b5cf6", "#a78bfa"],
  violet: ["#6366f1", "#818cf8"],
  indigo: ["#a855f7", "#c084fc"],
  gold: ["#fbbf24", "#f59e0b"],
  silver: ["#e5e7eb", "#9ca3af"],
  bronze: ["#f97316", "#c2410c"],
};

// Spacing scale (multiples of 4)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
};

// Border radius
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// Font sizes
export const FONT_SIZE = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  huge: 28,
  massive: 32,
  giant: 40,
  mega: 48,
  ultra: 64,
};

// Font weights
export const FONT_WEIGHT = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  black: "900",
};

// Colors
export const COLORS = {
  background: "#000",
  surface: "#1a1a1a",
  surfaceLight: "#2a2a2a",
  text: "#fff",
  textSecondary: "#999",
  textTertiary: "#666",
  textDisabled: "#444",
  border: "#333",
  borderLight: "#222",
  accent: "#fbbf24",
  // Semantic colors
  primary: "#60a5fa", // brand blue — buttons, highlights, active states
  danger: "#ef4444", // destructive actions, errors
  success: "#10b981", // confirmations, live indicators
  warning: "#f59e0b", // caution states
};

// Section gradients for profile
export const SECTION_GRADIENTS = {
  distance: GRADIENTS.blue,
  runs: GRADIENTS.teal,
  streak: GRADIENTS.red,
  activity: GRADIENTS.emerald,
  statistics: GRADIENTS.blue,
  personalBests: GRADIENTS.orange,
  medals: GRADIENTS.purple,
  funStats: GRADIENTS.pink,
  graphs: GRADIENTS.violet,
};

// Shadow presets
export const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};