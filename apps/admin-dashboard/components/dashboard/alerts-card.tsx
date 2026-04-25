import { AlertCircle, BellRing, CloudRain, Fuel, MapPin, ShieldAlert, TriangleAlert } from "lucide-react"

import type { ShipmentAlert } from "@repo/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const alertStyles = {
  low: {
    icon: Fuel,
    wrapperClass: "bg-blue-500/10 border-blue-500/30",
    iconClass: "text-blue-400",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  medium: {
    icon: CloudRain,
    wrapperClass: "bg-amber-500/10 border-amber-500/30",
    iconClass: "text-amber-400",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  high: {
    icon: TriangleAlert,
    wrapperClass: "bg-red-500/10 border-red-500/30",
    iconClass: "text-red-400",
    badgeClass: "bg-red-500/10 text-red-400 border-red-500/30",
  },
} as const

const typeIcons = {
  traffic: AlertCircle,
  weather: CloudRain,
  fuel: Fuel,
  closure: TriangleAlert,
  security: ShieldAlert,
} as const

function formatAlertTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(timestamp))
}

export function AlertsCard({ alerts }: { alerts: ShipmentAlert[] }) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-100 flex items-center text-base">
          <BellRing className="mr-2 h-5 w-5 text-amber-500" />
          Shipment Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => {
          const style = alertStyles[alert.severity]
          const Icon = style.icon
          const TypeIcon = typeIcons[alert.type]

          return (
            <div key={alert.id} className="flex items-start space-x-3">
              <div className={`mt-0.5 rounded-full border p-1 ${style.wrapperClass}`}>
                <Icon className={`h-3 w-3 ${style.iconClass}`} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-sm font-medium text-slate-200">{alert.title}</div>
                  <div className="text-xs text-slate-500">{formatAlertTime(alert.timestamp)}</div>
                </div>
                <div className="mt-1 text-xs text-slate-400">{alert.message}</div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={`text-[11px] ${style.badgeClass}`}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <div className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <TypeIcon className="h-3 w-3" />
                    <span className="capitalize">{alert.type}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="h-3 w-3" />
                    <span>{alert.location}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
