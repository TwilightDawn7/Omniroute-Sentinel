"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAlerts } from "@/lib/api";
import type { Alert, ApiResponse, DriverRouteData } from "@repo/types";
import { socket } from "@/lib/socket";

const REFRESH_INTERVAL = 30000;

export function useRouteData(vehicleData: any | null, vehicleId?: string) {
  const [routeData, setRouteData] = useState<DriverRouteData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    if (!vehicleData) return;
    try {
      // Use real vehicle data instead of fallback default route
      const distance = 150; // placeholder since we don't have turf.js here
      const data: DriverRouteData = {
        origin: vehicleData.origin || "Unknown",
        destination: vehicleData.destination || "Unknown",
        status: "on-route",
        driverLocation: { lat: vehicleData.lat, lng: vehicleData.lng },
        currentRoute: {
          id: "route-main",
          name: `${vehicleData.origin} → ${vehicleData.destination}`,
          type: "current",
          color: "#3b82f6",
          estimatedTime: 120,
          distance,
          coordinates: vehicleData.route && vehicleData.route.length > 0 
            ? vehicleData.route 
            : [{ lat: vehicleData.lat, lng: vehicleData.lng }]
        },
        reroutedRoute: null,
        blockedZones: [],
        lastUpdated: new Date().toISOString(),
      };

      const alertList = await fetchAlerts();

      setRouteData(data);
      setAlerts(alertList);
      setLastRefreshed(new Date());
      setError(null);
    } catch (err) {
      setError("Failed to load data. Retrying...");
    } finally {
      setLoading(false);
    }
  }, [vehicleData]);

  useEffect(() => {
    setLoading(true);
    loadData();
    const interval = setInterval(loadData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData]);

  // Emit vehicle location updates
  useEffect(() => {
    if (!routeData || !socket) return;
    
    // Always use vehicle.currentLocation / route instead of hardcoded Delhi coordinates
    const baseLat = routeData.driverLocation.lat;
    const baseLng = routeData.driverLocation.lng;

    const interval = setInterval(() => {
       socket?.emit("vehicle:update", {
         vehicleId: vehicleId || "OR-TRK-123", // Use dynamic ID
         lat: baseLat + (Math.random() - 0.5) * 0.02,
         lng: baseLng + (Math.random() - 0.5) * 0.02,
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
