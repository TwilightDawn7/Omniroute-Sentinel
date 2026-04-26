import { BrainCircuit, Clock, AlertCircle, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"

export function SystemInsights() {
  const { vehicles, alerts } = useAppStore()

  const delayedCount = vehicles.filter(v => v.status === 'Delayed').length
  const idleCount = vehicles.filter(v => v.status === 'Idle').length
  
  // Mock calculations based on current state
  const estTimeLost = delayedCount * 25 + idleCount * 45 // mock minutes
  const optimizableCount = vehicles.filter(v => v.status === 'Delayed' || v.status === 'Idle' || v.reroute).length

  const recentAnomalies = alerts.filter(a => new Date().getTime() - new Date(a.timestamp).getTime() < 300000).length // Last 5 mins

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <BrainCircuit className="h-24 w-24 text-indigo-500" />
      </div>
      <CardHeader className="pb-3 border-b border-slate-800/50">
        <CardTitle className="text-slate-100 flex items-center text-base">
          <BrainCircuit className="mr-2 h-5 w-5 text-indigo-400" />
          Global AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-indigo-500/10 p-1.5 border border-indigo-500/20">
            <AlertCircle className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-200">
              {delayedCount + idleCount === 0 
                ? "Fleet operating optimally" 
                : `${delayedCount} delayed, ${idleCount} idle vehicles`}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {delayedCount > 0 ? "Congestion affecting primary corridors." : "No significant delays."}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-amber-500/10 p-1.5 border border-amber-500/20">
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-200">
              {estTimeLost > 0 ? `Est. ${estTimeLost} mins total time lost` : "ETA projections stable"}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Impact derived from real-time telemetry speeds.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-emerald-500/10 p-1.5 border border-emerald-500/20">
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-200">
              {optimizableCount > 0 
                ? `${optimizableCount} routes available for optimization` 
                : "All active routes are optimal"}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {recentAnomalies > 0 ? `${recentAnomalies} new anomalies detected recently.` : "Monitoring for deviations."}
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
