"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SearchBar } from "./SearchBar";
import { CartWishlistBadge } from "./CartWishlistBadge";
import { TopBar } from "./TopBar";
import { MobileDrawer } from "./MobileDrawer";
import { Category } from "@/types";

export interface HeaderProps {
  categories?: Category[];
}

/** Header homepage dengan layout Modesy: top bar, search, cart, kategori. */
export const Header: React.FC<HeaderProps> = ({ categories = [] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white">
      {/* Top bar */}
      <TopBar />

      {/* Main bar */}
      <div className="border-b border-[#e5e7eb] bg-white px-3 py-2 sm:px-4 md:py-3 md:px-8">
        <Container className="mx-auto flex max-w-7xl flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <div className="flex w-full items-center justify-between md:w-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open mobile menu"
                className="p-1 text-neutral-700 hover:text-emerald-600 md:hidden"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <Link href="/" className="flex items-center text-2xl font-extrabold text-[#111827] sm:text-3xl md:text-4xl">
                M<span className="text-[#008c7c]">o</span>desy
              </Link>
            </div>

            {/* Cart & Wishlist icon on mobile top row */}
            <div className="flex items-center gap-2 md:hidden">
              <CartWishlistBadge />
            </div>
          </div>

          {/* Search bar */}
          <div className="min-w-0 flex-1">
            <SearchBar categories={categories} />
          </div>

          {/* Desktop Cart, Wishlist & Sell button */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <CartWishlistBadge />
            <button className="hidden h-10 flex-shrink-0 rounded-md bg-[#00a896] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#008c7c] lg:block">
              Sell Now
            </button>
          </div>
        </Container>
      </div>

      {/* Category bar */}
      <div className="border-b border-[#e5e7eb] bg-white px-4 py-2.5 shadow-xs md:px-8">
        <Container className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto text-xs font-semibold uppercase tracking-wider text-neutral-600 no-scrollbar">
          {[
            "All",
            "Clothing",
            "Shoes",
            "Bags",
            "Accessories",
            "Watches & Jewelry",
            "Home & Living",
            "Kids & Baby",
            "Beauty",
            "Vintage",
            "Toys",
            "Food & Drink",
            "Craft",
          ].map((item, idx) => (
            <Link
              key={idx}
              href={`#category-${item.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`}
              className="cursor-pointer whitespace-nowrap transition hover:text-emerald-600"
            >
              {item}
            </Link>
          ))}
        </Container>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
      />
    </header>
  );
};