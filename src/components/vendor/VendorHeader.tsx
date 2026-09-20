"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, ExternalLink, ChevronDown } from "lucide-react";
import { UserDropdown } from "@/components/header/UserDropdown";

interface VendorHeaderProps {
  onMenuClick: () => void;
}

export default function VendorHeader({ onMenuClick }: VendorHeaderProps) {
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:px-6">
      {/* Left: menu toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* View Site */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 sm:flex"
          style={{ backgroundColor: "#00C9A7" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>View Site</span>
        </Link>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setLangOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            aria-label="Select language"
          >
            <span className="text-sm">🇺🇸</span>
            <span>English</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
              <button
                onClick={() => setLangOpen(false)}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
              >
                <span>🇺🇸</span> English
              </button>
              <button
                onClick={() => setLangOpen(false)}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
              >
                <span>🇮🇩</span> Indonesia
              </button>
            </div>
          )}
        </div>

        {/* Profile dropdown — shared UserDropdown */}
        <UserDropdown />
      </div>
    </header>
  );
}
