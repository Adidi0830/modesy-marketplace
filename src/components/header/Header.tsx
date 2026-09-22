"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SearchBar } from "./SearchBar";
import { CartWishlistBadge } from "./CartWishlistBadge";
import { TopBar } from "./TopBar";
import { MobileDrawer } from "./MobileDrawer";
import { Category } from "@/types";
import { useCart } from "@/context/CartContext";

export interface HeaderProps {
  categories?: Category[];
}

/** Header homepage dengan layout Modesy: top bar, search, cart, kategori. */
export const Header: React.FC<HeaderProps> = ({ categories = [] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const cart = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white">
      {/* Top bar (Desktop only) */}
      <TopBar />

      {/* Main bar */}
      <div className="border-b border-neutral-200 bg-white px-3 py-2.5 sm:px-4 md:py-3 md:px-8">
        <Container className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Mobile Header Row */}
          <div className="flex w-full items-center justify-between md:hidden">
            {/* Left: Hamburger Menu */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              className="p-1.5 text-neutral-800 hover:text-[#00a896] transition"
            >
              <Menu className="h-6 w-6 stroke-[2.2]" />
            </button>

            {/* Center: Modesy Logo */}
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-[#222] sm:text-3xl"
            >
              M<span className="text-[#00a896]">o</span>desy
            </Link>

            {/* Right: Search & Cart icons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen((prev) => !prev)}
                aria-label="Toggle Search"
                className="p-1 text-neutral-800 hover:text-[#00a896] transition"
              >
                {isMobileSearchOpen ? (
                  <X className="h-5 w-5 stroke-[2.2]" />
                ) : (
                  <Search className="h-5 w-5 stroke-[2.2]" />
                )}
              </button>

              <button
                type="button"
                onClick={cart.openCart}
                aria-label="Shopping Cart"
                className="relative p-1 text-neutral-800 hover:text-[#00a896] transition"
              >
                <ShoppingCart className="h-5 w-5 stroke-[2.2]" />
                <span className="absolute -top-1 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white leading-none">
                  {cart.cartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Desktop Logo */}
          <Link
            href="/"
            className="hidden items-center text-3xl font-extrabold text-[#111827] md:flex lg:text-4xl"
          >
            M<span className="text-[#008c7c]">o</span>desy
          </Link>

          {/* Desktop Search bar */}
          <div className="hidden min-w-0 flex-1 md:block">
            <SearchBar categories={categories} />
          </div>

          {/* Desktop Cart, Wishlist & Sell button */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <CartWishlistBadge />
            <Link
              href="/vendor"
              className="hidden h-10 flex-shrink-0 items-center justify-center rounded-md bg-[#00a896] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#008c7c] lg:flex"
            >
              Sell Now
            </Link>
          </div>
        </Container>

        {/* Mobile Expandable Search Bar */}
        {isMobileSearchOpen && (
          <div className="mt-2 pt-2 border-t border-neutral-100 md:hidden animate-in slide-in-from-top-2 duration-150">
            <SearchBar categories={categories} />
          </div>
        )}
      </div>

      {/* Category bar (Desktop only) */}
      <div className="hidden border-b border-[#e5e7eb] bg-white px-4 py-2.5 shadow-xs md:block md:px-8">
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