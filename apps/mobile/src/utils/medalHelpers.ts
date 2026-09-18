// @ts-nocheck
export const getMedalLabel = (type) => {
  if (type === "gold") return "Gold";
  if (type === "silver") return "Silver";
  if (type === "bronze") return "Bronze";
  if (type === "top10") return "Top 10";
  if (type === "top50") return "Top 50";
  if (type === "top100") return "Top 100";
  return type;
};

export const getMedalEmoji = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  if (rank <= 10) return "🔵";
  if (rank <= 50) return "🟢";
  if (rank <= 100) return "🟣";
  return "🏅";
};

export const getMedalColor = (rank) => {
  if (rank === 1) return "#fbbf24"; // Gold
  if (rank === 2) return "#c0c0c0"; // Silver
  if (rank === 3) return "#cd7f32"; // Bronze
  if (rank <= 10) return "#60a5fa"; // Blue
  if (rank <= 50) return "#10b981"; // Green
  if (rank <= 100) return "#a855f7"; // Purple
  return "#888"; // Default gray
};
