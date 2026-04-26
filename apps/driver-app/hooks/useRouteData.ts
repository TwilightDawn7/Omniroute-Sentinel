"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAlerts } from "@/lib/api";
import type { Alert, ApiResponse, DriverRouteData } from "@repo/types";
import { socket } from "@/lib/socket";

const REFRESH_INTERVAL = 30000;

export function useRouteData(origin: string | null, destination: string | null, vehicleId?: string) {
  const [routeData, setRouteData] = useState<DriverRouteData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    if (!origin || !destination) return; // Wait until origin/destination are known
    try {
      const [routeRes, alertList] = await Promise.all([
        fetch(`/api/route-data?origin=${origin}&destination=${destination}`, {
          cache: "no-store",
        }),
        fetchAlerts(),
      ]);

      if (!routeRes.ok) throw new Error("Route fetch failed");
      const routeJson: ApiResponse<DriverRouteData> = await routeRes.json();

      setRouteData(routeJson.data);
      setAlerts(alertList);
      setLastRefreshed(new Date());
      setError(null);
    } catch (err) {
      setError("Failed to load data. Retrying...");
    } finally {
      setLoading(false);
    }
  }, [origin, destination]);

  useEffect(() => {
    setLoading(true);
    loadData();
    const interval = setInterval(loadData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData]);

  // Emit vehicle location updates
  useEffect(() => {
    if (!routeData || !socket) return;
    
    const baseLat = routeData.currentRoute?.coordinates[0]?.lat || 28.6139;
    const baseLng = routeData.currentRoute?.coordinates[0]?.lng || 77.2090;

    const interval = setInterval(() => {
       socket?.emit("vehicle:update", {
         vehicleId: vehicleId || "OR-TRK-123", // Use dynamic ID
         lat: baseLat + (Math.random() - 0.5) * 0.05,
         lng: baseLng + (Math.random() - 0.5) * 0.05,
         speed: 40 + Math.random() * 20,
         status: "On Route"
       });
    }, 2000);

    return () => clearInterval(interval);
  }, [routeData, vehicleId]);

  // Listen for admin commands
  useEffect(() => {
    if (!socket) return;
    const onCommand = (data: any) => {
       console.log("Received command from admin:", data);
       if (data.type === 'optimize_route') {
          // Re-fetch data on route optimization
          loadData();
       }
    };
    socket.on("vehicle:command", onCommand);
    return () => {
       socket?.off("vehicle:command", onCommand);
    }
  }, [loadData]);

  return { routeData, alerts, loading, error, lastRefreshed, refresh: loadData };
}
