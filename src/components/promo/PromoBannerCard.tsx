import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Banner } from "@/types";

export interface PromoBannerCardProps {
  banner: Banner;
}

/**
 * PromoBannerCard Component
 * Kartu banner promo tengah halaman dengan efek zoom & gradient kontras
 */
export const PromoBannerCard: React.FC<PromoBannerCardProps> = ({ banner }) => {
  return (
    <div className="group relative h-48 w-full overflow-hidden rounded-xl bg-neutral-900 shadow-sm transition sm:h-56 md:h-64">
      {/* Dynamic Promo Image */}
      <Image
        src={banner.image_url}
        alt={banner.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/40 to-transparent" />

      {/* Content Text & Link */}
      <div className="relative z-10 flex h-full flex-col justify-center p-6 sm:p-8">
        {banner.tagline && (
          <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase sm:text-xs">
            {banner.tagline}
          </span>
        )}

        <h3 className="mt-1 text-lg font-bold text-white sm:text-2xl">
          {banner.title}
        </h3>

        <p className="mt-1 max-w-xs text-xs text-neutral-200 line-clamp-2 sm:text-sm">
          {banner.subtitle}
        </p>

        <div className="mt-4">
          <Link
            href={banner.cta_link}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white underline underline-offset-4 transition hover:text-emerald-300 sm:text-sm"
          >
            <span>{banner.cta_text}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
