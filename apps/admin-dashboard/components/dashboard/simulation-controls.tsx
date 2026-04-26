import { Play, Pause, FastForward, Car, Zap, Trash2, AlertTriangle, Settings2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function SimulationControls() {
  const { 
    isRunning, 
    speedMultiplier, 
    toggleSimulation, 
    setSimulationSpeed, 
    triggerTraffic, 
    triggerBreakdown, 
    addVehicle, 
    clearAlerts 
  } = useAppStore()

  const handleTraffic = () => {
    triggerTraffic()
    toast.error("Traffic Congestion Simulated", {
      description: "Several vehicles have been delayed."
    })
  }

  const handleBreakdown = () => {
    triggerBreakdown()
    toast.error("Vehicle Breakdown Triggered", {
      description: "A random vehicle has broken down and is now idle."
    })
  }

  const handleAddVehicle = () => {
    addVehicle()
    toast.success("New Vehicle Dispatched", {
      description: "A new truck has been added to the fleet."
    })
  }

  const handleClearAlerts = () => {
    clearAlerts()
    toast.success("Alerts Cleared", {
      description: "All system alerts have been dismissed."
    })
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-100 flex items-center text-base">
            <Settings2 className="mr-2 h-5 w-5 text-indigo-400" />
            Simulation Controls
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={isRunning ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : "text-amber-400 border-amber-500/30 bg-amber-500/10"}>
              {isRunning ? "Running" : "Paused"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
          <Button 
            variant={isRunning ? "secondary" : "default"}
            size="sm"
            onClick={toggleSimulation}
            className="flex-1"
          >
            {isRunning ? (
              <><Pause className="mr-2 h-4 w-4" /> Pause</>
            ) : (
              <><Play className="mr-2 h-4 w-4" /> Play</>
            )}
          </Button>

          <Select value={speedMultiplier.toString()} onValueChange={(v) => setSimulationSpeed(Number(v))}>
            <SelectTrigger className="w-[100px] h-9 bg-slate-900/50 border-slate-700/50">
              <FastForward className="mr-2 h-4 w-4 text-slate-400" />
              <SelectValue placeholder="Speed" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
              <SelectItem value="1">1x Speed</SelectItem>
              <SelectItem value="2">2x Speed</SelectItem>
              <SelectItem value="5">5x Speed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleTraffic}
            className="bg-slate-800/50 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
          >
            <AlertTriangle className="mr-2 h-3.5 w-3.5" />
            Traffic
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBreakdown}
            className="bg-slate-800/50 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <Zap className="mr-2 h-3.5 w-3.5" />
            Breakdown
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddVehicle}
            className="bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            <Car className="mr-2 h-3.5 w-3.5" />
            Add Vehicle
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearAlerts}
            className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Clear Alerts
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}
