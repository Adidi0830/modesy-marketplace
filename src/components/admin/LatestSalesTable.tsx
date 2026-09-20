/**
 * @file LatestSalesTable component.
 * A compact, responsive table listing the most recent sales orders with
 * columns: Id, Status (order), Payment status, Date, and a Details action.
 *
 * @param sales - Array of latest-sale records (Supabase or mock).
 */
import { Eye } from "lucide-react";
import type { LatestSale } from "@/types/dashboard";

export default function LatestSalesTable({ sales }: { sales: LatestSale[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Latest Sales</h3>
        <a
          href="/admin/sales"
          className="text-xs text-blue-600 hover:underline"
        >
          View All
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-xs">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="pb-2 font-medium">Id Sales</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Payment</th>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 text-center font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <SaleRow key={s.id} sale={s} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SaleRow({ sale }: { sale: LatestSale }) {
  return (
    <tr className="border-t border-gray-100 align-top">
      <td className="py-2 font-mono text-gray-800">{sale.id}</td>
      <td className="py-2">
        <StatusPill status={sale.orderStatus} />
      </td>
      <td className="py-2 capitalize">{sale.paymentStatus}</td>
      <td className="py-2 text-gray-600">{formatDate(sale.date)}</td>
      <td className="py-2 text-center">
        <button
          className="rounded p-1 text-blue-600 hover:bg-gray-100"
          aria-label={`View sale ${sale.id}`}
        >
          <Eye size={14} />
        </button>
      </td>
    </tr>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
        map[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
