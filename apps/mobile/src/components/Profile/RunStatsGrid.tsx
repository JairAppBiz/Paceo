// @ts-nocheck
import { View, Text } from "react-native";
import {
  Footprints,
  Activity,
  Gauge,
  Clock,
  Zap,
  Mountain,
} from "lucide-react-native";

export function RunStatsGrid({ runStats }) {
  // Format pace to match activity feed (e.g., 7.5 -> "7:30")
  const formatPace = (pace) => {
    const mins = Math.floor(pace);
    const secs = Math.round((pace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Footprints size={24} color="#60a5fa" strokeWidth={2} />
          <Text
            style={{
              fontSize: 24,
              color: "#fff",
              fontWeight: "700",
              marginTop: 8,
              marginBottom: 2,
            }}
          >
            {runStats.distance}
          </Text>
          <Text style={{ fontSize: 12, color: "#888" }}>Miles</Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Activity size={24} color="#10b981" strokeWidth={2} />
          <Text
            style={{
              fontSize: 24,
              color: "#fff",
              fontWeight: "700",
              marginTop: 8,
              marginBottom: 2,
            }}
          >
            {runStats.runs}
          </Text>
          <Text style={{ fontSize: 12, color: "#888" }}>Runs</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Gauge size={24} color="#f97316" strokeWidth={2} />
          <Text
            style={{
              fontSize: 24,
              color: "#fff",
              fontWeight: "700",
              marginTop: 8,
              marginBottom: 2,
            }}
          >
            {formatPace(parseFloat(runStats.avgPace))}
          </Text>
          <Text style={{ fontSize: 12, color: "#888" }}>Pace</Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Clock size={24} color="#a855f7" strokeWidth={2} />
          <Text
            style={{
              fontSize: 24,
              color: "#fff",
              fontWeight: "700",
              marginTop: 8,
              marginBottom: 2,
            }}
          >
            {Math.floor(runStats.totalTime / 60)}h {runStats.totalTime % 60}m
          </Text>
          <Text style={{ fontSize: 12, color: "#888" }}>Total Time</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Zap size={24} color="#fbbf24" strokeWidth={2} />
          <Text
            style={{
              fontSize: 24,
              color: "#fff",
              fontWeight: "700",
              marginTop: 8,
              marginBottom: 2,
            }}
          >
            {runStats.calories.toLocaleString()}
          </Text>
          <Text style={{ fontSize: 12, color: "#888" }}>Calories</Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#1a1a1a",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Mountain size={24} color="#ec4899" strokeWidth={2} />
          <Text
            style={{
              fontSize: 24,
              color: "#fff",
              fontWeight: "700",
              marginTop: 8,
              marginBottom: 2,
            }}
          >
            {runStats.elevation.toLocaleString()}
          </Text>
          <Text style={{ fontSize: 12, color: "#888" }}>Elevation (ft)</Text>
        </View>
      </View>
    </View>
  );
}
