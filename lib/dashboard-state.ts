"use client"

import { useState, useEffect, useCallback, useRef } from "react"

// --- Types ---
export type AgentName = "Oracle" | "Strategist" | "Executor" | "Evaluator"
export type AgentStatus = "ACTIVE" | "PROCESSING" | "IDLE" | "SYNCING"

export interface Agent {
  name: AgentName
  status: AgentStatus
  role: string
  uptime: string
  tasksCompleted: number
  accuracy: number
  latency: number
}

export interface Transaction {
  id: string
  from: AgentName
  to: AgentName
  amount: number
  purpose: string
  timestamp: Date
  status: "confirmed" | "pending"
}

export interface CycleData {
  cycle: number
  profit: number
  trades: number
  agents: number
  timestamp: Date
}

// --- Helpers ---
const agentRoles: Record<AgentName, string> = {
  Oracle: "DATA_AGGREGATOR",
  Strategist: "SIGNAL_PROCESSOR",
  Executor: "TRADE_EXECUTOR",
  Evaluator: "RISK_ASSESSOR",
}

const purposes = [
  "signal_feed",
  "strategy_relay",
  "execution_conf",
  "risk_eval",
  "data_sync",
  "model_update",
  "market_scan",
  "position_adj",
]

const statusOptions: AgentStatus[] = ["ACTIVE", "PROCESSING", "IDLE", "SYNCING"]
const agentNames: AgentName[] = ["Oracle", "Strategist", "Executor", "Evaluator"]

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateTx(id: number): Transaction {
  const from = randomFrom(agentNames)
  const to = randomFrom(agentNames.filter((n) => n !== from))
  return {
    id: `TX-${String(id).padStart(6, "0")}`,
    from,
    to,
    amount: parseFloat((Math.random() * 0.05 + 0.001).toFixed(4)),
    purpose: randomFrom(purposes),
    timestamp: new Date(),
    status: Math.random() > 0.15 ? "confirmed" : "pending",
  }
}

// Deterministic initial values (safe for SSR)
const initialAgents: Agent[] = [
  { name: "Oracle", status: "ACTIVE", role: agentRoles.Oracle, uptime: "99.7%", tasksCompleted: 12847, accuracy: 97.3, latency: 12 },
  { name: "Strategist", status: "PROCESSING", role: agentRoles.Strategist, uptime: "98.9%", tasksCompleted: 8234, accuracy: 94.1, latency: 28 },
  { name: "Executor", status: "ACTIVE", role: agentRoles.Executor, uptime: "99.2%", tasksCompleted: 15692, accuracy: 99.8, latency: 3 },
  { name: "Evaluator", status: "SYNCING", role: agentRoles.Evaluator, uptime: "97.4%", tasksCompleted: 6103, accuracy: 92.6, latency: 45 },
]

function buildInitialCycleHistory(): CycleData[] {
  const data: CycleData[] = []
  for (let i = 0; i < 20; i++) {
    data.push({
      cycle: 828 + i,
      profit: parseFloat((Math.random() * 2 - 0.3).toFixed(3)),
      trades: Math.floor(Math.random() * 40 + 10),
      agents: 4,
      timestamp: new Date(Date.now() - (20 - i) * 3000),
    })
  }
  return data
}

function buildInitialTransactions(counter: { current: number }): Transaction[] {
  const txs: Transaction[] = []
  for (let i = 0; i < 15; i++) {
    txs.push(generateTx(counter.current++))
  }
  return txs
}

// --- Hook ---
export function useDashboardState() {
  const txCounter = useRef(1000)
  const [mounted, setMounted] = useState(false)
  const [cycle, setCycle] = useState(847)
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [cycleHistory, setCycleHistory] = useState<CycleData[]>([])
  const [totalVolume, setTotalVolume] = useState(2847.32)
  const [totalProfit, setTotalProfit] = useState(142.87)
  const [blockHeight, setBlockHeight] = useState(18_847_293)

  // Hydrate random state only on the client
  useEffect(() => {
    setTransactions(buildInitialTransactions(txCounter))
    setCycleHistory(buildInitialCycleHistory())
    setMounted(true)
  }, [])

  const tick = useCallback(() => {
    setCycle((c) => c + 1)

    setAgents((prev) =>
      prev.map((a) => ({
        ...a,
        status: Math.random() > 0.6 ? randomFrom(statusOptions) : a.status,
        tasksCompleted: a.tasksCompleted + Math.floor(Math.random() * 3),
        latency: Math.max(1, a.latency + Math.floor(Math.random() * 7 - 3)),
        accuracy: parseFloat(Math.min(99.9, Math.max(90, a.accuracy + (Math.random() * 0.4 - 0.2))).toFixed(1)),
      }))
    )

    const newTxs: Transaction[] = []
    const count = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < count; i++) {
      newTxs.push(generateTx(txCounter.current++))
    }
    setTransactions((prev) => [...newTxs, ...prev].slice(0, 50))

    setCycleHistory((prev) => {
      const profit = parseFloat((Math.random() * 2 - 0.3).toFixed(3))
      return [
        ...prev.slice(-19),
        {
          cycle: prev[prev.length - 1].cycle + 1,
          profit,
          trades: Math.floor(Math.random() * 40 + 10),
          agents: 4,
          timestamp: new Date(),
        },
      ]
    })

    setTotalVolume((v) => parseFloat((v + Math.random() * 5).toFixed(2)))
    setTotalProfit((p) => parseFloat((p + Math.random() * 1.2 - 0.1).toFixed(2)))
    setBlockHeight((h) => h + Math.floor(Math.random() * 3) + 1)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(tick, 2500)
    return () => clearInterval(interval)
  }, [tick, mounted])

  return { cycle, agents, transactions, cycleHistory, totalVolume, totalProfit, blockHeight, mounted }
}
