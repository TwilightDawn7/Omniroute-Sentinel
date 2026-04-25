import dynamic from "next/dynamic"
import { Map } from "lucide-react"

import type { ShipmentVehicle } from "@/lib/mock-data"

const FleetMapClient = dynamic(() => import("@/components/map/fleet-map-client"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-800/30 border-t border-slate-700/50 flex items-center justify-center">
      <div className="text-center">
        <Map className="mx-auto h-8 w-8 text-cyan-500 mb-3" />
        <div className="text-sm text-slate-300">Loading live fleet map...</div>
        <div className="text-xs text-slate-500 mt-1">Initializing tiles and route overlays</div>
      </div>
    </div>
  ),
})

export function FleetMap({ vehicles }: { vehicles: ShipmentVehicle[] }) {
  return <FleetMapClient vehicles={vehicles} />
}
