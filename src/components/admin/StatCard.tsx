/**
 * @file StatCard component.
 * A small metric tile showing a label, value, optional trend indicator,
 * and a leading icon. Used in the dashboard summary row.
 *
 * @param props.label - Human-readable metric name.
 * @param props.value - Primary displayed value (number or string).
 * @param props.icon  - Leading icon element.
 * @param props.change - Optional trend text (e.g. "+12%").
 * @param props.changePositive - true=green, false=red.
 */
import type { StatCardProps } from "@/types/dashboard";

export default function StatCard({
  label,
  value,
  icon,
  change,
  changePositive = true,
}: StatCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-blue-600">{icon}</span>
        <div>
          <p className="text-xs uppercase text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
      {change && (
        <p
          className={`mt-1 text-xs ${
            changePositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {change}
        </p>
      )}
    </div>
  );
}
