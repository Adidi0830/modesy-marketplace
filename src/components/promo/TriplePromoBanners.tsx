import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Banner } from "@/types";
import { ArrowRight } from "lucide-react";

export interface TriplePromoBannersProps {
  banners: Banner[];
}

/**
 * TriplePromoBanners Component
 * Menampilkan 3 banner promosi horizontal side-by-side di bawah Latest Products
 */
export const TriplePromoBanners: React.FC<TriplePromoBannersProps> = ({ banners }) => {
  if (!banners || banners.length === 0) return null;

  return (
    <section className="py-5 sm:py-7">
      <Container>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {banners.slice(0, 3).map((banner) => (
            <div
              key={banner.id}
              className="group relative h-40 overflow-hidden rounded-lg bg-neutral-900 shadow-sm transition sm:h-44 md:h-48"
            >
              <Image
                src={banner.image_url}
                alt={banner.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col justify-center p-5 sm:p-6">
                {banner.tagline && (
                  <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase sm:text-xs">
                    {banner.tagline}
                  </span>
                )}
                <h3 className="mt-1 text-base font-bold text-white sm:text-lg">
                  {banner.title}
                </h3>
                <p className="mt-0.5 text-xs text-neutral-200 line-clamp-1">
                  {banner.subtitle}
                </p>
                <div className="mt-3">
                  <Link
                    href={banner.cta_link}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white underline underline-offset-2 transition hover:text-emerald-300"
                  >
                    <span>{banner.cta_text}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
