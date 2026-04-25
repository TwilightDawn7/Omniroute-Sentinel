"use client"

import { useEffect, useState } from "react"

import { Card, CardContent } from "@/components/ui/card"

export function OperationsClockCard({
  currentTime,
  formattedTime,
  formattedDate,
}: {
  currentTime: Date | null
  formattedTime: string
  formattedDate: string
}) {
  const [timezone, setTimezone] = useState("Local")

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  const nextWave = currentTime
    ? new Date(currentTime.getTime() + 15 * 60 * 1000).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--"

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1 font-mono">DISPATCH CLOCK</div>
            <div className="text-3xl font-mono text-cyan-400 mb-1">{formattedTime || "--:--:--"}</div>
            <div className="text-sm text-slate-400">{formattedDate || "--- --, ----"}</div>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
              <div className="text-xs text-slate-500 mb-1">Time Zone</div>
              <div className="text-sm font-mono text-slate-200">{timezone}</div>
            </div>
            <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
              <div className="text-xs text-slate-500 mb-1">Next Wave</div>
              <div className="text-sm font-mono text-slate-200">{nextWave}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
