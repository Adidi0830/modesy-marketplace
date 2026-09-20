"use client";

import React from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatUSD } from "@/lib/utils/product-utils";

export interface CartWishlistBadgeProps {
  /** Dipakai untuk back-compat; tidak dipakai ketika provider tersedia */
  wishlistCount?: number;
  cartCount?: number;
  cartSubtotal?: number;
}

/**
 * CartWishlistBadge Component
 * Menampilkan ikon Wishlist dan Cart counter
 */
export const CartWishlistBadge: React.FC<CartWishlistBadgeProps> = ({
  wishlistCount,
  cartCount,
  cartSubtotal,
}) => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const cart = useCart();
  const wishlist = useWishlist();

  const wCount = wishlistCount ?? wishlist.wishlistCount;
  const cCount = cartCount ?? cart.cartCount;
  const cSubtotal = cartSubtotal ?? cart.cartSubtotal;

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* Wishlist */}
      <button
        type="button"
        onClick={wishlist.openWishlist}
        aria-label="Wishlist"
        className="relative flex p-1 text-neutral-700 transition hover:text-emerald-600"
      >
        <Heart
          className={`h-5 w-5 sm:h-6 sm:w-6 ${
            wCount > 0 ? "fill-rose-500 text-rose-500" : ""
          }`}
        />
        {wCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            {wCount}
          </span>
        )}
      </button>

      {/* Cart with Badge & Subtotal */}
      <button
        type="button"
        onClick={cart.openCart}
        aria-label="Shopping Cart"
        className="relative flex items-center gap-2 p-1 text-neutral-700 transition hover:text-emerald-600"
      >
        <div className="relative">
          <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
          {cCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
              {cCount}
            </span>
          )}
        </div>
        <div className="hidden text-left lg:block">
          <div className="text-[10px] text-neutral-400">Cart</div>
          <div className="text-xs font-semibold text-neutral-900">
            {formatUSD(cSubtotal)}
          </div>
        </div>
      </button>
    </div>
  );
};
