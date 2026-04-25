"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAlerts } from "@/lib/api";
import type { Alert, ApiResponse, DriverRouteData } from "@repo/types";

const REFRESH_INTERVAL = 30000;

export function useRouteData(origin: string, destination: string) {
  const [routeData, setRouteData] = useState<DriverRouteData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
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

  return { routeData, alerts, loading, error, lastRefreshed, refresh: loadData };
}
