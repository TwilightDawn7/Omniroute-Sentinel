import { create } from 'zustand'
import { shipmentVehicles, shipmentAlerts } from './mock-data'
import type { ShipmentVehicle, ShipmentAlert } from '@repo/types'
import { CoordinateTuple } from '@repo/types'
import { socket } from './socket'

const interpolate = (p1: CoordinateTuple, p2: CoordinateTuple, fraction: number): CoordinateTuple => {
  return [
    p1[0] + (p2[0] - p1[0]) * fraction,
    p1[1] + (p2[1] - p1[1]) * fraction
  ]
}

const getDistance = (p1: CoordinateTuple, p2: CoordinateTuple) => {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  return Math.sqrt(dx * dx + dy * dy);
}

interface AppState {
  vehicles: ShipmentVehicle[];
  alerts: ShipmentAlert[];
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
  updateSimulation: () => void;
  optimizeRoute: (vehicleId: string) => void;
  addAlert: (alert: ShipmentAlert) => void;
  isRunning: boolean;
  speedMultiplier: number;
  addVehicle: (id?: string, start?: CoordinateTuple, end?: CoordinateTuple) => void;
  triggerTraffic: () => void;
  triggerBreakdown: () => void;
  clearAlerts: () => void;
  setSimulationSpeed: (speed: number) => void;
  toggleSimulation: () => void;
  updateVehicleFromSocket: (data: { vehicleId: string; lat: number; lng: number; speed: number; status: string }) => void;
}

