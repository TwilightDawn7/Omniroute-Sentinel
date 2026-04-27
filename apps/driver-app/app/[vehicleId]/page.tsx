"use client";

import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import { useRouteData } from "@/hooks/useRouteData";
import AlertPanel from "@/components/alerts/AlertPanel";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

const DriverMap = dynamic(() => import("@/components/map/DriverMap"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#030712'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 44, height: 44,
          border: '3px solid #1e40af',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 12px'
        }} />
        <p style={{ color: '#64748b', fontSize: 13 }}>Initializing map...</p>
      </div>
    </div>
  ),
});

const statusColors: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  "on-route":  { bg: '#0c1a3a', text: '#60a5fa', dot: '#3b82f6', label: 'ON ROUTE' },
  "rerouting": { bg: '#2a1a00', text: '#fbbf24', dot: '#f59e0b', label: 'REROUTING' },
  "delayed":   { bg: '#2a1200', text: '#fb923c', dot: '#f97316', label: 'DELAYED' },
  "arrived":   { bg: '#052e16', text: '#4ade80', dot: '#22c55e', label: 'ARRIVED' },
};

export default function DriverPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const vehicleId = (params?.vehicleId as string) || "UNKNOWN";
  
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // If passed via URL (legacy support)
    const urlOrigin = searchParams?.get("origin");
    const urlDest = searchParams?.get("destination");
    
    if (urlOrigin && urlDest) {
      setVehicleData({ 
        origin: urlOrigin, 
        destination: urlDest, 
        lat: 28.6139, 
        lng: 77.2090, 
        route: [] 
      });
      return;
    }

    if (!socket) return;

    socket.emit('vehicle:request_info', vehicleId);
    
    const handleInfo = (data: any) => {
      if (data.vehicleId === vehicleId) {
        if (data.notFound) {
           setErrorMsg(data.error || "Vehicle not found in active fleet");
        } else {
           setVehicleData(data);
        }
      }
    };

    socket.on('vehicle:info', handleInfo);

    return () => {
      socket?.off('vehicle:info', handleInfo);
    };
  }, [vehicleId, searchParams]);

  const { routeData, alerts, loading, error: routeError, lastRefreshed, refresh } =
    useRouteData(vehicleData, vehicleId);

  const error = errorMsg || routeError;

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const status = routeData?.status || "on-route";
  const sc = statusColors[status] || statusColors["on-route"];

  // Show a loading screen until the socket returns the vehicle origin and destination
  if (!vehicleData && !errorMsg) {
    return (
      <div style={{
        height: '100vh', width: '100vw', background: '#030712',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, border: '3px solid #1e40af', borderTopColor: '#3b82f6',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px'
          }} />
          <p style={{ color: '#64748b', fontSize: 13 }}>Fetching vehicle manifest from server...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh', width: '100vw',
      display: 'flex', flexDirection: 'column',
      background: '#030712', overflow: 'hidden',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>

      {/* ── Header ── */}
      <header style={{
        flexShrink: 0, height: 56,
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        display: 'flex', alignItems: 'center',
        padding: '0 16px', gap: 16,
        zIndex: 50
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, boxShadow: '0 4px 12px rgba(37,99,235,0.4)'
          }}>🚛</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#f1f5f9', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>
              OmniRoute
            </div>
            <div style={{ fontSize: 10, color: '#3b82f6', fontWeight: 600, lineHeight: 1.4 }}>
              Driver Mode
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: '#1e293b', flexShrink: 0 }} />

        {/* Route info */}
        {routeData && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
              <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, flexShrink: 0 }}>🚛</span>
              <span style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Vehicle: {vehicleId}
              </span>
            </div>

            {/* Status badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 20,
              background: sc.bg, flexShrink: 0
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: sc.dot,
                animation: status === 'rerouting' ? 'pulse-slow 1.5s ease-in-out infinite' : 'none'
              }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: sc.text, letterSpacing: '0.08em' }}>
                {sc.label}
              </span>
            </div>

            {/* ETA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 12, flexShrink: 0 }}>
              <span>⏱</span>
              <span>ETA: {routeData.reroutedRoute
                ? `${routeData.reroutedRoute.estimatedTime} min`
                : `${routeData.currentRoute.estimatedTime} min`}
              </span>
            </div>

            {/* Distance */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 12, flexShrink: 0 }}>
              <span>📏</span>
              <span>{routeData.reroutedRoute
                ? routeData.reroutedRoute.distance
                : routeData.currentRoute.distance} km
              </span>
            </div>
          </div>
        )}

        {/* Right side actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto', flexShrink: 0 }}>
          {criticalCount > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 20,
              background: 'rgba(153,27,27,0.3)',
              border: '1px solid rgba(239,68,68,0.3)'
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'pulse-slow 1s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#f87171' }}>
                {criticalCount} Critical
              </span>
            </div>
          )}

          <button
            onClick={refresh}
            title="Refresh"
            style={{
              width: 32, height: 32,
              background: 'transparent',
              border: '1px solid #1e293b',
              borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#64748b', fontSize: 14,
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.background = '#1e293b';
              (e.target as HTMLElement).style.color = '#f1f5f9';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.background = 'transparent';
              (e.target as HTMLElement).style.color = '#64748b';
            }}
          >
            ↻
          </button>
        </div>
      </header>

      {/* ── Error Banner ── */}
      {error && (
        <div style={{
          flexShrink: 0, background: 'rgba(127,29,29,0.4)',
          borderBottom: '1px solid rgba(239,68,68,0.3)',
          padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8
        }}>
          <span style={{ color: '#f87171', fontSize: 12 }}>⚠ {error}</span>
        </div>
      )}

      {/* ── Rerouting Banner ── */}
      {routeData?.status === "rerouting" && (
        <div style={{
          flexShrink: 0,
          background: 'linear-gradient(90deg, rgba(120,53,15,0.5), rgba(92,40,10,0.3))',
          borderBottom: '1px solid rgba(245,158,11,0.25)',
          padding: '8px 16px',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fbbf24', animation: 'pulse-slow 1s ease-in-out infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              ⚡ AI Rerouting Active
            </span>
          </div>
          <span style={{ fontSize: 12, color: '#fcd34d' }}>
            Route blocked — alternate via <strong>{routeData.reroutedRoute?.name}</strong> is now active.
            Extra time: ~{routeData.reroutedRoute
              ? routeData.reroutedRoute.estimatedTime - routeData.currentRoute.estimatedTime
              : 35} min
          </span>
        </div>
      )}

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* Map area */}
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          {loading && !routeData ? (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#030712'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 44, height: 44,
                  border: '3px solid #1e3a8a',
                  borderTopColor: '#3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto 12px'
                }} />
                <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>Fetching route...</p>
              </div>
            </div>
          ) : routeData ? (
            <DriverMap routeData={routeData} />
          ) : null}

          {/* Route Selector removed */}

          {/* Map Legend */}
          {routeData && (
            <div style={{
              position: 'absolute', bottom: 24, left: 16,
              background: 'rgba(15,23,42,0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid #1e293b',
              borderRadius: 14, padding: '12px 14px',
              zIndex: 1000,
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px 0' }}>
                Legend
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <LegendItem color="#60a5fa" label="Current Route" type="line" />
                {routeData.reroutedRoute && (
                  <>
                    <LegendItem color="#ef4444" label="Blocked Route" type="dashed" />
                    <LegendItem color="#4ade80" label="Safe Reroute" type="line" />
                  </>
                )}
                {routeData.blockedZones.length > 0 && (
                  <LegendItem color="#ef4444" label="Blocked Zone" type="circle" />
                )}
                <LegendItem color="#3b82f6" label="Your Location" type="dot" />
              </div>
            </div>
          )}

          {/* Stats overlay */}
          {routeData && (
            <div style={{
              position: 'absolute', bottom: 24, right: 16,
              background: 'rgba(15,23,42,0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid #1e293b',
              borderRadius: 14, padding: '12px 16px',
              zIndex: 1000,
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              display: 'flex', gap: 20
            }}>
              <StatItem label="Distance" value={`${routeData.reroutedRoute ? routeData.reroutedRoute.distance : routeData.currentRoute.distance} km`} />
              <StatItem label="ETA" value={`${routeData.reroutedRoute ? routeData.reroutedRoute.estimatedTime : routeData.currentRoute.estimatedTime} min`} />
              <StatItem label="Status" value={sc.label} color={sc.text} />
            </div>
          )}
        </div>

        {/* Alert Panel */}
        <AlertPanel
          alerts={alerts}
          loading={loading}
          error={error}
          lastRefreshed={lastRefreshed}
        />
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

function LegendItem({ color, label, type }: { color: string; label: string; type: 'line' | 'dashed' | 'circle' | 'dot' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {type === 'line' && <div style={{ width: 22, height: 2, background: color, borderRadius: 2 }} />}
      {type === 'dashed' && (
        <div style={{ width: 22, height: 2, background: `repeating-linear-gradient(90deg, ${color} 0, ${color} 4px, transparent 4px, transparent 8px)` }} />
      )}
      {type === 'circle' && (
        <div style={{ width: 12, height: 12, borderRadius: '50%', border: `2px solid ${color}`, background: `${color}22` }} />
      )}
      {type === 'dot' && (
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
      )}
      <span style={{ fontSize: 11, color: '#94a3b8' }}>{label}</span>
    </div>
  );
}

function StatItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: color || '#f1f5f9' }}>{value}</div>
    </div>
  );
}