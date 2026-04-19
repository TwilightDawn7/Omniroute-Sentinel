export interface Alert {
  id: string;
  type: string;
  severity: "low" | "medium" | "high";
  location: string;
}

export interface Shipment {
  id: string;
  source: string;
  destination: string;
}