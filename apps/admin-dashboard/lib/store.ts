import { create } from 'zustand'
import { shipmentVehicles, shipmentAlerts } from './mock-data'
import type { ShipmentVehicle, ShipmentAlert } from '@repo/types'
import { CoordinateTuple } from '@repo/types'

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
}

export const useAppStore = create<AppState>((set) => ({
  vehicles: shipmentVehicles.map(v => ({...v})),
  alerts: [...shipmentAlerts],
  selectedVehicleId: null,
  setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  optimizeRoute: (vehicleId) => set((state) => {
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
