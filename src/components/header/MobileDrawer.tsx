"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, MapPin, ChevronRight, User, LogOut } from "lucide-react";
import { Category } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

/**
 * MobileDrawer Component
 * Navigasi samping mobile dengan tab Main Menu dan Categories persis seperti template Modesy asli
 */
export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  categories,
}) => {
  const [activeTab, setActiveTab] = useState<"menu" | "categories">("menu");
  const [lang, setLang] = useState("EN");
  const [currency, setCurrency] = useState("USD");
  const { isAuthenticated, currentUser, openLoginModal, logout } = useAuth();
  const { openWishlist } = useWishlist();

  if (!isOpen) return null;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    openWishlist();
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    openLoginModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content panel */}
      <div className="relative flex w-[78%] max-w-[320px] flex-col bg-white shadow-2xl z-10 overflow-y-auto animate-in slide-in-from-left duration-200">
        <div className="p-4 space-y-3">
          {/* Sell Now Button */}
          <Link
            href="/vendor"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded bg-[#00a896] py-2.5 px-4 text-sm font-semibold text-white transition hover:bg-[#008c7c] shadow-xs"
          >
            Sell Now
          </Link>

          {/* Tab Switcher: Main Menu / Categories */}
          <div className="flex rounded bg-neutral-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("menu")}
              className={`flex-1 rounded py-2 text-center transition-all ${
                activeTab === "menu"
                  ? "bg-white text-neutral-900 shadow-xs font-bold"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Main Menu
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("categories")}
              className={`flex-1 rounded py-2 text-center transition-all ${
                activeTab === "categories"
                  ? "bg-white text-neutral-900 shadow-xs font-bold"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Categories
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 px-4 pb-6">
          {activeTab === "menu" ? (
            <div className="divide-y divide-neutral-100 text-[13px] font-medium text-neutral-700">
              <Link
                href="/"
                onClick={onClose}
                className="block py-3 hover:text-[#00a896] transition"
              >
                Home
              </Link>
              <button
                type="button"
                onClick={handleWishlistClick}
                className="block w-full text-left py-3 hover:text-[#00a896] transition"
              >
                Wishlist
              </button>
              <Link
                href="#contact"
                onClick={onClose}
                className="block py-3 hover:text-[#00a896] transition"
              >
                Contact
              </Link>
              <Link
                href="/blog"
                onClick={onClose}
                className="block py-3 hover:text-[#00a896] transition"
              >
                Blog
              </Link>
              <Link
                href="/vendor"
                onClick={onClose}
                className="block py-3 hover:text-[#00a896] transition"
              >
                Sell on Modesy
              </Link>

              {isAuthenticated && currentUser ? (
                <>
                  <Link
                    href="/profile"
                    onClick={onClose}
                    className="flex items-center justify-between py-3 hover:text-[#00a896] transition"
                  >
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4 text-neutral-500" />
                      {currentUser.fullName || currentUser.username}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 uppercase">
                      {currentUser.role}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="flex w-full items-center gap-2 py-3 text-rose-600 hover:text-rose-700 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleLoginClick}
                    className="block w-full text-left py-3 hover:text-[#00a896] transition"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={handleLoginClick}
                    className="block w-full text-left py-3 hover:text-[#00a896] transition"
                  >
                    Register
                  </button>
                </>
              )}

              {/* Location */}
              <div className="flex items-center gap-2 py-3 text-neutral-700">
                <MapPin className="h-4 w-4 text-neutral-500" />
                <span>Location</span>
              </div>

              {/* Language & Currency Row */}
              <div className="flex items-center justify-between py-3.5 text-xs text-neutral-700">
                <div className="flex items-center gap-1">
                  <span className="text-sm">🇺🇸</span>
                  <select
                    value={lang}
                    aria-label="Language selection"
                    onChange={(e) => setLang(e.target.value)}
                    className="bg-transparent font-medium outline-none cursor-pointer text-neutral-700"
                  >
                    <option value="EN">English</option>
                    <option value="ID">Indonesia</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <select
                    value={currency}
                    aria-label="Currency selection"
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-transparent font-medium outline-none cursor-pointer text-neutral-700"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="IDR">IDR (Rp)</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* Categories Tab Content */
            <div className="divide-y divide-neutral-100 text-[13px] font-medium text-neutral-700">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`#category-${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between py-3 hover:text-[#00a896] transition"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
