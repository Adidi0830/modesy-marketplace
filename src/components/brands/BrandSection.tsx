import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BrandLogo } from "./BrandLogo";
import { Brand } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BrandSectionProps {
  brands: Brand[];
}

/**
 * BrandSection Component
 * Baris logo brand ternama dengan navigasi slider
 */
export const BrandSection: React.FC<BrandSectionProps> = ({ brands }) => {
  if (!brands || brands.length === 0) return null;

  return (
    <section className="border-t border-neutral-100 bg-white py-6 sm:py-8">
      <Container>
        <div className="flex items-center justify-between pb-3">
          <SectionHeading
            title="Shop by Brand"
            subtitle="Authentic products from world-renowned and emerging fashion labels"
            viewAllLabel="All Brands"
            viewAllHref="#all-brands"
            className="mb-0 flex-1"
          />
          <div className="hidden items-center gap-1.5 sm:flex">
            <button
              type="button"
              aria-label="Previous brands"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next brands"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 6 / 8 Kolom Logo Brand */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6 lg:grid-cols-6">
          {brands.map((brand) => (
            <BrandLogo key={brand.id} brand={brand} />
          ))}
        </div>
      </Container>
    </section>
  );
};
