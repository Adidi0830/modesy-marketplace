"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { ProductRating } from "./ProductRating";
import { ProductPrice } from "./ProductPrice";

export interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard Component
 * Kartu produk e-commerce presisi sesuai tata letak visual Modesy Marketplace
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlistUniversal, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistUniversal(product).catch(() => {});
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1).catch(() => {});
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-md border border-neutral-200/80 bg-white transition-all duration-300 hover:border-emerald-500 hover:shadow-md">
      {/* Container Gambar Produk */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <Link href={`#product-${product.slug}`} className="block h-full w-full">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 18vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Badge Diskon Merah */}
        {(product.discount_percentage && product.discount_percentage > 0) ? (
          <span className="absolute top-2 left-2 rounded-sm bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-xs">
            -{product.discount_percentage}%
          </span>
        ) : product.is_special_offer ? (
          <span className="absolute top-2 left-2 rounded-sm bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-xs">
            SALE
          </span>
        ) : null}

        {/* Quick Wishlist Hover Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label="Wishlist"
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-sm transition hover:bg-white hover:scale-110"
        >
          <Heart
            className={`h-3.5 w-3.5 ${
              isWishlisted ? "fill-rose-500 text-rose-500" : "text-neutral-500"
            }`}
          />
        </button>
      </div>

      {/* Konten Detail Produk */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        {product.category_name && (
          <span className="text-[10px] font-medium text-neutral-400 truncate">
            {product.category_name}
          </span>
        )}

        <Link
          href={`#product-${product.slug}`}
          className="mt-0.5 line-clamp-2 text-xs font-semibold text-neutral-800 transition hover:text-emerald-600 min-h-[32px]"
          title={product.title}
        >
          {product.title}
        </Link>

        {/* Rating Stars */}
        <div className="mt-1">
          <ProductRating
            rating={product.rating}
            reviewsCount={product.reviews_count}
          />
        </div>

        {/* Bottom Price & Add to Cart Action */}
        <div className="mt-2 flex items-center justify-between pt-1 border-t border-neutral-100">
          <ProductPrice
            price={product.price}
            originalPrice={product.original_price}
          />

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className="flex h-6 w-6 items-center justify-center rounded bg-neutral-100 text-neutral-600 transition hover:bg-emerald-600 hover:text-white"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
