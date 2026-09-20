"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
  sectionId?: string;
  showLoadMore?: boolean;
  initialCount?: number;
  hasArrows?: boolean;
}

/**
 * ProductGrid Component
 * Grid produk 6-kolom responsif khas Modesy Marketplace (Desktop: 6 kolom)
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  title,
  subtitle,
  products,
  viewAllHref,
  viewAllLabel = "View All",
  sectionId,
  showLoadMore = false,
  initialCount = 12,
  hasArrows = false,
}) => {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  if (!products || products.length === 0) return null;

  const displayedProducts = showLoadMore
    ? products.slice(0, visibleCount)
    : products;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 6, products.length));
      setIsLoadingMore(false);
    }, 400);
  };

  return (
    <section id={sectionId} className="py-5 sm:py-7">
      <Container>
        <div className="flex items-center justify-between pb-3">
          <SectionHeading
            title={title}
            subtitle={subtitle}
            viewAllLabel={viewAllLabel}
            viewAllHref={viewAllHref}
            className="mb-0 flex-1"
          />
          {hasArrows && (
            <div className="hidden items-center gap-1.5 sm:flex">
              <button
                type="button"
                aria-label="Previous items"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next items"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* 
          6-Column Grid Layout (sesuai gambar Modesy):
          - Mobile (<640px): 2 kolom
          - Small tablet (sm): 3 kolom
          - Tablet (md): 4 kolom
          - Desktop (lg/xl): 6 kolom
        */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Tombol Load More */}
        {showLoadMore && visibleCount < products.length && (
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>Load More...</span>
              )}
            </button>
          </div>
        )}
      </Container>
    </section>
  );
};
