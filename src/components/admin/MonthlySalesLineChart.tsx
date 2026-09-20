/**
 * @file MonthlySalesLineChart component.
 * Recharts line chart showing monthly sales trend (Jan – Dec).
 *
 * @param data - Array of `{ month, sales }` points from Supabase or mocks.
 */
"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { MonthlySalesPoint } from "@/types/dashboard";

export default function MonthlySalesLineChart({ data }: { data: MonthlySalesPoint[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700">
        Monthly Sales (Jan - Dec)
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
