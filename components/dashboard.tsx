"use client"

import { useDashboardState } from "@/lib/dashboard-state"
import { DashboardHeader } from "@/components/dashboard-header"
import { AgentGrid } from "@/components/agent-card"
import { TransactionFeed } from "@/components/transaction-feed"
import { CycleChart } from "@/components/cycle-chart"
import { StatusBar } from "@/components/status-bar"
import { SwarmTopology } from "@/components/swarm-topology"

export default function Dashboard() {
  const { cycle, agents, transactions, cycleHistory, totalVolume, totalProfit, blockHeight, mounted } =
    useDashboardState()

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neon-green border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-neon-green neon-text-green animate-flicker">
            Initializing Swarm
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader cycle={cycle} totalVolume={totalVolume} totalProfit={totalProfit} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <AgentGrid agents={agents} />
            <SwarmTopology agents={agents} />
          </div>
          <div className="space-y-6 lg:col-span-7">
            <CycleChart data={cycleHistory} />
            <TransactionFeed transactions={transactions} />
          </div>
        </div>
      </main>
      <StatusBar blockHeight={blockHeight} agentCount={agents.filter(a => a.status !== "IDLE").length} cycle={cycle} />
    </div>
  )
}
