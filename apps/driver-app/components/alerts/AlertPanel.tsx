"use client";

import { Alert } from "@/types";
import { formatDistanceToNow } from "date-fns";

const severityStyle: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  low:      { bg: '#052e16', text: '#4ade80', dot: '#22c55e', border: '#14532d' },
  medium:   { bg: '#422006', text: '#fb923c', dot: '#f97316', border: '#7c2d12' },
  high:     { bg: '#431407', text: '#fca5a5', dot: '#ef4444', border: '#7f1d1d' },
  critical: { bg: '#3b0000', text: '#ff6b6b', dot: '#ef4444', border: '#991b1b' },
};

const typeEmoji: Record<string, string> = {
  weather: '🌧',
  traffic: '🚦',
  port: '⚓',
  geopolitical: '🌍',
  accident: '🚨',
};

interface AlertPanelProps {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  lastRefreshed: Date | null;
}

export default function AlertPanel({ alerts, loading, error, lastRefreshed }: AlertPanelProps) {
  const critical = alerts.filter(a => a.severity === 'critical');
  const others = alerts.filter(a => a.severity !== 'critical');
  const unread = alerts.filter(a => !a.isRead).length;

  return (
    <div style={{
      width: 320, flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      background: '#0a0f1e',
      borderLeft: '1px solid #1e293b',
      height: '100%',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>

      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid #1e293b',
        background: '#0f172a',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 16 }}>⚡</div>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Live Alerts
            </span>
            {unread > 0 && (
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: '#3b82f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: 'white'
              }}>
                {unread}
              </div>
            )}
          </div>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: error ? '#ef4444' : '#22c55e',
            boxShadow: `0 0 8px ${error ? '#ef4444' : '#22c55e'}`
          }} />
        </div>

        {/* Last updated */}
        <div style={{ fontSize: 11, color: '#475569', marginBottom: 10 }}>
          {lastRefreshed
            ? `Updated ${formatDistanceToNow(lastRefreshed, { addSuffix: true })}`
            : 'Loading...'}
        </div>

        {/* Counts */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            padding: '3px 10px', borderRadius: 20,
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.25)',
            fontSize: 11, fontWeight: 700, color: '#f87171'
          }}>
            {critical.length} Critical
          </div>
          <div style={{
            padding: '3px 10px', borderRadius: 20,
            background: '#1e293b',
            border: '1px solid #334155',
            fontSize: 11, fontWeight: 700, color: '#64748b'
          }}>
            {others.length} Other
          </div>
        </div>
      </div>

      {/* Alerts list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading && (
          <div style={{ padding: 16 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ height: 12, background: '#1e293b', borderRadius: 4, width: '70%', marginBottom: 8 }} />
                <div style={{ height: 10, background: '#1e293b', borderRadius: 4, width: '100%', marginBottom: 6 }} />
                <div style={{ height: 10, background: '#1e293b', borderRadius: 4, width: '60%' }} />
              </div>
            ))}
          </div>
        )}

        {!loading && alerts.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            <p style={{ color: '#475569', fontSize: 13 }}>All clear. No active alerts.</p>
          </div>
        )}

        {!loading && alerts.map((alert, idx) => {
          const ss = severityStyle[alert.severity] || severityStyle.low;
          const isCritical = alert.severity === 'critical';

          return (
            <div
              key={alert.id}
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid #0f172a',
                borderLeft: isCritical ? '3px solid #ef4444' : alert.affectsRoute ? '3px solid #f97316' : '3px solid transparent',
                background: isCritical
                  ? 'rgba(127,29,29,0.2)'
                  : alert.affectsRoute
                  ? 'rgba(120,53,15,0.15)'
                  : 'transparent',
                animation: `slideInRight 0.3s ease-out ${idx * 0.05}s both`,
              }}
            >
              <div style={{ display: 'flex', gap: 10 }}>
                {/* Icon */}
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: ss.bg,
                  border: `1px solid ${ss.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, flexShrink: 0
                }}>
                  {typeEmoji[alert.type] || '⚠️'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Title row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3, margin: 0 }}>
                      {alert.title}
                    </p>
                    {!alert.isRead && (
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: 3 }} />
                    )}
                  </div>

                  {/* Message */}
                  <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, margin: '0 0 8px 0' }}>
                    {alert.message}
                  </p>

                  {/* Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '2px 8px', borderRadius: 20,
                      background: ss.bg, border: `1px solid ${ss.border}`,
                      fontSize: 10, fontWeight: 700, color: ss.text, textTransform: 'uppercase', letterSpacing: '0.06em'
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: ss.dot }} />
                      {alert.severity}
                    </span>

                    {alert.affectsRoute && (
                      <span style={{
                        padding: '2px 8px', borderRadius: 20,
                        background: 'rgba(37,99,235,0.2)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        fontSize: 10, fontWeight: 600, color: '#60a5fa'
                      }}>
                        Affects Route
                      </span>
                    )}
                  </div>

                  {/* Location + time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#475569' }}>
                    <span>📍 {alert.location}</span>
                    <span>·</span>
                    <span>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid #1e293b',
        background: '#0f172a',
        flexShrink: 0,
        textAlign: 'center'
      }}>
        <p style={{ fontSize: 10, color: '#334155', margin: 0 }}>
          Auto-refreshes every 30s · OmniRoute AI Engine
        </p>
      </div>
    </div>
  );
}