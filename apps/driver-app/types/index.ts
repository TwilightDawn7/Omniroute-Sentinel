export interface Coordinate {
    lat: number;
    lng: number;
  }
  
  export interface RouteSegment {
    id: string;
    name: string;
    coordinates: Coordinate[];
    type: "current" | "rerouted";
    color: string;
    estimatedTime: number; // minutes
    distance: number; // km
  }
  
  export interface BlockedZone {
    id: string;
    center: Coordinate;
    radius: number; // meters
    reason: string;
    severity: "low" | "medium" | "high" | "critical";
    startedAt: string;
  }
  
  export interface Alert {
    id: string;
    title: string;
    message: string;
    severity: "low" | "medium" | "high" | "critical";
    type: "weather" | "traffic" | "port" | "geopolitical" | "accident";
    location: string;
    coordinates: Coordinate;
    timestamp: string;
    isRead: boolean;
    affectsRoute: boolean;
  }
  
  export interface DriverRouteData {
    currentRoute: RouteSegment;
    reroutedRoute: RouteSegment | null;
    blockedZones: BlockedZone[];
    driverLocation: Coordinate;
    destination: string;
    origin: string;
    status: "on-route" | "rerouting" | "delayed" | "arrived";
    lastUpdated: string;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
  }