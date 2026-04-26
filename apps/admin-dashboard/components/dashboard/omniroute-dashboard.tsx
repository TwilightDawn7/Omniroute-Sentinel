"use client"

import { useEffect, useRef, useState } from "react"
import { Activity, AlertTriangle, Package, RefreshCw, Shield, Truck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { OverviewMetricCard } from "@/components/dashboard/overview-metric-card"
import { OperationsClockCard } from "@/components/dashboard/operations-clock-card"
import { AlertsCard } from "@/components/dashboard/alerts-card"
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card"
import { SimulationControls } from "@/components/dashboard/simulation-controls"
import { SystemInsights } from "@/components/dashboard/system-insights"
import { TelemetryTable } from "@/components/dashboard/telemetry-table"
import { FleetMap } from "@/components/map/fleet-map"
import { navigationItems, quickActions, sidebarStatus } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"
import { socket } from "@/lib/socket"

type ParticleConfig = {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  alpha: number
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function OmniRouteDashboard() {
  const { vehicles, alerts, updateSimulation, isRunning, speedMultiplier, updateVehicleFromSocket } = useAppStore()
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapRefreshKey, setMapRefreshKey] = useState(0)
  const [focusedVehicleId, setFocusedVehicleId] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false)
    }, 900)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    setCurrentTime(new Date())

    const interval = window.setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    let simInterval: number | undefined;
    if (isRunning) {
      simInterval = window.setInterval(() => {
        updateSimulation()
      }, 2000 / speedMultiplier)
    }

    return () => {
      window.clearInterval(interval)
      if (simInterval) window.clearInterval(simInterval)
    }
  }, [updateSimulation, isRunning, speedMultiplier])

  useEffect(() => {
    if (!socket) return;
    
    const onVehicleUpdate = (data: any) => {
      updateVehicleFromSocket(data);
    };
    
    socket.on('vehicle:update', onVehicleUpdate);
    
    return () => {
      socket?.off('vehicle:update', onVehicleUpdate);
    }
  }, [updateVehicleFromSocket])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const context = canvas.getContext("2d")
    if (!context) {
      return
    }

    let animationFrame = 0

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()

    const particles: ParticleConfig[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.3 + 0.15,
    }))

    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x > canvas.width) {
          particle.x = 0
        }
        if (particle.x < 0) {
          particle.x = canvas.width
        }
        if (particle.y > canvas.height) {
          particle.y = 0
        }
        if (particle.y < 0) {
          particle.y = canvas.height
        }

        context.fillStyle = `rgba(56, 189, 248, ${particle.alpha})`
        context.beginPath()
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fill()
      })

      animationFrame = window.requestAnimationFrame(render)
    }

    render()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  const activeVehicles = vehicles.filter((vehicle) => vehicle.status !== "Maintenance").length
  const shipmentLoads = vehicles.reduce((total, vehicle) => total + vehicle.shipments, 0)
  const reroutedTrucks = vehicles.filter((vehicle) => vehicle.reroute).length
  const systemHealth = 96

  return (
    <div
      className={`${theme} min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-30" />

      {isLoading && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="relative h-24 w-24">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border-4 border-r-transparent border-b-transparent border-l-transparent border-t-cyan-500 animate-spin" />
              <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-b-transparent border-l-transparent border-r-blue-500 animate-spin" />
              <div className="absolute inset-6 rounded-full border-4 border-t-transparent border-r-transparent border-l-transparent border-b-emerald-500 animate-spin" />
            </div>
            <div className="mt-4 text-cyan-500 font-mono text-sm tracking-wider">SYNCING ROUTE OPS</div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 relative z-10">
        <DashboardHeader theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <DashboardSidebar navigationItems={navigationItems} statusItems={sidebarStatus} />
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-7">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <OverviewMetricCard
                  title="Active Trucks"
                  value={String(activeVehicles)}
                  detail="Heavy shipment vehicles reporting live"
                  icon={Truck}
                  tone="cyan"
                  trend={`${vehicles.length - activeVehicles} in depot or service`}
                />
                <OverviewMetricCard
                  title="Shipment Loads"
                  value={String(shipmentLoads)}
                  detail="Truck loads assigned across corridors"
                  icon={Package}
                  tone="blue"
                  trend="High-volume road freight active"
                />
                <OverviewMetricCard
                  title="Rerouted Trucks"
                  value={String(reroutedTrucks)}
                  detail="Diversions due to closures and advisories"
                  icon={AlertTriangle}
                  tone="amber"
                  trend="Delay, flood, and security impacts"
                />
                <OverviewMetricCard
                  title="System Health"
                  value={`${systemHealth}%`}
                  detail="Routing, telemetry, and ETA services"
                  icon={Shield}
                  tone="green"
                  trend="All critical services healthy"
                />
              </div>

              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-slate-700/50 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-cyan-500" />
                      Shipment Route Control
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/50 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse" />
                        LIVE
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400"
                        onClick={() => setMapRefreshKey((current) => current + 1)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[560px]">
                    <FleetMap key={mapRefreshKey} vehicles={focusedVehicleId ? vehicles.filter(v => v.id === focusedVehicleId) : vehicles} />
                  </div>
                </CardContent>
              </Card>

              <TelemetryTable vehicles={vehicles} focusedVehicleId={focusedVehicleId} onFocusVehicle={setFocusedVehicleId} />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-3">
            <div className="grid gap-6">
              <OperationsClockCard
                currentTime={currentTime}
                formattedTime={currentTime ? formatTime(currentTime) : ""}
                formattedDate={currentTime ? formatDate(currentTime) : ""}
              />
              <SimulationControls />
              <SystemInsights />
              <AlertsCard alerts={alerts} />
              <QuickActionsCard actions={quickActions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
