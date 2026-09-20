"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", sales: 320 },
  { month: "Feb", sales: 480 },
  { month: "Mar", sales: 610 },
  { month: "Apr", sales: 540 },
  { month: "May", sales: 720 },
  { month: "Jun", sales: 890 },
  { month: "Jul", sales: 1050 },
  { month: "Aug", sales: 1200 },
  { month: "Sep", sales: 1450 },
  { month: "Oct", sales: 980 },
  { month: "Nov", sales: 760 },
  { month: "Dec", sales: 540 },
];

export default function VendorMonthlyChart() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-slate-800">Monthly sales</h2>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00C9A7" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickFormatter={(value: number) => `$${value}`}
            domain={[0, 1600]}
            ticks={[0, 400, 800, 1200, 1600]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [`$${value}`, "Sales"]}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#00C9A7"
            strokeWidth={2}
            fill="url(#salesGradient)"
            dot={{ r: 3, fill: "#00C9A7", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
