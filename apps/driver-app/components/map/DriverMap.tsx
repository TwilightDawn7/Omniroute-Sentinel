"use client";

import { useEffect, useRef } from "react";
import { DriverRouteData } from "@/types";

interface DriverMapProps {
  routeData: DriverRouteData;
}

export default function DriverMap({ routeData }: DriverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    const initMap = async () => {
      // ✅ Import Leaflet CSS directly here — fixes black map
      await import("leaflet/dist/leaflet.css");
      const L = (await import("leaflet")).default;

      // Fix broken default marker icons in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Init map only once
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current!, {
          center: [routeData.driverLocation.lat, routeData.driverLocation.lng],
          zoom: 8,
          zoomControl: false,
        });

        // ✅ Use OpenStreetMap (always works, no API key needed)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);

        // Add zoom control to bottom-right
        L.control.zoom({ position: "bottomright" }).addTo(mapInstanceRef.current);
      }

      const map = mapInstanceRef.current;

      // Clear all old layers
      layersRef.current.forEach((layer) => map.removeLayer(layer));
      layersRef.current = [];

      // ── Current Route ──
      const currentCoords = routeData.currentRoute.coordinates.map(
        (c) => [c.lat, c.lng] as [number, number]
      );

      const isBlocked = !!routeData.reroutedRoute;

      // Draw current route (blue if clear, red dashed if blocked)
      const currentLine = L.polyline(currentCoords, {
        color: isBlocked ? "#ef4444" : "#60a5fa",
        weight: isBlocked ? 3 : 5,
        opacity: isBlocked ? 0.6 : 1,
        dashArray: isBlocked ? "10, 8" : undefined,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);
      currentLine.bindPopup(
        `<div style="font-weight:700;margin-bottom:4px">${routeData.currentRoute.name}</div>
         <div style="color:${isBlocked ? "#f87171" : "#4ade80"}">${isBlocked ? "⛔ BLOCKED" : "✅ Active Route"}</div>
         <div style="color:#9ca3af;margin-top:4px;font-size:12px">${routeData.currentRoute.distance} km</div>`
      );
      layersRef.current.push(currentLine);

      // ── Rerouted Route (green) ──
      if (routeData.reroutedRoute) {
        const rerouteCoords = routeData.reroutedRoute.coordinates.map(
          (c) => [c.lat, c.lng] as [number, number]
        );

        // Glow effect — outer
        const glowLine = L.polyline(rerouteCoords, {
          color: "#22c55e",
          weight: 12,
          opacity: 0.12,
        }).addTo(map);
        layersRef.current.push(glowLine);

        // Main green line
        const rerouteLine = L.polyline(rerouteCoords, {
          color: "#22c55e",
          weight: 5,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);
        rerouteLine.bindPopup(
          `<div style="font-weight:700;margin-bottom:4px">${routeData.reroutedRoute.name}</div>
           <div style="color:#4ade80">✅ New Safe Route</div>
           <div style="color:#9ca3af;margin-top:4px;font-size:12px">ETA: ${routeData.reroutedRoute.estimatedTime} min · ${routeData.reroutedRoute.distance} km</div>`
        );
        layersRef.current.push(rerouteLine);
      }

      // ── Blocked Zones ──
      routeData.blockedZones.forEach((zone) => {
        // Outer pulse ring
        const outerCircle = L.circle([zone.center.lat, zone.center.lng], {
          radius: zone.radius * 1.3,
          color: "#ef4444",
          fillColor: "#ef4444",
          fillOpacity: 0.05,
          weight: 1,
          dashArray: "4, 8",
        }).addTo(map);
        layersRef.current.push(outerCircle);

        // Main blocked zone
        const circle = L.circle([zone.center.lat, zone.center.lng], {
          radius: zone.radius,
          color: "#ef4444",
          fillColor: "#ef4444",
          fillOpacity: 0.18,
          weight: 2,
        }).addTo(map);
        circle.bindPopup(
          `<div style="font-weight:700;color:#f87171;margin-bottom:6px">⛔ ZONE BLOCKED</div>
           <div style="margin-bottom:4px">${zone.reason}</div>
           <div style="color:#9ca3af;font-size:12px">Severity: <span style="color:#fca5a5;font-weight:600">${zone.severity.toUpperCase()}</span></div>`
        );
        layersRef.current.push(circle);

        // Blocked label
        const dangerIcon = L.divIcon({
          html: `<div style="background:linear-gradient(135deg,#dc2626,#b91c1c);color:white;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:800;white-space:nowrap;box-shadow:0 4px 12px rgba(239,68,68,0.5);border:1px solid rgba(255,255,255,0.15);letter-spacing:0.05em">⛔ BLOCKED ZONE</div>`,
          className: "",
          iconAnchor: [50, 12],
        });
        const dangerMarker = L.marker([zone.center.lat, zone.center.lng], {
          icon: dangerIcon,
        }).addTo(map);
        layersRef.current.push(dangerMarker);
      });

      // ── Driver Location ──
      const driverIcon = L.divIcon({
        html: `<div style="position:relative;width:24px;height:24px">
          <div style="position:absolute;inset:0;background:#3b82f6;border-radius:50%;animation:ping 1.5s ease-out infinite;opacity:0.5"></div>
          <div style="position:absolute;inset:4px;background:#3b82f6;border-radius:50%;border:2px solid white;box-shadow:0 2px 12px rgba(59,130,246,0.8)"></div>
          <div style="position:absolute;inset:8px;background:white;border-radius:50%"></div>
        </div>`,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const driverMarker = L.marker(
        [routeData.driverLocation.lat, routeData.driverLocation.lng],
        { icon: driverIcon, zIndexOffset: 1000 }
      )
        .addTo(map)
        .bindPopup("<b>🚛 Your Location</b><br>You are here");
      layersRef.current.push(driverMarker);

      // ── Origin Marker ──
      const originCoord = routeData.currentRoute.coordinates[0];
      const originIcon = L.divIcon({
        html: `<div style="background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 4px 12px rgba(99,102,241,0.5);border:1px solid rgba(255,255,255,0.2)">📍 ${routeData.origin}</div>`,
        className: "",
        iconAnchor: [0, 12],
      });
      const originMarker = L.marker([originCoord.lat, originCoord.lng], {
        icon: originIcon,
      }).addTo(map);
      layersRef.current.push(originMarker);

      // ── Destination Marker ──
      const activeRoute = routeData.reroutedRoute || routeData.currentRoute;
      const destCoord = activeRoute.coordinates[activeRoute.coordinates.length - 1];
      const destIcon = L.divIcon({
        html: `<div style="background:linear-gradient(135deg,#f59e0b,#d97706);color:black;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 4px 12px rgba(245,158,11,0.5);border:1px solid rgba(255,255,255,0.2)">🏁 ${routeData.destination}</div>`,
        className: "",
        iconAnchor: [0, 12],
      });
      const destMarker = L.marker([destCoord.lat, destCoord.lng], {
        icon: destIcon,
      }).addTo(map);
      layersRef.current.push(destMarker);

      // ── Fit all markers in view ──
      const allCoords: [number, number][] = [
        ...routeData.currentRoute.coordinates,
        ...(routeData.reroutedRoute?.coordinates || []),
        ...routeData.blockedZones.map((z) => z.center),
        routeData.driverLocation,
      ].map((c) => [c.lat, c.lng]);

      if (allCoords.length > 0) {
        map.fitBounds(L.latLngBounds(allCoords), {
          padding: [60, 60],
          maxZoom: 10,
        });
      }
    };

    initMap();
  }, [routeData]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}