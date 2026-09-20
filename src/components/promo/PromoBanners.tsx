import React from "react";
import { Container } from "@/components/ui/Container";
import { PromoBannerCard } from "./PromoBannerCard";
import { Banner } from "@/types";

export interface PromoBannersProps {
  banners: Banner[];
}

/**
 * PromoBanners Component
 * Tata letak banner promo tengah halaman (Mobile-first: 1 kolom, Tablet/Desktop: 2 kolom)
 */
export const PromoBanners: React.FC<PromoBannersProps> = ({ banners }) => {
  if (!banners || banners.length === 0) return null;

  return (
    <section id="promo" className="py-6 sm:py-8">
      <Container>
        {/* Mobile-first: 1 kolom, sm/md: 2 kolom */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {banners.map((banner) => (
            <PromoBannerCard key={banner.id} banner={banner} />
          ))}
        </div>
      </Container>
    </section>
  );
};
