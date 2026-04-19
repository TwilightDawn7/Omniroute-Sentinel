"use client";

import { Navigation, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";

type Severity = "low" | "medium" | "high" | "critical";
type Status = "on-route" | "rerouting" | "delayed" | "arrived";

// Enhanced configuration with borders and glow effects
const severityConfig: Record<Severity, { bg: string; border: string; text: string; dot: string }> = {
  low: { 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/20", 
    text: "text-emerald-400", 
    dot: "bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]" 
  },
  medium: { 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/20", 
    text: "text-amber-400", 
    dot: "bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.8)]" 
  },
  high: { 
    bg: "bg-orange-500/10", 
    border: "border-orange-500/30", 
    text: "text-orange-400", 
    dot: "bg-orange-400 shadow-[0_0_5px_rgba(249,115,22,0.8)]" 
  },
  critical: { 
    bg: "bg-destructive/15", 
    border: "border-destructive/40", 
    text: "text-destructive", 
    dot: "bg-destructive animate-pulse shadow-[0_0_8px_rgba(var(--color-destructive),1)]" 
  },
};

const statusConfig: Record<Status, { bg: string; border: string; text: string; label: string; icon: any; animation?: string }> = {
  "on-route": { 
    bg: "bg-primary/10", 
    border: "border-primary/30", 
    text: "text-primary", 
    label: "ON ROUTE", 
    icon: Navigation 
  },
  rerouting: { 
    bg: "bg-amber-400/10", 
    border: "border-amber-400/40", 
    text: "text-amber-400", 
    label: "AI REROUTING", 
    icon: RefreshCw, 
    animation: "animate-pulse shadow-[0_0_15px_rgba(251,191,36,0.15)]" 
  },
  delayed: { 
    bg: "bg-orange-500/10", 
    border: "border-orange-500/30", 
    text: "text-orange-400", 
    label: "DELAYED", 
    icon: AlertTriangle 
  },
  arrived: { 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/30", 
    text: "text-emerald-400", 
    label: "ARRIVED", 
    icon: CheckCircle2 
  },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const cfg = severityConfig[severity];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-widest backdrop-blur-md transition-colors ${cfg.bg} ${cfg.border} ${cfg.text} ${severity === 'critical' ? 'shadow-[0_0_10px_rgba(var(--color-destructive),0.1)]' : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {severity}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-black uppercase tracking-widest backdrop-blur-md shadow-inner ${cfg.bg} ${cfg.border} ${cfg.text} ${cfg.animation || ''}`}>
      <Icon className={`w-3.5 h-3.5 ${status === 'rerouting' ? 'animate-spin' : ''}`} />
      {cfg.label}
    </span>
  );
}