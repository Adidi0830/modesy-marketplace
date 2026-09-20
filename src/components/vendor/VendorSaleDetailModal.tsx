"use client";

import React from "react";
import Link from "next/link";
import { X, Printer, ExternalLink, Package, User, CreditCard, Info } from "lucide-react";
import type { VendorSale } from "@/types/vendor-dashboard";

interface VendorSaleDetailModalProps {
  sale: VendorSale | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VendorSaleDetailModal({
  sale,
  isOpen,
  onClose,
}: VendorSaleDetailModalProps) {
  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Info size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">Sale Details {sale.id}</h3>
                <span
                  className="rounded-md px-2.5 py-0.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: "#00C9A7" }}
                >
                  {sale.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">Placed on {sale.date}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-6 px-6 py-5">
          {/* Top Info Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Customer Information */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-4 text-xs">
              <div className="mb-2 flex items-center gap-1.5 font-semibold text-slate-700">
                <User size={14} className="text-slate-400" />
                <span>Customer Information</span>
              </div>
              <p className="font-semibold text-slate-800">{sale.customerName || "Customer"}</p>
              <p className="text-slate-500">{sale.customerEmail || "customer@example.com"}</p>
              <p className="text-slate-500">{sale.customerPhone || "+1 (555) 000-0000"}</p>
            </div>

            {/* Shipping & Payment */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-4 text-xs">
              <div className="mb-2 flex items-center gap-1.5 font-semibold text-slate-700">
                <CreditCard size={14} className="text-slate-400" />
                <span>Payment & Shipping</span>
              </div>
              <p className="text-slate-700">
                <span className="font-medium">Payment Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    sale.paymentStatus === "Payment Received"
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {sale.paymentStatus}
                </span>
              </p>
              <p className="text-slate-700">
                <span className="font-medium">Method:</span> {sale.paymentMethod || "Bank Transfer"}
              </p>
              <p className="text-slate-500 truncate" title={sale.shippingAddress}>
                <span className="font-medium text-slate-700">Address:</span> {sale.shippingAddress || "Standard Address"}
              </p>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Purchased Items
            </h4>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600">
                  <tr>
                    <th className="px-3 py-2">Item</th>
                    <th className="px-3 py-2">SKU</th>
                    <th className="px-3 py-2 text-right">Price</th>
                    <th className="px-3 py-2 text-center">Qty</th>
                    <th className="px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sale.items && sale.items.length > 0 ? (
                    sale.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2.5">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-8 w-8 rounded border border-slate-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-400">
                                <Package size={14} />
                              </div>
                            )}
                            <span className="font-medium text-slate-800 line-clamp-1">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-slate-500">{item.sku || "—"}</td>
                        <td className="px-3 py-2.5 text-right text-slate-700">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-3 py-2.5 text-center text-slate-700">{item.quantity}</td>
                        <td className="px-3 py-2.5 text-right font-semibold text-slate-800">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-center text-slate-400">
                        Item details unavailable
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-t border-slate-200 bg-slate-50/60 font-medium text-slate-700">
                  <tr>
                    <td colSpan={4} className="px-3 py-2.5 text-right font-semibold text-slate-800">
                      Grand Total:
                    </td>
                    <td className="px-3 py-2.5 text-right text-sm font-bold text-slate-900">
                      ${sale.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
          <Link
            href={`/vendor/sales/${sale.id.replace("#", "")}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600"
          >
            <span>Open Dedicated Page</span>
            <ExternalLink size={13} />
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50"
            >
              <Printer size={13} />
              <span>Print Invoice</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
