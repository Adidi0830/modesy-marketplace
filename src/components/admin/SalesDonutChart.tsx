/**
 * @file SalesDonutChart component.
 * A Recharts donut chart visualizing Active vs Completed sales segments.
 * Data is fetched dynamically from Supabase with mock fallbacks handled
 * by `dashboard-data`.
 *
 * @param data - Array of donut segments (name/value/color).
 */
"use client";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import type { DonutValue } from "@/types/dashboard";

/** Mock data used until Supabase returns values. */
const defaultData: DonutValue[] = [
  { name: "Active Sales", value: 12, color: "#3b82f6" },
  { name: "Completed Sales", value: 38, color: "#10b981" },
];

export default function SalesDonutChart({ data = defaultData }: { data?: DonutValue[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700">Sales</h2>
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
