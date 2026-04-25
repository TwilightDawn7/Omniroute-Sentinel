import type { Alert, ApiResponse, DriverRouteData } from "@repo/types";

const BASE_URL =
  typeof window !== "undefined" ? window.location.origin : "http://localhost:3001";

export async function fetchRouteData(): Promise<DriverRouteData> {
  const res = await fetch(`${BASE_URL}/api/route-data`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch route data");
  const json: ApiResponse<DriverRouteData> = await res.json();
  return json.data;
}

export async function fetchAlerts(): Promise<Alert[]> {
  const res = await fetch(`${BASE_URL}/api/alerts`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch alerts");
  const json: ApiResponse<Alert[]> = await res.json();
  return json.data;
}
