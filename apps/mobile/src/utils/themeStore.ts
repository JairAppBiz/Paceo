// @ts-nocheck
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useTheme = create((set) => ({
  isDark: true,
  colors: {
    // Dark mode colors (current)
    background: "#000",
    cardBackground: "#1a1a1a",
    secondaryBackground: "#0a0a0a",
    tertiaryBackground: "#2a2a2a",
    text: "#fff",
    textSecondary: "#888",
    textTertiary: "#666",
    border: "#1e293b",
    divider: "#2a2a2a",
  },

  toggleTheme: async () => {
    set((state) => {
      const newIsDark = !state.isDark;
      const newColors = newIsDark
        ? {
            // Dark mode
            background: "#000",
            cardBackground: "#1a1a1a",
            secondaryBackground: "#0a0a0a",
            tertiaryBackground: "#2a2a2a",
            text: "#fff",
            textSecondary: "#888",
            textTertiary: "#666",
            border: "#1e293b",
            divider: "#2a2a2a",
          }
        : {
            // Light mode
            background: "#fff",
            cardBackground: "#f5f5f5",
            secondaryBackground: "#e5e5e5",
            tertiaryBackground: "#d5d5d5",
            text: "#000",
            textSecondary: "#666",
            textTertiary: "#888",
            border: "#e0e0e0",
            divider: "#e5e5e5",
          };

      // Persist to AsyncStorage
      AsyncStorage.setItem("theme", newIsDark ? "dark" : "light");

      return { isDark: newIsDark, colors: newColors };
    });
  },

  setTheme: (isDark) => {
    set({
      isDark,
      colors: isDark
        ? {
            background: "#000",
            cardBackground: "#1a1a1a",
            secondaryBackground: "#0a0a0a",
            tertiaryBackground: "#2a2a2a",
            text: "#fff",
            textSecondary: "#888",
            textTertiary: "#666",
            border: "#1e293b",
            divider: "#2a2a2a",
          }
        : {
            background: "#fff",
            cardBackground: "#f5f5f5",
            secondaryBackground: "#e5e5e5",
            tertiaryBackground: "#d5d5d5",
            text: "#000",
            textSecondary: "#666",
            textTertiary: "#888",
            border: "#e0e0e0",
            divider: "#e5e5e5",
          },
    });
  },

  loadTheme: async () => {
    const savedTheme = await AsyncStorage.getItem("theme");
    if (savedTheme) {
      set((state) => ({
        ...state,
        isDark: savedTheme === "dark",
        colors:
          savedTheme === "dark"
            ? {
                background: "#000",
                cardBackground: "#1a1a1a",
                secondaryBackground: "#0a0a0a",
                tertiaryBackground: "#2a2a2a",
                text: "#fff",
                textSecondary: "#888",
                textTertiary: "#666",
                border: "#1e293b",
                divider: "#2a2a2a",
              }
            : {
                background: "#fff",
                cardBackground: "#f5f5f5",
                secondaryBackground: "#e5e5e5",
                tertiaryBackground: "#d5d5d5",
                text: "#000",
                textSecondary: "#666",
                textTertiary: "#888",
                border: "#e0e0e0",
                divider: "#e5e5e5",
              },
      }));
    }
  },
}));
