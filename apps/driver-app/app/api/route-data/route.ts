import { NextResponse } from "next/server";
import { DriverRouteData } from "@/types";

// All available cities with coordinates
export const CITIES: Record<string, { lat: number; lng: number; name: string }> = {
  delhi: { lat: 28.6139, lng: 77.209, name: "Delhi" },
  mumbai: { lat: 19.076, lng: 72.8777, name: "Mumbai" },
  jaipur: { lat: 26.9124, lng: 75.7873, name: "Jaipur" },
  bangalore: { lat: 12.9716, lng: 77.5946, name: "Bangalore" },
  hyderabad: { lat: 17.385, lng: 78.4867, name: "Hyderabad" },
  chennai: { lat: 13.0827, lng: 80.2707, name: "Chennai" },
  pune: { lat: 18.5204, lng: 73.8567, name: "Pune" },
  ahmedabad: { lat: 23.0225, lng: 72.5714, name: "Ahmedabad" },
  kolkata: { lat: 22.5726, lng: 88.3639, name: "Kolkata" },
  lucknow: { lat: 26.8467, lng: 80.9462, name: "Lucknow" },
};

// Generate intermediate waypoints between two coordinates
function interpolateRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  steps: number = 4
): { lat: number; lng: number }[] {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Add slight curve to make routes look realistic
    const midOffset = Math.sin(Math.PI * t) * 0.3;
    points.push({
      lat: parseFloat((from.lat + (to.lat - from.lat) * t + midOffset * 0.1).toFixed(4)),
      lng: parseFloat((from.lng + (to.lng - from.lng) * t + midOffset * 0.15).toFixed(4)),
    });
  }
  return points;
}

// Calculate approximate distance in km
function calcDistance(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function generateRouteData(
  originKey: string,
  destKey: string
): DriverRouteData {
  const now = new Date();
  const minute = now.getMinutes();

  const origin = CITIES[originKey] || CITIES.delhi;
  const dest = CITIES[destKey] || CITIES.jaipur;

  const distance = calcDistance(origin, dest);
  const estimatedTime = Math.round((distance / 60) * 60); // 60 km/h average

  // Driver position moves along route
  const progress = (minute % 30) / 30;
  const driverLat = origin.lat + (dest.lat - origin.lat) * progress;
  const driverLng = origin.lng + (dest.lng - origin.lng) * progress;

  const hasDisruption = minute % 10 < 5;

  // Blocked point is 40% into the route
  const blockLat = origin.lat + (dest.lat - origin.lat) * 0.4;
  const blockLng = origin.lng + (dest.lng - origin.lng) * 0.4;

  const mainRouteCoords = interpolateRoute(origin, dest, 5);

  // Alternate route — slight offset
  const altRouteCoords = interpolateRoute(
    origin,
    dest,
    5
  ).map((p, i) => ({
    lat: parseFloat((p.lat + (i > 0 && i < 4 ? 0.4 : 0)).toFixed(4)),
    lng: parseFloat((p.lng + (i > 0 && i < 4 ? 0.4 : 0)).toFixed(4)),
  }));

  return {
    origin: origin.name,
    destination: dest.name,
    status: hasDisruption ? "rerouting" : "on-route",
    driverLocation: {
      lat: parseFloat(driverLat.toFixed(4)),
      lng: parseFloat(driverLng.toFixed(4)),
    },
    currentRoute: {
      id: "route-main",
      name: `${origin.name} → ${dest.name} (Main)`,
      type: "current",
      color: "#3b82f6",
      estimatedTime: hasDisruption ? 0 : estimatedTime,
      distance,
      coordinates: mainRouteCoords,
    },
    reroutedRoute: hasDisruption
      ? {
          id: "route-alt",
          name: `${origin.name} → ${dest.name} (Alternate)`,
          type: "rerouted",
          color: "#22c55e",
          estimatedTime: Math.round(estimatedTime * 1.2),
          distance: Math.round(distance * 1.1),
          coordinates: altRouteCoords,
        }
      : null,
    blockedZones: hasDisruption
      ? [
          {
            id: "block-001",
            center: { lat: parseFloat(blockLat.toFixed(4)), lng: parseFloat(blockLng.toFixed(4)) },
            radius: Math.max(distance * 80, 8000),
            reason: "Highway accident + road closure",
            severity: "high",
            startedAt: new Date(now.getTime() - 1000 * 60 * 25).toISOString(),
          },
        ]
      : [],
    lastUpdated: now.toISOString(),
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get("origin") || "delhi";
    const destination = searchParams.get("destination") || "jaipur";

    const data = generateRouteData(origin, destination);
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch route data" },
      { status: 500 }
    );
  }
}

// Export cities list for the selector
export async function POST() {
  return NextResponse.json({
    success: true,
    data: Object.entries(CITIES).map(([key, val]) => ({
      key,
      name: val.name,
    })),
  });
}