"use client";

import React from "react";
import Image from "next/image";
import { X, Trash2, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { ProductPrice } from "@/components/products/ProductPrice";

export const WishlistModal: React.FC = () => {
  const {
    items,
    wishlistCount,
    isWishlistOpen,
    closeWishlist,
    removeFromWishlistUniversal,
  } = useWishlist();
  const { addToCart } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
        onClick={closeWishlist}
      />
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold text-neutral-900">
            Wishlist ({wishlistCount})
          </h2>
          <button
            onClick={closeWishlist}
            aria-label="Close wishlist"
            className="p-1 text-neutral-500 hover:text-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            Your wishlist is empty.
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {items.map((p) => (
              <li key={p.id} className="flex gap-3 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded">
                  <Image
                    src={p.image_url}
                    alt={p.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="line-clamp-2 text-sm font-semibold">
                    {p.title}
                  </p>
                  <ProductPrice
                    price={p.price}
                    originalPrice={p.original_price}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => addToCart(p, 1)}
                    className="flex items-center justify-center gap-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    <ShoppingCart className="h-3 w-3" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlistUniversal(p.id)}
                    aria-label="Remove from wishlist"
                    className="rounded-lg border border-neutral-200 py-1 text-xs font-medium text-neutral-600 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
