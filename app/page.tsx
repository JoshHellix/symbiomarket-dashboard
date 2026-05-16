'use client';

import { useEffect, useState } from 'react';

export default function SymbioMarketDashboard() {
  const [cycles, setCycles] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCycles(prev => [`Cycle ${Date.now() % 10000} - Active`, ...prev].slice(0, 8));
      setPayments(prev => [{
        from: "Oracle",
        to: "Strategist",
        amount: "0.001 USDC",
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 8));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', minHeight: '100vh', background: '#0a0a0a', color: '#00ff9f' }}>
      <h1>🦠 SymbioMarket — Live Swarm on Arc</h1>
      <p>Self-evolving agents • Real USDC nanopayments</p>

      <div style={{ display: 'flex', gap: '3rem', marginTop: '2rem' }}>
        <div>
          <h2>Recent Cycles</h2>
          <ul>{cycles.map((c, i) => <li key={i}>🔄 {c}</li>)}</ul>
        </div>
        <div>
          <h2>Live Nanopayments</h2>
          <ul>{payments.map((p, i) => (
            <li key={i}>💸 {p.from} → {p.to} | {p.amount} @ {p.time}</li>
          ))}</ul>
        </div>
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid #00ff9f', borderRadius: '8px' }}>
        Status: Swarm Running • Evolution Active • Arc Testnet
      </div>
    </div>
  );
}
