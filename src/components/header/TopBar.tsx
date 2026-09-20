"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/context/AuthContext";
import { UserDropdown } from "./UserDropdown";

/**
 * TopBar Component
 * Menampilkan bar atas untuk pilihan kontak, jual di modesy, lokasi, mata uang, bahasa, dan profil
 */
export const TopBar: React.FC = () => {
  const [lang, setLang] = useState("EN");
  const [currency, setCurrency] = useState("USD");
  const { isAuthenticated, currentUser, openLoginModal } = useAuth();

  return (
    <div className="hidden border-b border-neutral-200 bg-neutral-100 text-xs text-neutral-600 md:block">
      <Container className="flex h-9 items-center justify-between">
        {/* Sisi Kiri: Contact & Sell on Modesy */}
        <div className="flex items-center gap-4">
          <Link
            href="#contact"
            className="transition hover:text-neutral-900"
          >
            Contact
          </Link>
          <Link
            href="#sell"
            className="transition hover:text-neutral-900"
          >
            Sell on Modesy
          </Link>
        </div>

        {/* Sisi Kanan: Location, Currency, Language & Profile */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-1 cursor-pointer hover:text-neutral-900">
            <MapPin className="h-3.5 w-3.5 text-neutral-500" />
            <span>Location</span>
          </div>

          <div className="flex items-center gap-0.5">
            <select
              value={currency}
              aria-label="Select Currency"
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent font-medium text-neutral-700 outline-none hover:cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="IDR">IDR (Rp)</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs">🇺🇸</span>
            <select
              value={lang}
              aria-label="Select Language"
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent font-medium text-neutral-700 outline-none hover:cursor-pointer"
            >
              <option value="EN">English</option>
              <option value="ID">Indonesia</option>
            </select>
          </div>

          <div suppressHydrationWarning className="flex items-center">
            {isAuthenticated && currentUser ? (
              <UserDropdown compact />
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                className="flex items-center gap-1 font-semibold text-emerald-700 transition hover:text-emerald-900"
              >
                <span>Masuk / Daftar</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
