'use client';

import { useEffect, useState } from 'react';

export default function SymbioMarketDashboard() {
  const [data, setData] = useState({
    cycles: [],
    payments: [],
    agents: {
      Oracle: { status: "active", color: "#00ff9f" },
      Strategist: { status: "active", color: "#00bfff" },
      Executor: { status: "active", color: "#ff00ff" },
      Evaluator: { status: "thinking", color: "#ffd700" }
    }
  });

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const res = await fetch('http://localhost:8000/swarm_data.json');
        if (res.ok) {
          const liveData = await res.json();
          setData(liveData);
        }
      } catch (e) {
        console.log("Connecting to swarm...");
      }
    };

    fetchRealData();
    const interval = setInterval(fetchRealData, 3000); // update every 3s

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#0a0a0a', color: '#00ff9f', minHeight: '100vh' }}>
      <h1>🦠 SymbioMarket — Live Swarm on Arc</h1>
      <p>Self-evolving agents • Real USDC nanopayments • Arc Testnet</p>

      {/* Agents */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {Object.entries(data.agents).map(([name, info]) => (
          <div key={name} style={{ padding: '1rem', background: '#111', borderLeft: `5px solid ${info.color}`, borderRadius: '8px' }}>
            <strong style={{ fontSize: '1.2rem' }}>{name}</strong>
            <div style={{ color: info.color, marginTop: '8px' }}>● {info.status.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Payments Feed */}
      <div style={{ marginTop: '3rem' }}>
        <h2>💸 Live Nanopayments</h2>
        <div style={{ maxHeight: '500px', overflowY: 'auto', background: '#111', padding: '1rem', borderRadius: '8px' }}>
          {data.payments.map((p, i) => (
            <div key={i} style={{ padding: '12px', marginBottom: '8px', background: '#1a1a1a', borderRadius: '6px' }}>
              💸 {p.from} → {p.to} | ${p.amount} USDC @ {p.time}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid #00ff9f', borderRadius: '8px', textAlign: 'center' }}>
        Status: Swarm Running • Evolution Active • Agents Paying Each Other on Arc
      </div>
    </div>
  );
}
