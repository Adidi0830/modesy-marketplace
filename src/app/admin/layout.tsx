/**
 * @file Root layout for the Admin Dashboard route.
 * Composes <AdminHeader />, collapsible <AdminSidebar />, and outlet children.
 * Mobile-first: sidebar is hidden off-canvas until toggled.
 */
"use client";
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminAuthGate from "@/components/admin/AdminAuthGate";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminAuthGate>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col overflow-y-auto">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AdminAuthGate>
  );
}
