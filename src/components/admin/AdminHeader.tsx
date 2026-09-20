/**
 * @file AdminHeader component.
 * Top bar for the Admin Dashboard — contains hamburger menu toggle,
 * "View Site" link, language picker, and admin profile dropdown.
 *
 * @param onMenuClick - Opens the mobile sidebar drawer.
 */
"use client";
import Link from "next/link";
import { Menu, Globe, ChevronDown } from "lucide-react";

import AdminProfileDropdown from "@/components/admin/AdminProfileDropdown";
export default function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-4 shadow-sm lg:px-6">
      {/* Left: menu toggle + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded p-1 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
      </div>

      {/* Right: view site, language, profile */}
      <div className="flex items-center gap-3 text-sm">
        <ViewSiteLink />
        <LanguagePicker />
        <AdminProfileDropdown />
      </div>
    </header>
  );
}

/** "View Site" link opens the live storefront in a new tab. */
function ViewSiteLink() {
  return (
    <Link
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-600 hover:text-gray-800"
    >
      View Site
    </Link>
  );
}

/** Language selector — currently supports English. */
function LanguagePicker() {
  return (
    <button
      type="button"
      className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
      aria-label="Select language"
    >
      <Globe size={16} />
      <span>English</span>
      <ChevronDown size={14} />
    </button>
  );
}
