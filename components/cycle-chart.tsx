"use client"

import { BarChart3 } from "lucide-react"
import type { CycleData } from "@/lib/dashboard-state"

export function CycleChart({ data }: { data: CycleData[] }) {
  const maxProfit = Math.max(...data.map((d) => Math.abs(d.profit)), 0.5)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <BarChart3 className="h-3.5 w-3.5 text-neon-cyan" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">
          Cycle Performance
        </h2>
        <span className="ml-auto text-[10px] text-muted-foreground">
          Last {data.length} cycles
        </span>
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-border bg-card p-3 neon-border-green">
        {/* Y axis labels + bars */}
        <div className="flex items-end gap-0.5" style={{ height: 120 }}>
          {data.map((d, i) => {
            const height = (Math.abs(d.profit) / maxProfit) * 100
            const isPositive = d.profit >= 0
            return (
              <div key={d.cycle} className="group relative flex flex-1 flex-col items-center justify-end" style={{ height: "100%" }}>
                {/* Tooltip */}
                <div className="pointer-events-none absolute -top-10 left-1/2 z-10 hidden -translate-x-1/2 rounded border border-border bg-card px-2 py-1 text-[9px] shadow-lg group-hover:block">
                  <p className="text-foreground">C#{d.cycle}</p>
                  <p className={isPositive ? "text-neon-green" : "text-destructive"}>
                    {isPositive ? "+" : ""}{d.profit} ARC
                  </p>
                  <p className="text-muted-foreground">{d.trades} trades</p>
                </div>
                <div
                  className={`w-full rounded-sm transition-all duration-500 ${
                    isPositive
                      ? "bg-neon-green/60 group-hover:bg-neon-green"
                      : "bg-destructive/60 group-hover:bg-destructive"
                  }`}
                  style={{ height: `${Math.max(height, 3)}%` }}
                />
              </div>
            )
          })}
        </div>

        {/* X axis */}
        <div className="mt-1 flex gap-0.5">
          {data.map((d, i) => (
            <div key={d.cycle} className="flex-1 text-center">
              {i % 5 === 0 && (
                <span className="text-[8px] text-muted-foreground">#{d.cycle}</span>
              )}
            </div>
          ))}
        </div>

        {/* Summary row */}
        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-[10px]">
          <div>
            <span className="text-muted-foreground">AVG PROFIT </span>
            <span className="font-bold text-neon-green">
              +{(data.reduce((s, d) => s + d.profit, 0) / data.length).toFixed(3)} ARC
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">TOTAL TRADES </span>
            <span className="font-bold text-foreground">
              {data.reduce((s, d) => s + d.trades, 0)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">WIN RATE </span>
            <span className="font-bold text-neon-green">
              {((data.filter((d) => d.profit > 0).length / data.length) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
