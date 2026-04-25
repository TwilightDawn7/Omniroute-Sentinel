import { Download, Radio, Route, ShieldCheck } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { QuickAction } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const actionIcons: Record<QuickAction["icon"], LucideIcon> = {
  route: Route,
  radio: Radio,
  export: Download,
  shield: ShieldCheck,
}

export function QuickActionsCard({ actions }: { actions: QuickAction[] }) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-100 text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = actionIcons[action.icon]

            return (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto py-3 px-3 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 flex flex-col items-center justify-center space-y-1 w-full"
              >
                <Icon className="h-5 w-5 text-cyan-500" />
                <span className="text-xs">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
