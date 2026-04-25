import { Fuel, MapPin, Timer } from "lucide-react"

import type { ShipmentVehicle } from "@repo/types"
import { formatCoordinates, getStatusBadgeClass } from "@/lib/map-utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TelemetryTable({ vehicles }: { vehicles: ShipmentVehicle[] }) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b border-slate-700/50 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-100 flex items-center text-base">
            <Timer className="mr-2 h-5 w-5 text-cyan-500" />
            Truck Telemetry
          </CardTitle>
          <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-600/50 text-xs">
            {vehicles.length} trucks
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-800/50">
            <TableRow className="border-slate-700/50 hover:bg-transparent">
              <TableHead className="text-slate-400">Vehicle ID</TableHead>
              <TableHead className="text-slate-400">Location</TableHead>
              <TableHead className="text-slate-400">Speed</TableHead>
              <TableHead className="text-slate-400">Fuel</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id} className="border-slate-700/30 hover:bg-slate-800/50">
                <TableCell className="text-slate-200">
                  <div className="font-medium">{vehicle.id}</div>
                  <div className="text-xs text-slate-500">{vehicle.vehicleType}</div>
                </TableCell>
                <TableCell className="text-slate-300">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-cyan-500" />
                    <div>
                      <div>{vehicle.location}</div>
                      <div className="text-xs text-slate-500">
                        {vehicle.cargo} · {formatCoordinates(vehicle.position)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-cyan-400">
                  <div>{vehicle.speed} km/h</div>
                  {vehicle.reroute ? <div className="text-xs text-amber-400">+{vehicle.reroute.etaImpactMinutes} min</div> : null}
                </TableCell>
                <TableCell className="text-slate-300">
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-amber-400" />
                    <span>{vehicle.fuel}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${getStatusBadgeClass(vehicle.status)}`}>
                    {vehicle.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
