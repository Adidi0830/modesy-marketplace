"use client";

import React from "react";
import { X, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartItemRow } from "./CartItemRow";
import { formatUSD } from "@/lib/utils/product-utils";

export const CartDrawer: React.FC = () => {
  const {
    items,
    cartSubtotal,
    isCartOpen,
    closeCart,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex">
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
        onClick={closeCart}
      />
      <aside className="relative ml-auto h-full w-full max-w-md overflow-y-auto bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold text-neutral-900">Your Cart</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-1 text-neutral-500 hover:text-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex h-56 flex-col items-center justify-center gap-2 p-6 text-center">
            <ShoppingCart className="h-8 w-8 text-neutral-300" />
            <span className="text-sm text-neutral-500">
              Your cart is empty
            </span>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {items.map((item) => (
              <CartItemRow key={item.product.id} item={item} />
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className="border-t p-4">
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-neutral-500">Subtotal</span>
              <span className="font-bold text-neutral-900">
                {formatUSD(cartSubtotal)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="mb-2 w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 block text-center"
            >
              <span className="flex items-center justify-center gap-1">
                Checkout
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <button
              onClick={clearCart}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
            >
              Clear Cart
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
