"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { name: "Active Sales", value: 7, color: "#00C9A7" },
  { name: "Completed Sales", value: 8, color: "#6C5CE7" },
];

export default function VendorSalesChart() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-slate-800">Sales</h2>
      {/* Legend */}
      <div className="mb-2 flex gap-4 text-xs text-slate-500">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span>{d.name}</span>
            <span className="font-semibold text-slate-700">({d.value})</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Tooltip />
          <Legend layout="horizontal" verticalAlign="bottom" height={30} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
