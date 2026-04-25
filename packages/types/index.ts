export type Coordinate = {
  lat: number;
  lng: number;
};

export type CoordinateTuple = [number, number];

export type AlertSeverity = "low" | "medium" | "high" | "critical";
export type DriverAlertType = "weather" | "traffic" | "port" | "geopolitical" | "accident";
export type ShipmentAlertType = "traffic" | "weather" | "fuel" | "closure" | "security";
export type AlertType = DriverAlertType | ShipmentAlertType;

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  type: AlertType;
  location: string;
  coordinates: Coordinate;
  timestamp: string;
  isRead: boolean;
  affectsRoute: boolean;
}

export type ShipmentAlert = Omit<Alert, "severity" | "type"> & {
  severity: Exclude<AlertSeverity, "critical">;
  type: ShipmentAlertType;
};

export type RouteSegmentType = "current" | "rerouted";

export interface RouteSegment {
  id: string;
  name: string;
  coordinates: Coordinate[];
  type: RouteSegmentType;
  color: string;
  estimatedTime: number;
  distance: number;
}

export interface BlockedZone {
  id: string;
  center: Coordinate;
  radius: number;
  reason: string;
  severity: AlertSeverity;
  startedAt: string;
}

export type DriverRouteStatus = "on-route" | "rerouting" | "delayed" | "arrived";

export interface DriverRouteData {
  currentRoute: RouteSegment;
  reroutedRoute: RouteSegment | null;
  blockedZones: BlockedZone[];
  driverLocation: Coordinate;
  destination: string;
  origin: string;
  status: DriverRouteStatus;
  lastUpdated: string;
}

export type VehicleStatus = "On Route" | "Idle" | "Delayed" | "Maintenance";
export type RerouteCause = "delay" | "closure" | "natural_disaster" | "security" | "conflict";

export interface VehicleReroute {
  cause: RerouteCause;
  reason: string;
  divertedVia: string;
  blockedZone: string;
  etaImpactMinutes: number;
}

export interface ShipmentVehicle {
  id: string;
  driver: string;
  vehicleType: string;
  cargo: string;
  route: string;
  speed: number;
  fuel: number;
  status: VehicleStatus;
  location: string;
  shipments: number;
  position: CoordinateTuple;
  activeRoutePath: CoordinateTuple[];
  originalRoutePath?: CoordinateTuple[];
  reroute?: VehicleReroute;
}

export interface Shipment {
  id: string;
  source: string;
  destination: string;
}

export interface CityOption {
  key: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp?: string;
  error?: string;
}
