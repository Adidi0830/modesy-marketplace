/**
 * @file AdminProfileDropdown component.
 * Dropdown in the admin header showing the current user's avatar with a
 * menu of actions: "View Site" (opens storefront) and "Logout".
 * Pulls avatar & name dynamically from the AuthContext.
 */
"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminProfileDropdown() {
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  if (!currentUser) return null;

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
        aria-label="Admin profile menu"
      >
        <img
          src={currentUser.avatarUrl || "/placeholder.png"}
          alt={currentUser.fullName}
          className="h-7 w-7 rounded-full object-cover"
        />
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border border-gray-200 bg-white py-1.5 shadow-lg">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            <ExternalLink size={14} /> View Site
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
