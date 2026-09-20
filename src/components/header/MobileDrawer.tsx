"use client";

import React from "react";
import Link from "next/link";
import { X, Flame, HelpCircle, PhoneCall } from "lucide-react";
import { Category } from "@/types";

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

/**
 * MobileDrawer Component
 * Panel navigasi samping untuk perangkat seluler (Mobile-first)
 */
export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  categories,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Drawer content panel */}
      <div className="relative flex w-4/5 max-w-xs flex-col bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between border-b pb-3">
          <span className="text-base font-bold text-neutral-900">Categories</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1 text-neutral-500 hover:text-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category List */}
        <div className="mt-4 flex-1 overflow-y-auto">
          <ul className="space-y-3 text-sm font-medium text-neutral-700">
            {categories.map((cat) => (
              <li key={cat.id} className="border-b border-neutral-100 pb-2">
                <Link
                  href={`#category-${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between transition hover:text-emerald-600"
                >
                  <span>{cat.name}</span>
                  {cat.product_count && (
                    <span className="text-xs text-neutral-400">
                      {cat.product_count}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t pt-4 space-y-3 text-xs text-neutral-600">
            <Link
              href="#special-offers"
              onClick={onClose}
              className="flex items-center gap-2 font-semibold text-rose-600"
            >
              <Flame className="h-4 w-4" />
              <span>Hot Deals & Discounts</span>
            </Link>
            <Link href="#help" onClick={onClose} className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-neutral-500" />
              <span>Help Center</span>
            </Link>
            <div className="flex items-center gap-2 pt-2 text-neutral-500">
              <PhoneCall className="h-4 w-4 text-emerald-600" />
              <span>+1 (800) 123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
