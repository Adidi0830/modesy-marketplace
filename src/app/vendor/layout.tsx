"use client";

import React, { useState, useEffect } from "react";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorHeader from "@/components/vendor/VendorHeader";

interface VendorLayoutProps {
  children: React.ReactNode;
}

export default function VendorLayout({ children }: VendorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-xl transition-transform duration-200 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <span className="text-xl font-extrabold text-slate-800" style={{ fontFamily: "Georgia, serif" }}>
              Modesy
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded p-1 text-slate-500 hover:bg-slate-100"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <div className="overflow-y-auto">
            <VendorSidebar />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <VendorSidebar />
      </div>

      {/* Main area */}
      <div className="lg:ml-64">
        <VendorHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
