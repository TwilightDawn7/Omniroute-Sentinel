"use client";

import { useState, useEffect } from "react";

interface City { key: string; name: string; }

interface RouteSelectorProps {
  onRouteSelect: (origin: string, destination: string) => void;
  currentOrigin: string;
  currentDestination: string;
  isLoading: boolean;
}

export default function RouteSelector({ onRouteSelect, currentOrigin, currentDestination, isLoading }: RouteSelectorProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [origin, setOrigin] = useState(currentOrigin);
  const [destination, setDestination] = useState(currentDestination);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch("/api/cities").then(r => r.json()).then(j => setCities(j.data));
  }, []);

  useEffect(() => {
    setOrigin(currentOrigin);
    setDestination(currentDestination);
  }, [currentOrigin, currentDestination]);

  const swap = () => { setOrigin(destination); setDestination(origin); };

  const apply = () => {
    if (origin === destination) return;
    onRouteSelect(origin, destination);
    setExpanded(false);
  };

  const originCity = cities.find(c => c.key === origin);
  const destCity = cities.find(c => c.key === destination);

  const selectStyle: React.CSSProperties = {
    width: '100%',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: 10,
    padding: '10px 36px 10px 36px',
    fontSize: 13,
    color: '#f1f5f9',
    appearance: 'none' as const,
    cursor: 'pointer',
    outline: 'none',
  };

  return (
    <div style={{
      position: 'absolute', top: 16,
      left: '50%', transform: 'translateX(-50%)',
      zIndex: 1000, width: '100%', maxWidth: 420, padding: '0 16px'
    }}>
      {/* Collapsed pill */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(15,23,42,0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid #334155',
            borderRadius: 20, padding: '10px 16px',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#475569')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
        >
          <span style={{ fontSize: 14 }}>🧭</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', flexShrink: 0 }}>
            {originCity?.name || '...'}
          </span>
          <span style={{ color: '#334155', fontSize: 13 }}>→</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24', flex: 1, textAlign: 'left' }}>
            {destCity?.name || '...'}
          </span>
          <span style={{ fontSize: 11, color: '#475569' }}>▼</span>
        </button>
      )}

      {/* Expanded panel */}
      {expanded && (
        <div style={{
          background: 'rgba(15,23,42,0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid #334155',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          animation: 'fadeUp 0.2s ease-out'
        }}>
          {/* Panel header */}
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid #1e293b',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Set Route
            </span>
            <button
              onClick={() => setExpanded(false)}
              style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px' }}
            >
              ×
            </button>
          </div>

          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Origin */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
                Pickup Point
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' }}>📍</span>
                <select value={origin} onChange={e => setOrigin(e.target.value)} style={selectStyle}>
                  {cities.map(c => (
                    <option key={c.key} value={c.key} disabled={c.key === destination} style={{ background: '#0f172a' }}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#475569', pointerEvents: 'none' }}>▼</span>
              </div>
            </div>

            {/* Swap */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: '#1e293b' }} />
              <button
                onClick={swap}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 20,
                  background: '#1e293b', border: '1px solid #334155',
                  color: '#64748b', fontSize: 11, cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#334155'; e.currentTarget.style.color = '#f1f5f9'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#64748b'; }}
              >
                ⇅ Swap
              </button>
              <div style={{ flex: 1, height: 1, background: '#1e293b' }} />
            </div>

            {/* Destination */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                Destination
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' }}>🏁</span>
                <select value={destination} onChange={e => setDestination(e.target.value)} style={selectStyle}>
                  {cities.map(c => (
                    <option key={c.key} value={c.key} disabled={c.key === origin} style={{ background: '#0f172a' }}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#475569', pointerEvents: 'none' }}>▼</span>
              </div>
            </div>

            {/* Error */}
            {origin === destination && (
              <p style={{ fontSize: 11, color: '#f87171', textAlign: 'center', margin: 0 }}>
                Origin and destination must be different
              </p>
            )}

            {/* Start button */}
            <button
              onClick={apply}
              disabled={origin === destination || isLoading}
              style={{
                width: '100%', padding: '11px',
                background: origin === destination || isLoading ? '#1e293b' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: origin === destination || isLoading ? '#475569' : 'white',
                border: 'none', borderRadius: 10,
                fontSize: 13, fontWeight: 700, cursor: origin === destination || isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: origin === destination || isLoading ? 'none' : '0 4px 20px rgba(37,99,235,0.4)',
                transition: 'all 0.15s'
              }}
            >
              {isLoading ? '⟳ Calculating...' : '🧭 Start Route'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}