"use client";

import React from "react";
import { ShoppingCart, CreditCard, ShoppingBag, Hourglass } from "lucide-react";

interface StatCardData {
  value: string | number;
  label: string;
  icon: React.ReactNode;
}

const cards: StatCardData[] = [
  { value: 15, label: "Number of total sales", icon: <ShoppingCart size={20} /> },
  { value: "$1,009.48", label: "Balance", icon: <CreditCard size={20} /> },
  { value: 24, label: "Products", icon: <ShoppingBag size={20} /> },
  { value: 0, label: "Pending Products", icon: <Hourglass size={20} /> },
];

export default function VendorStatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
            {card.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
