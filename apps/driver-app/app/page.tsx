"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [vehicleId, setVehicleId] = useState("");
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (vehicleId.trim()) {
      router.push(`/${vehicleId}`);
    }
  };

  return (
    <div style={{
      height: '100vh', width: '100vw',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#030712',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{
        background: '#0f172a',
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid #1e293b',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '24px', justifyContent: 'center' }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, boxShadow: '0 4px 12px rgba(37,99,235,0.4)'
          }}>🚛</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#f1f5f9', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>
              OmniRoute
            </div>
            <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, lineHeight: 1.4 }}>
              Driver Portal
            </div>
          </div>
        </div>

        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
              Enter Vehicle ID
            </label>
            <input 
              type="text" 
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              placeholder="e.g. OR-TRK-123"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
                outline: 'none'
              }}
            />
          </div>
          <button 
            type="submit"
            style={{
              padding: '12px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
              marginTop: '8px'
            }}
          >
            Start Driving
          </button>
        </form>
      </div>
    </div>
  );
}
