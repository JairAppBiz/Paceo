// @ts-nocheck
import { View, Text } from "react-native";
import MapView, { Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { RADIUS } from "@/constants/design";

/**
 * Displays a run route polyline on a static map.
 * Accepts either a JSON string or parsed array of {latitude, longitude}.
 */
export function RouteMap({ routeCoordinates, height = 160 }) {
  // Parse if string
  let coords = [];
  try {
    coords =
      typeof routeCoordinates === "string"
        ? JSON.parse(routeCoordinates)
        : routeCoordinates || [];
  } catch {
    return null;
  }

  if (!coords || coords.length < 2) return null;

  // Fit map region to the route with padding
  const lats = coords.map((c) => c.latitude);
  const lngs = coords.map((c) => c.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const padding = 0.003;

  const region = {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(maxLat - minLat + padding, 0.006),
    longitudeDelta: Math.max(maxLng - minLng + padding, 0.006),
  };

  return (
    <View
      style={{
        height,
        borderRadius: RADIUS.md,
        overflow: "hidden",
        marginBottom: 12,
      }}
    >
      <MapView
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        region={region}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        pointerEvents="none"
        mapType="standard"
      >
        {/* Start dot */}
        <Polyline
          coordinates={[coords[0]]}
          strokeColor="#10b981"
          strokeWidth={8}
          lineCap="round"
        />

        {/* Route line */}
        <Polyline
          coordinates={coords}
          strokeColor="#60a5fa"
          strokeWidth={4}
          lineCap="round"
          lineJoin="round"
        />

        {/* End dot */}
        <Polyline
          coordinates={[coords[coords.length - 1]]}
          strokeColor="#ef4444"
          strokeWidth={8}
          lineCap="round"
        />
      </MapView>

      {/* Start/End legend */}
      <View
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          backgroundColor: "rgba(0,0,0,0.65)",
          borderRadius: RADIUS.sm,
          paddingHorizontal: 8,
          paddingVertical: 4,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#10b981",
            }}
          />
          <Text style={{ color: "#fff", fontSize: 10 }}>Start</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#ef4444",
            }}
          />
          <Text style={{ color: "#fff", fontSize: 10 }}>End</Text>
        </View>
      </View>
    </View>
  );
}