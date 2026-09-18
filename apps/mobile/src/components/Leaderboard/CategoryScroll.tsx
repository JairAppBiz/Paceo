// @ts-nocheck
import { ScrollView, TouchableOpacity, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Star } from "lucide-react-native";
import { CATEGORIES } from "@/constants/leaderboard";
import CategoryIcon from "@/components/CategoryIcon";

export function CategoryScroll({
  selectedCategory,
  defaultCategory,
  onCategorySelect,
  onSaveDefaultCategory,
  categoryScrollRef,
  expandedCategory,
  onCategoryExpand,
}) {
  // Reorder categories to put default first
  const orderedCategories = [...CATEGORIES];
  if (defaultCategory) {
    const defaultIndex = orderedCategories.findIndex(
      (c) => c.id === defaultCategory,
    );
    if (defaultIndex > 0) {
      const [defaultCat] = orderedCategories.splice(defaultIndex, 1);
      orderedCategories.unshift(defaultCat);
    }
  }

  return (
    <View style={{ marginBottom: 24 }}>
      <ScrollView
        ref={categoryScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 12,
        }}
        nestedScrollEnabled={true}
      >
        {orderedCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const isExpanded = expandedCategory === category.id;
          const isDefault = defaultCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => {
                if (isSelected) {
                  // If already selected, toggle expanded state
                  onCategoryExpand(isExpanded ? null : category.id);
                } else {
                  // If not selected, select it and collapse any expanded
                  onCategorySelect(category.id);
                  onCategoryExpand(null);
                }
              }}
              style={{
                width: 140,
              }}
            >
              <View
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: isSelected ? 3 : 0,
                  borderColor: "#fff",
                }}
              >
                <LinearGradient
                  colors={category.gradient}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* Tappable Star in Top Right */}
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      onSaveDefaultCategory(category.id);
                    }}
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      borderRadius: 12,
                      padding: 4,
                    }}
                  >
                    <Star
                      size={16}
                      color={isDefault ? "#fbbf24" : "#888"}
                      fill={isDefault ? "#fbbf24" : "transparent"}
                    />
                  </TouchableOpacity>

                  <CategoryIcon
                    category={category.iconCategory}
                    size={64}
                    iconSize={32}
                    customGradient={[
                      "rgba(255,255,255,0.2)",
                      "rgba(255,255,255,0.05)",
                    ]}
                    style={{ marginBottom: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#fff",
                      fontWeight: "700",
                      textAlign: "center",
                      paddingHorizontal: 4,
                    }}
                  >
                    {category.label}
                  </Text>
                </LinearGradient>
              </View>

              {/* Expanded Description */}
              {isExpanded && isSelected && (
                <View
                  style={{
                    marginTop: 8,
                    backgroundColor: "#1a1a1a",
                    borderRadius: 12,
                    padding: 12,
                    width: 140,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#888",
                      textAlign: "center",
                      lineHeight: 16,
                    }}
                  >
                    {category.detailedDescription}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
