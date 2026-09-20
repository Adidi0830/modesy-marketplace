"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { VendorSale } from "@/types/vendor-dashboard";

interface VendorSalesTableProps {
  sales?: VendorSale[];
}

const sampleSales: VendorSale[] = [
  { id: "#10020", total: 194.70, status: "Processing", paymentStatus: "Pending Payment", date: "2026-09-11 / 09:26" },
  { id: "#10019", total: 174.40, status: "Processing", paymentStatus: "Payment Received", date: "2026-09-09 / 11:39" },
  { id: "#10018", total: 143.00, status: "Processing", paymentStatus: "Payment Received", date: "2026-09-09 / 05:59" },
  { id: "#10015", total: 105.50, status: "Completed", paymentStatus: "Payment Received", date: "2026-09-06 / 02:14" },
  { id: "#10014", total: 822.90, status: "Processing", paymentStatus: "Pending Payment", date: "2026-09-04 / 09:21" },
];

export default function VendorSalesTable({ sales = sampleSales }: VendorSalesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-xs">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="pb-2 font-medium">Sale</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Payment</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 text-center font-medium">Options</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <SaleRow key={s.id} sale={s} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href="/vendor/sales"
          className="w-full rounded-lg border border-slate-200 py-2 text-center text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          View All
        </Link>
      </CardFooter>
    </Card>
  );
}

function SaleRow({ sale }: { sale: VendorSale }) {
  return (
    <tr className="border-t border-slate-100">
      <td className="py-2 font-mono text-slate-700">{sale.id}</td>
      <td className="py-2">
        <Badge variant={sale.status === "Completed" ? "green" : "yellow"}>
          {sale.status}
        </Badge>
      </td>
      <td className="py-2">
        <Badge variant={sale.paymentStatus === "Payment Received" ? "green" : "yellow"}>
          {sale.paymentStatus}
        </Badge>
      </td>
      <td className="py-2 text-slate-500">{sale.date}</td>
      <td className="py-2 text-center">
        <Link
          href={`/vendor/sales/${sale.id.replace("#", "")}`}
          className="rounded px-3 py-1 text-xs font-medium text-white transition hover:opacity-90"
          style={{ backgroundColor: "#00C9A7" }}
        >
          Details
        </Link>
      </td>
    </tr>
  );
}
