"use client";

import React, { useState, useMemo, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Info, ChevronDown, Download, FileSpreadsheet, FileJson, RefreshCw } from "lucide-react";
import type { VendorSale } from "@/types/vendor-dashboard";
import VendorSaleDetailModal from "@/components/vendor/VendorSaleDetailModal";

interface VendorSalesClientProps {
  initialSales: VendorSale[];
  defaultStatusFilter?: string;
}

export default function VendorSalesClient({
  initialSales,
  defaultStatusFilter,
}: VendorSalesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sales, setSales] = useState<VendorSale[]>(initialSales);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePaymentFilter, setActivePaymentFilter] = useState<string>("all");
  const [activeSearch, setActiveSearch] = useState<string>("");

  const [selectedSale, setSelectedSale] = useState<VendorSale | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    setSales(initialSales);
  }, [initialSales]);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  // Filter application
  const handleApplyFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActivePaymentFilter(paymentStatusFilter);
    setActiveSearch(searchQuery.trim());
  };

  const handleResetFilter = () => {
    setPaymentStatusFilter("all");
    setSearchQuery("");
    setActivePaymentFilter("all");
    setActiveSearch("");
  };

  const filteredSales = useMemo(() => {
    return sales.filter((item) => {
      // If defaultStatusFilter is provided (like "Processing")
      if (
        defaultStatusFilter &&
        item.status.toLowerCase() !== defaultStatusFilter.toLowerCase()
      ) {
        return false;
      }

      // Payment status filter
      if (activePaymentFilter !== "all") {
        if (item.paymentStatus !== activePaymentFilter) {
          return false;
        }
      }

      // Search query filter (search by ID or customer)
      if (activeSearch) {
        const query = activeSearch.toLowerCase().replace("#", "");
        const idMatch = item.id.toLowerCase().replace("#", "").includes(query);
        const customerMatch = item.customerName?.toLowerCase().includes(query);
        if (!idMatch && !customerMatch) {
          return false;
        }
      }

      return true;
    });
  }, [sales, activePaymentFilter, activeSearch, defaultStatusFilter]);

  // Export handlers
  const handleExportCSV = () => {
    const headers = ["Sale", "Total", "Payment Status", "Status", "Date"];
    const rows = filteredSales.map((s) => [
      `"${s.id}"`,
      `"$${s.total.toFixed(2)}"`,
      `"${s.paymentStatus}"`,
      `"${s.status}"`,
      `"${s.date}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendor_sales_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportOpen(false);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredSales, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `vendor_sales_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportOpen(false);
  };

  const openDetails = (sale: VendorSale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs">
        {/* Card Header Title */}
        <div className="flex items-center justify-between px-6 pt-6">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Sales</h1>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
            title="Refresh latest sales"
          >
            <RefreshCw size={13} className={isPending ? "animate-spin text-indigo-600" : ""} />
            <span>{isPending ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="px-6 pt-5">
          <form onSubmit={handleApplyFilter} className="flex flex-wrap items-end gap-3.5">
            {/* Payment Status Dropdown */}
            <div className="flex flex-col">
              <label className="mb-1.5 text-xs font-bold text-slate-700">Payment Status</label>
              <div className="relative">
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                  className="h-10 w-36 appearance-none rounded-md border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All</option>
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Payment Received">Payment Received</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* Search Input */}
            <div className="flex flex-col">
              <label className="mb-1.5 text-xs font-bold text-slate-700">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sale Id"
                className="h-10 w-44 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Filter Button */}
            <button
              type="submit"
              className="h-10 rounded-md px-5 text-xs font-medium text-white shadow-2xs transition hover:opacity-90"
              style={{ backgroundColor: "#56509F" }}
            >
              Filter
            </button>

            {/* Reset button if filter is active */}
            {(activePaymentFilter !== "all" || activeSearch !== "") && (
              <button
                type="button"
                onClick={handleResetFilter}
                className="flex h-10 items-center gap-1 rounded-md border border-slate-200 px-3 text-xs text-slate-500 hover:bg-slate-50"
                title="Reset filter"
              >
                <RefreshCw size={13} />
                <span>Reset</span>
              </button>
            )}

            {/* Export Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-slate-100/80 px-3.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200/70"
              >
                <span>Export</span>
                <ChevronDown size={14} className="text-slate-500" />
              </button>

              {isExportOpen && (
                <div className="absolute left-0 top-full z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <FileSpreadsheet size={14} className="text-emerald-600" />
                    <span>Export to CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <FileJson size={14} className="text-blue-600" />
                    <span>Export to JSON</span>
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Sales Table Container */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full table-auto text-left text-xs">
            <thead>
              <tr className="border-y border-slate-100 bg-white text-[13px] font-bold text-slate-700">
                <th className="py-3.5 pl-6 pr-4">Sale</th>
                <th className="px-4 py-3.5">Total</th>
                <th className="px-4 py-3.5">Payment Status</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="py-3.5 pl-4 pr-6 text-center">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-slate-400">
                    No sales matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale, idx) => {
                  const isEven = idx % 2 === 1;
                  return (
                    <tr
                      key={`${sale.id}-${idx}`}
                      className={`transition-colors hover:bg-slate-50/80 ${
                        isEven ? "bg-slate-50/40" : "bg-white"
                      }`}
                    >
                      {/* Sale ID */}
                      <td className="py-3.5 pl-6 pr-4 font-normal text-slate-700">
                        {sale.id}
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3.5 font-normal text-slate-700">
                        ${sale.total % 1 === 0 ? sale.total : sale.total.toFixed(2)}
                      </td>

                      {/* Payment Status */}
                      <td className="px-4 py-3.5 font-normal text-slate-700">
                        {sale.paymentStatus}
                      </td>

                      {/* Order Status Badge */}
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-semibold text-white shadow-2xs"
                          style={{ backgroundColor: "#00C9A7" }}
                        >
                          {sale.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 font-normal text-slate-700">
                        {sale.date}
                      </td>

                      {/* Options Button */}
                      <td className="py-3.5 pl-4 pr-6 text-center">
                        <button
                          type="button"
                          onClick={() => openDetails(sale)}
                          className="inline-flex items-center justify-center gap-1 rounded-md px-3.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200/90 hover:text-slate-900"
                          style={{ backgroundColor: "#EBEFF5" }}
                        >
                          <Info size={13} className="text-slate-500" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Card Footer with Number of Entries */}
        <div className="border-t border-slate-100 px-6 py-5">
          <p className="text-xs text-slate-700">
            Number of Entries: <span className="font-bold">{filteredSales.length}</span>
          </p>
        </div>
      </div>

      {/* Sale Detail Modal */}
      <VendorSaleDetailModal
        sale={selectedSale}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSale(null);
        }}
      />
    </div>
  );
}
