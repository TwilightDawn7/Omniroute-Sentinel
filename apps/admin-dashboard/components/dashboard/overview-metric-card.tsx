import { BarChart3, LineChart, type LucideIcon } from "lucide-react"

type MetricTone = "cyan" | "blue" | "green" | "amber"

const toneStyles: Record<
  MetricTone,
  {
    borderClass: string
    iconClass: string
    glowClass: string
    trendIcon: LucideIcon
    trendClass: string
  }
> = {
  cyan: {
    borderClass: "border-cyan-500/30",
    iconClass: "text-cyan-500",
    glowClass: "from-cyan-500 to-blue-500",
    trendIcon: BarChart3,
    trendClass: "text-cyan-400",
  },
  blue: {
    borderClass: "border-blue-500/30",
    iconClass: "text-blue-500",
    glowClass: "from-blue-500 to-indigo-500",
    trendIcon: LineChart,
    trendClass: "text-blue-400",
  },
  green: {
    borderClass: "border-green-500/30",
    iconClass: "text-green-500",
    glowClass: "from-green-500 to-emerald-500",
    trendIcon: LineChart,
    trendClass: "text-green-400",
  },
  amber: {
    borderClass: "border-amber-500/30",
    iconClass: "text-amber-500",
    glowClass: "from-amber-500 to-orange-500",
    trendIcon: BarChart3,
    trendClass: "text-amber-400",
  },
}

export function OverviewMetricCard({
  title,
  value,
  detail,
  icon: Icon,
  tone,
  trend,
}: {
  title: string
  value: string
  detail: string
  icon: LucideIcon
  tone: MetricTone
  trend: string
}) {
  const style = toneStyles[tone]
  const TrendIcon = style.trendIcon

  return (
    <div className={`bg-slate-800/50 rounded-lg border ${style.borderClass} p-4 relative overflow-hidden h-full min-h-[156px] flex flex-col`}>
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-slate-400">{title}</div>
          <Icon className={`h-5 w-5 ${style.iconClass}`} />
        </div>
        <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300">
          {value}
        </div>
        <div className="text-xs leading-5 text-slate-500 max-w-[18ch]">{detail}</div>
      </div>

      <div className={`mt-auto pt-4 flex items-start gap-1 text-[11px] leading-4 ${style.trendClass}`}>
        <TrendIcon className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <span className="max-w-[18ch]">{trend}</span>
      </div>

      <div className={`absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl ${style.glowClass}`} />
    </div>
  )
}