export const useAppStore = create<AppState>((set) => ({
  vehicles: shipmentVehicles.map(v => ({...v})),
  alerts: [...shipmentAlerts],
  selectedVehicleId: null,
  isRunning: true,
  speedMultiplier: 1,
  setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  clearAlerts: () => set({ alerts: [] }),
  setSimulationSpeed: (speed) => set({ speedMultiplier: speed }),
  toggleSimulation: () => set((state) => ({ isRunning: !state.isRunning })),
  updateVehicleFromSocket: (data) => set((state) => {
    const exists = state.vehicles.some(v => v.id === data.vehicleId);
    let newVehicles = state.vehicles;
    
    if (exists) {
      newVehicles = state.vehicles.map(v => 
        v.id === data.vehicleId 
          ? { ...v, position: [data.lat, data.lng] as CoordinateTuple, speed: data.speed, status: data.status, isReal: true } 
          : v
      );
    } else {
      // Create a basic vehicle if it doesn't exist
      const newVehicle: ShipmentVehicle = {
        id: data.vehicleId,
        driver: "Real Driver",
        vehicleType: "Real Truck",
        cargo: "Live Cargo",
        route: "Live Route",
        speed: data.speed,
        fuel: 100,
        status: data.status,
        location: "Live Location",
        shipments: 10,
        position: [data.lat, data.lng],
        activeRoutePath: [[data.lat, data.lng]],
      };
      newVehicles = [...state.vehicles, newVehicle];
    }
    
    return { vehicles: newVehicles, isRunning: false }; // Stop simulation when real data arrives
  }),
  addVehicle: (id?: string, start?: CoordinateTuple, end?: CoordinateTuple) => set((state) => {
    // Generate a random vehicle or use provided
    const newId = id || `OR-TRK-${Math.floor(Math.random() * 900 + 100)}`;
    const startPos: CoordinateTuple = start || [28.6139 + (Math.random() - 0.5), 77.2090 + (Math.random() - 0.5)];
    const endPos: CoordinateTuple = end || [28.6139 + (Math.random() - 0.5), 77.2090 + (Math.random() - 0.5)];
    const newVehicle: ShipmentVehicle = {
      id: newId,
      driver: "New Driver",
      vehicleType: "Standard Truck",
      cargo: "General Cargo",
      route: "Custom Route",
      speed: 40,
      fuel: 100,
      status: "On Route",
      location: "New Location",
      shipments: Math.floor(Math.random() * 20 + 5),
      position: startPos,
      activeRoutePath: [startPos, interpolate(startPos, endPos, 0.5), endPos],
    };
    return { vehicles: [...state.vehicles, newVehicle] };
  }),
  triggerTraffic: () => set((state) => {
    // Randomly select 2-4 vehicles
    const count = Math.floor(Math.random() * 3) + 2;
    const shuffled = [...state.vehicles].sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, count).map(v => v.id);
    
    return {
      vehicles: state.vehicles.map(v => {
        if (selectedIds.includes(v.id)) {
          return { ...v, status: 'Delayed', speed: Math.floor(Math.random() * 15 + 5) } as ShipmentVehicle;
        }
        return v;
      })
    };
  }),
  triggerBreakdown: () => set((state) => {
    const onRouteVehicles = state.vehicles.filter(v => v.status === 'On Route' || v.status === 'Delayed');
    if (onRouteVehicles.length === 0) return state;
    
    const target = onRouteVehicles[Math.floor(Math.random() * onRouteVehicles.length)];
    const alert: ShipmentAlert = {
        id: `alert-breakdown-${Date.now()}`,
        title: `Vehicle Breakdown: ${target.id}`,
        message: `Vehicle ${target.id} has experienced a critical breakdown.`,
        location: target.location,
        coordinates: { lat: target.position[0], lng: target.position[1] },
        timestamp: new Date().toISOString(),
        isRead: false,
        affectsRoute: true,
        type: 'closure',
        severity: 'high'
    };
    
    return {
      alerts: [alert, ...state.alerts],
      vehicles: state.vehicles.map(v => v.id === target.id ? { ...v, status: 'Idle', speed: 0 } as ShipmentVehicle : v)
    };
  }),
  optimizeRoute: (vehicleId) => set((state) => {
    socket?.emit('vehicle:command', { type: 'optimize_route', vehicleId });
    
    const newVehicles = state.vehicles.map(v => {
      if (v.id === vehicleId) {
        if (v.status === 'Delayed' || v.reroute || v.status === 'Idle') {
           const endPoint = v.activeRoutePath[v.activeRoutePath.length - 1];
           const currentPos = v.position;
           return {
             ...v,
             status: 'On Route',
             speed: 55,
             activeRoutePath: [currentPos, interpolate(currentPos, endPoint, 0.5), endPoint],
             originalRoutePath: v.activeRoutePath,
             reroute: undefined,
           } as ShipmentVehicle
        }
      }
      return v;
    });
    return { vehicles: newVehicles };
  }),
  updateSimulation: () => set((state) => {
    if (!state.isRunning) return state;

    let newAlerts = [...state.alerts];
    
    const newVehicles = state.vehicles.map(v => {
      if (v.status === 'Maintenance') return v;
      
      let nextPos = v.position;
      let newSpeed = v.speed;
      let newStatus = v.status;
      
      const dest = v.activeRoutePath[v.activeRoutePath.length - 1];
      const distToDest = getDistance(v.position, dest);
      
      if (distToDest > 0.001) {
         newSpeed = Math.max(0, Math.min(80, v.speed + (Math.random() - 0.5) * 10));
         
         if (newSpeed < 5) {
           newStatus = 'Idle';
         } else if (newSpeed < 30) {
           newStatus = 'Delayed';
         } else {
           newStatus = 'On Route';
         }

         if (v.status === 'On Route' && newStatus === 'Idle') {
            newAlerts.unshift({
                id: `alert-auto-${Date.now()}`,
                title: `Vehicle Stopped: ${v.id}`,
                message: `Vehicle ${v.id} has stopped unexpectedly on its route.`,
                location: v.location,
                coordinates: { lat: v.position[0], lng: v.position[1] },
                timestamp: new Date().toISOString(),
                isRead: false,
                affectsRoute: true,
                type: 'traffic',
                severity: 'medium'
            });
         }

         const distKm = newSpeed * (2 / 3600);
         const distDegrees = distKm / 111;
         
         const dirX = dest[0] - v.position[0];
         const dirY = dest[1] - v.position[1];
         const dirLen = Math.sqrt(dirX*dirX + dirY*dirY);
         
         if (dirLen > 0) {
           const moveX = (dirX / dirLen) * distDegrees;
           const moveY = (dirY / dirLen) * distDegrees;
           
           if (Math.abs(moveX) > Math.abs(dirX) || Math.abs(moveY) > Math.abs(dirY)) {
             nextPos = dest;
             newSpeed = 0;
             newStatus = 'Idle';
           } else {
             nextPos = [v.position[0] + moveX, v.position[1] + moveY];
           }
         }
      } else {
         newSpeed = 0;
         newStatus = 'Idle';
      }

      return {
        ...v,
        position: nextPos,
        speed: Math.round(newSpeed),
        status: newStatus
      } as ShipmentVehicle;
    });

    return { vehicles: newVehicles, alerts: newAlerts };
  })
}));
