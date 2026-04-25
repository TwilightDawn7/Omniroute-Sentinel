import { NextResponse } from "next/server";
import type { Alert, ApiResponse } from "@repo/types";

function generateAlerts(): Alert[] {
  const now = new Date();
  const minute = now.getMinutes();
  const hasDisruption = minute % 10 < 5;

  const baseAlerts: Alert[] = [
    {
      id: "alert-001",
      title: "Heavy Traffic Congestion",
      message:
        "Major slowdown detected on NH48 near Gurugram toll. Average speed dropped to 12 km/h. Expect 45-60 min delay.",
      severity: "high",
      type: "traffic",
      location: "Gurugram, Haryana",
      coordinates: { lat: 28.4595, lng: 77.0266 },
      timestamp: new Date(now.getTime() - 1000 * 60 * 8).toISOString(),
      isRead: false,
      affectsRoute: true,
    },
    {
      id: "alert-002",
      title: "Weather Warning: Heavy Rain",
      message:
        "IMD has issued orange alert for heavy rainfall in Alwar district. Visibility may drop. Drive cautiously.",
      severity: "medium",
      type: "weather",
      location: "Alwar, Rajasthan",
      coordinates: { lat: 27.5597, lng: 76.6355 },
      timestamp: new Date(now.getTime() - 1000 * 60 * 22).toISOString(),
      isRead: false,
      affectsRoute: false,
    },
    {
      id: "alert-003",
      title: "Fuel Station Ahead",
      message:
        "HPCL fuel station available in 3.2 km. Recommended stop based on your fuel level.",
      severity: "low",
      type: "traffic",
      location: "Kotputli, Rajasthan",
      coordinates: { lat: 27.7061, lng: 76.1994 },
      timestamp: new Date(now.getTime() - 1000 * 60 * 35).toISOString(),
      isRead: true,
      affectsRoute: false,
    },
  ];

  if (hasDisruption) {
    baseAlerts.unshift({
      id: "alert-critical-001",
      title: "🚨 CRITICAL: Route Blocked",
      message:
        "Highway accident + flash flooding confirmed on NH48 near Shahjahanpur. Road is completely blocked. AI has calculated alternate route via NH11. ETA delay: +35 minutes.",
      severity: "critical",
      type: "accident",
      location: "Shahjahanpur, Rajasthan",
      coordinates: { lat: 27.6, lng: 76.8 },
      timestamp: new Date(now.getTime() - 1000 * 60 * 3).toISOString(),
      isRead: false,
      affectsRoute: true,
    });
  }

  return baseAlerts;
}

export async function GET() {
  try {
    const alerts = generateAlerts();
    const response: ApiResponse<Alert[]> = {
      success: true,
      data: alerts,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}
