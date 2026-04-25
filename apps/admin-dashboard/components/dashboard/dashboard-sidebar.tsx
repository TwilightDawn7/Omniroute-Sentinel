import {
  BarChart3,
  LayoutGrid,
  Map,
  Package,
  Plug,
  Settings,
  Truck,
  TriangleAlert,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { NavigationItem, SidebarStatusMetric, StatusTone } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const navigationIcons: Record<NavigationItem["icon"], LucideIcon> = {
  dashboard: LayoutGrid,
  fleet: Truck,
  routes: Map,
  deliveries: Package,
  alerts: TriangleAlert,
  analytics: BarChart3,
  integrations: Plug,
  settings: Settings,
}

const toneStyles: Record<StatusTone, string> = {
  cyan: "from-cyan-500 to-blue-500",
  blue: "from-blue-500 to-indigo-500",
  green: "from-green-500 to-emerald-500",
  amber: "from-amber-500 to-orange-500",
}

export function DashboardSidebar({
  navigationItems,
  statusItems,
}: {
  navigationItems: NavigationItem[]
  statusItems: SidebarStatusMetric[]
}) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
      <CardContent className="p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = navigationIcons[item.icon]

            return (
              <Button
                key={item.label}
                variant="ghost"
                className={`w-full justify-start ${
                  item.active ? "bg-slate-800/70 text-cyan-400" : "text-slate-400 hover:text-slate-100"
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="text-xs text-slate-500 mb-2 font-mono">NETWORK STATUS</div>
          <div className="space-y-3">
            {statusItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-slate-400">{item.label}</div>
                  <div className="text-xs text-slate-400">{item.value}%</div>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${toneStyles[item.tone]}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
