import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Printer, Package, User, MapPin, CreditCard, Clock, CheckCircle } from "lucide-react";
import { getVendorSaleById } from "@/lib/vendor-data";

export const dynamic = "force-dynamic";

interface SaleDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VendorSaleDetailPage({ params }: SaleDetailPageProps) {
  const { id } = await params;
  const sale = await getVendorSaleById(id);

  if (!sale) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/vendor" className="hover:text-emerald-600 transition">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/vendor/sales" className="hover:text-emerald-600 transition">
            Sales
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{sale.id}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/vendor/sales"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <ArrowLeft size={14} /> Back to Sales
          </Link>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-800">Order {sale.id}</h1>
              <span
                className="rounded-md px-2.5 py-0.5 text-xs font-semibold text-white shadow-2xs"
                style={{ backgroundColor: "#00C9A7" }}
              >
                {sale.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Order Placed: {sale.date}</p>
          </div>

          <div className="mt-3 flex items-center gap-2 sm:mt-0">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50"
            >
              <Printer size={13} />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Summary Details Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Customer */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-4 text-xs">
              <div className="mb-2.5 flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-500">
                <User size={14} className="text-slate-400" />
                <span>Buyer Information</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{sale.customerName || "Customer"}</p>
              <p className="mt-1 text-slate-600">{sale.customerEmail || "customer@example.com"}</p>
              <p className="text-slate-600">{sale.customerPhone || "+1 (555) 000-0000"}</p>
            </div>

            {/* Payment Info */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-4 text-xs">
              <div className="mb-2.5 flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-500">
                <CreditCard size={14} className="text-slate-400" />
                <span>Payment Details</span>
              </div>
              <p className="text-slate-700">
                <span className="font-semibold text-slate-800">Status:</span>{" "}
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
              <p className="mt-1 text-slate-700">
                <span className="font-semibold text-slate-800">Payment Method:</span>{" "}
                {sale.paymentMethod || "Bank Transfer"}
              </p>
              <p className="mt-1 text-slate-700">
                <span className="font-semibold text-slate-800">Currency:</span> USD ($)
              </p>
            </div>

            {/* Shipping Info */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-4 text-xs sm:col-span-2 lg:col-span-1">
              <div className="mb-2.5 flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-500">
                <MapPin size={14} className="text-slate-400" />
                <span>Shipping Address</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{sale.shippingAddress || "Standard Address"}</p>
              <p className="mt-1 text-slate-500">
                <span className="font-semibold text-slate-700">Method:</span>{" "}
                {sale.shippingMethod || "Standard Shipping"}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Order Items
            </h3>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3 text-right">Unit Price</th>
                    <th className="px-4 py-3 text-center">Quantity</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sale.items && sale.items.length > 0 ? (
                    sale.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-10 w-10 rounded-md border border-slate-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                                <Package size={16} />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-slate-800">{item.name}</p>
                              <p className="text-[11px] text-slate-400">ID: {item.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500">{item.sku || "—"}</td>
                        <td className="px-4 py-3 text-right text-slate-700">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center font-medium text-slate-700">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                        No item details found
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-t border-slate-200 bg-slate-50/70">
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-right text-xs font-semibold text-slate-700">
                      Total Amount:
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                      ${sale.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
