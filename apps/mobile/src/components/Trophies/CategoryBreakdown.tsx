// @ts-nocheck
import { View, Text } from "react-native";
import { CATEGORY_INFO } from "@/constants/medals";
import CategoryIcon from "@/components/CategoryIcon";

export function CategoryBreakdown({ categoryBreakdown }) {
  if (!categoryBreakdown || Object.keys(categoryBreakdown).length === 0) {
    return null;
  }

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
      <Text
        style={{
          fontSize: 20,
          color: "#fff",
          fontWeight: "700",
          marginBottom: 16,
        }}
      >
        Category Breakdown
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {Object.entries(categoryBreakdown)
          .sort((a, b) => b[1] - a[1])
          .map(([category, count]) => {
            const info = CATEGORY_INFO[category] || {
              iconCategory: "trophy",
              label: category,
            };
            return (
              <View
                key={category}
                style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: 12,
                  padding: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  borderWidth: 1,
                  borderColor: "#333",
                }}
              >
                <CategoryIcon
                  category={info.iconCategory}
                  size={32}
                  iconSize={16}
                />
                <Text
                  style={{ fontSize: 14, color: "#fff", fontWeight: "600" }}
                >
                  {info.label}
                </Text>
                <View
                  style={{
                    backgroundColor: "#fbbf24",
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                  }}
                >
                  <Text
                    style={{ fontSize: 12, color: "#000", fontWeight: "900" }}
                  >
                    {count}
                  </Text>
                </View>
              </View>
            );
          })}
      </View>
    </View>
  );
}
