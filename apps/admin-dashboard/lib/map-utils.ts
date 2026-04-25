import type { ShipmentVehicle, VehicleStatus } from "@/lib/mock-data"

const statusColorMap: Record<VehicleStatus, string> = {
  "On Route": "#06b6d4",
  Idle: "#94a3b8",
  Delayed: "#f59e0b",
  Maintenance: "#ef4444",
}

const statusBadgeClassMap: Record<VehicleStatus, string> = {
  "On Route": "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  Idle: "bg-slate-500/10 text-slate-300 border-slate-500/30",
  Delayed: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Maintenance: "bg-red-500/10 text-red-400 border-red-500/30",
}

export function getStatusBadgeClass(status: VehicleStatus) {
  return statusBadgeClassMap[status]
}

export function getRouteColor(status: VehicleStatus) {
  return statusColorMap[status]
}

export function getFleetBounds(vehicles: ShipmentVehicle[]) {
  return vehicles.flatMap((vehicle) => [
    vehicle.position,
    ...vehicle.activeRoutePath,
    ...(vehicle.originalRoutePath ?? []),
  ])
}

export function formatCoordinates([latitude, longitude]: ShipmentVehicle["position"]) {
  return `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`
}
