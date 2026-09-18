// @ts-nocheck
import { View } from "react-native";

export function PageIndicators({ currentPage, totalPages = 3 }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        paddingBottom: 40,
        gap: 8,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      {Array.from({ length: totalPages }).map((_, page) => (
        <View
          key={page}
          style={{
            width: currentPage === page ? 24 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: currentPage === page ? "#fff" : "#333",
          }}
        />
      ))}
    </View>
  );
}
