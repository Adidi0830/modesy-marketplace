"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShoppingBasket,
  Tag,
  CloudDownload,
  CreditCard,
  Clock,
  Info,
  X,
  Package,
  MapPin,
  Loader2,
} from "lucide-react";
import { OrderRecord } from "@/types";
import { formatUSD } from "@/lib/utils/product-utils";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/lib/services/orderService";

interface OrdersClientProps {
  initialOrders?: OrderRecord[];
}

function formatOrderDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "2026-09-14 / 16:27";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} / ${hh}:${min}`;
  } catch {
    return "2026-09-14 / 16:27";
  }
}

export function OrdersClient({ initialOrders = [] }: OrdersClientProps) {
  const { currentUser, isAuthenticated, openLoginModal } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserOrders = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const userOrders = await getUserOrders(userId);
      setOrders(userOrders);
    } catch (err) {
      console.error("Failed to fetch user orders:", err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      fetchUserOrders(currentUser.id);
    } else if (isAuthenticated === false) {
      setOrders([]);
      setIsLoading(false);
    }
  }, [currentUser?.id, isAuthenticated, fetchUserOrders]);

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "delivered" || s === "success") {
      return (
        <span className="inline-flex items-center rounded bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 border border-emerald-100">
          Completed
        </span>
      );
    }
    if (s === "processing" || s === "shipped") {
      return (
        <span className="inline-flex items-center rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
          Processing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
        Pending Payment
      </span>
    );
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="transition hover:text-slate-700">
          Home
        </Link>
        <span>/</span>
        <span className="font-medium text-slate-700">Orders</span>
      </div>

      {/* Page Heading */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Orders
        </h1>
        {currentUser && (
          <span className="text-xs text-slate-500">
            Account: <strong className="text-slate-700">{currentUser.fullName || currentUser.username}</strong>
          </span>
        )}
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-4">
        {/* Left Sidebar Navigation */}
        <aside className="space-y-1 lg:col-span-1">
          <Link
            href="/orders"
            className="flex items-center gap-3 rounded-md bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800 transition"
          >
            <ShoppingBasket size={18} className="text-slate-700" />
            <span>Orders</span>
          </Link>

          <Link
            href="#quote-requests"
            className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Tag size={18} className="text-slate-400" />
            <span>Quote Requests</span>
          </Link>

          <Link
            href="#downloads"
            className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <CloudDownload size={18} className="text-slate-400" />
            <span>Downloads</span>
          </Link>

          <Link
            href="#refund-requests"
            className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <CreditCard size={18} className="text-slate-400" />
            <span>Refund Requests</span>
          </Link>
        </aside>

        {/* Right Content Area: Orders List */}
        <div className="space-y-3 lg:col-span-3">
          {isLoading ? (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center text-slate-400 shadow-sm">
              <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-teal-600" />
              <p className="text-xs">Memuat riwayat pesanan akun Anda...</p>
            </div>
          ) : !currentUser ? (
            <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              <ShoppingBasket className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="font-semibold text-slate-700">Silakan Masuk Terlebih Dahulu</p>
              <p className="mt-1 text-xs text-slate-400">
                Masuk ke akun Anda untuk melihat riwayat pesanan.
              </p>
              <button
                type="button"
                onClick={openLoginModal}
                className="mt-4 inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "#00a896" }}
              >
                Masuk Akun
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              <ShoppingBasket className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="font-semibold text-slate-700">Belum ada riwayat pesanan untuk akun ini</p>
              <p className="mt-1 text-xs text-slate-400">
                Pesanan yang Anda buat dengan akun <span className="font-medium text-slate-600">{currentUser.fullName || currentUser.username}</span> akan muncul di sini.
              </p>
              <Link
                href="/"
                className="mt-4 inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: "#00a896" }}
              >
                Mulai Belanja
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-3 rounded-lg border border-slate-200/90 bg-white p-4 shadow-sm transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                {/* Order ID */}
                <div className="text-sm font-bold text-slate-800">
                  Order: <span className="font-extrabold">{order.order_number}</span>
                </div>

                {/* Total */}
                <div className="text-sm font-semibold text-slate-800">
                  Total: <span className="font-bold">{formatUSD(order.total)}</span>
                </div>

                {/* Status Badge */}
                <div>{getStatusBadge(order.status)}</div>

                {/* Date & Time */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock size={14} className="text-slate-400" />
                  <span>{formatOrderDate(order.created_at)}</span>
                </div>

                {/* Details Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200 cursor-pointer"
                  >
                    <Info size={13} className="text-slate-500" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Order Details {selectedOrder.order_number}
                </h2>
                <p className="text-xs text-slate-400">
                  {formatOrderDate(selectedOrder.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-4 space-y-4 text-sm">
              {/* Status & Payment */}
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <div>
                  <span className="block text-[11px] font-medium text-slate-400 uppercase">
                    Status
                  </span>
                  <div className="mt-0.5">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-slate-400 uppercase">
                    Metode Pembayaran
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedOrder.payment_method === "cod"
                      ? "Cash on Delivery (COD)"
                      : selectedOrder.payment_method === "transfer"
                      ? "Transfer Bank / VA (Midtrans)"
                      : selectedOrder.payment_method === "qris"
                      ? "QRIS / E-Wallet (Midtrans)"
                      : (selectedOrder.payment_method || "COD").toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="rounded-lg border border-slate-100 p-3">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <MapPin size={14} className="text-slate-400" />
                  <span>Informasi Pengiriman</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {selectedOrder.shipping_name || "Customer"}
                </p>
                {selectedOrder.shipping_phone && (
                  <p className="text-xs text-slate-500">{selectedOrder.shipping_phone}</p>
                )}
                {selectedOrder.shipping_address && (
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedOrder.shipping_address}
                  </p>
                )}
              </div>

              {/* Items List */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Package size={14} className="text-slate-400" />
                    <span>Daftar Produk ({selectedOrder.items.length})</span>
                  </div>
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-100">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">
                            {item.product_name}
                          </p>
                          <p className="text-slate-400">
                            {item.quantity} x {formatUSD(item.price)}
                          </p>
                        </div>
                        <span className="font-bold text-slate-800">
                          {formatUSD(item.quantity * item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Summary */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-sm font-semibold text-slate-700">Total Pembayaran</span>
                <span className="text-lg font-bold text-slate-900">
                  {formatUSD(selectedOrder.total)}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
