"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutGrid,
  User,
  Wallet,
  ShoppingBasket,
  Tag,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown,
  LucideIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface MenuItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

interface UserDropdownProps {
  compact?: boolean;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!currentUser) return null;

  const displayName =
    currentUser.role === "vendor"
      ? currentUser.storeName || currentUser.fullName || "Trendshop"
      : currentUser.fullName || currentUser.username || "Peter Jone";

  const items: MenuItem[] = [];

  // Hanya tampilkan Dashboard untuk Super Admin, Moderator, atau Vendor
  if (
    currentUser.role === "superadmin" ||
    currentUser.role === "moderator" ||
    currentUser.role === "vendor"
  ) {
    items.push({
      label: "Dashboard",
      icon: LayoutGrid,
      href: currentUser.role === "vendor" ? "/vendor" : "/admin",
    });
  }

  // Profile selalu ada di urutan teratas untuk Member
  items.push(
    { label: "Profile", icon: User, href: "/profile" },
    { label: "Wallet", icon: Wallet, href: "#wallet" },
    { label: "Orders", icon: ShoppingBasket, href: "/orders" },
    { label: "My Coupons", icon: Tag, href: "#coupons" },
    { label: "Messages", icon: MessageSquare, href: "#messages" },
    { label: "Profile Settings", icon: Settings, href: "#settings" }
  );

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block text-left"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="User Account Menu"
        className="flex items-center gap-2 rounded-full p-0.5 transition hover:opacity-90 cursor-pointer"
      >
        {/* Avatar */}
        <div className="relative h-7 w-7">
          <div className="relative h-full w-full overflow-hidden rounded-full ring-1 ring-slate-200">
            <Image
              src={
                currentUser.avatarUrl ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              }
              alt={displayName}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Username */}
        <span className="text-xs font-normal text-slate-700 sm:text-sm">
          {displayName}
        </span>

        {/* Chevron */}
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-md border border-slate-200/90 bg-white py-1.5 shadow-xl transition-all">
          {items.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-[13.5px] text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <Icon className="h-4 w-4 text-slate-500" />
              <span>{label}</span>
            </Link>
          ))}

          <div className="my-1 border-t border-slate-100" />

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-[13.5px] text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="h-4 w-4 text-slate-500" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};
