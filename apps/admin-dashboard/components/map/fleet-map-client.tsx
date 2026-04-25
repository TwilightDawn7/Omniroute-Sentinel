"use client"

import L from "leaflet"
import { MapContainer, Marker, Polyline, Popup, TileLayer, ZoomControl } from "react-leaflet"
import { Gauge, GitBranch, Route, ShieldAlert, Truck } from "lucide-react"

import type { ShipmentVehicle } from "@repo/types"
import { formatCoordinates, getFleetBounds, getRouteColor, getStatusBadgeClass } from "@/lib/map-utils"
import { Badge } from "@/components/ui/badge"

const rerouteCauseLabel: Record<NonNullable<ShipmentVehicle["reroute"]>["cause"], string> = {
  delay: "Delay",
  closure: "Closure",
  natural_disaster: "Natural Disaster",
  security: "Security",
  conflict: "Conflict",
}

function createVehicleMarkerIcon(status: ShipmentVehicle["status"]) {
  const color = getRouteColor(status)

  return L.divIcon({
    className: "",
    html: `
      <div style="position: relative; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; width: 18px; height: 18px; border-radius: 9999px; background: ${color}; opacity: 0.22;"></span>
        <span style="position: relative; width: 12px; height: 12px; border-radius: 9999px; background: ${color}; border: 2px solid #020617;"></span>
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  })
}

export default function FleetMapClient({ vehicles }: { vehicles: ShipmentVehicle[] }) {
  const reroutedTrucks = vehicles.filter((vehicle) => vehicle.reroute).length

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-4 top-4 z-[500] rounded-lg border border-slate-700/50 bg-slate-900/85 backdrop-blur-sm px-4 py-3 text-xs text-slate-300">
        <div className="font-medium text-slate-100">Route Legend</div>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-1 w-6 rounded-full bg-cyan-500" />
          <span>Active truck route</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="h-1 w-6 rounded-full bg-slate-500 opacity-70" />
          <span>Blocked or replaced route</span>
        </div>
        <div className="mt-2 text-slate-500">{reroutedTrucks} trucks currently rerouted</div>
      </div>

      <MapContainer
        bounds={getFleetBounds(vehicles)}
        boundsOptions={{ padding: [32, 32] }}
        className="h-full w-full"
        zoomControl={false}
        scrollWheelZoom
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {vehicles
          .filter((vehicle) => vehicle.originalRoutePath)
          .map((vehicle) => (
            <Polyline
              key={`${vehicle.id}-original-route`}
              positions={vehicle.originalRoutePath!}
              pathOptions={{
                color: "#64748b",
                weight: 4,
                opacity: 0.4,
                dashArray: "8 8",
              }}
            />
          ))}

        {vehicles.map((vehicle) => (
          <Polyline
            key={`${vehicle.id}-active-route`}
            positions={vehicle.activeRoutePath}
            pathOptions={{
              color: getRouteColor(vehicle.status),
              weight: 4,
              opacity: 0.65,
            }}
          />
        ))}

        {vehicles.map((vehicle) => (
          <Marker key={vehicle.id} position={vehicle.position} icon={createVehicleMarkerIcon(vehicle.status)}>
            <Popup>
              <div className="w-[220px] p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{vehicle.id}</div>
                    <div className="text-xs text-slate-400">{vehicle.driver}</div>
                    <div className="mt-1 text-[11px] text-slate-500">{vehicle.vehicleType} | {vehicle.cargo}</div>
                  </div>
                  <Badge variant="outline" className={`text-[11px] ${getStatusBadgeClass(vehicle.status)}`}>
                    {vehicle.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{vehicle.speed} km/h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Route className="h-3.5 w-3.5 text-blue-400" />
                    <span>{vehicle.route}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{vehicle.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-3.5 w-3.5 text-purple-400" />
                    <span>{vehicle.shipments} shipment loads</span>
                  </div>
                </div>

                {vehicle.reroute ? (
                  <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                    <div className="flex items-center gap-2 font-medium">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>{rerouteCauseLabel[vehicle.reroute.cause]} reroute active</span>
                    </div>
                    <div className="mt-1 text-amber-100/90">{vehicle.reroute.reason}</div>
                    <div className="mt-2 text-amber-200/90">Diverted via {vehicle.reroute.divertedVia}</div>
                    <div className="text-amber-200/70">Blocked zone: {vehicle.reroute.blockedZone}</div>
                    <div className="text-amber-300/90">ETA impact: +{vehicle.reroute.etaImpactMinutes} min</div>
                  </div>
                ) : null}

                <div className="rounded-md border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-xs text-slate-400">
                  {formatCoordinates(vehicle.position)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
