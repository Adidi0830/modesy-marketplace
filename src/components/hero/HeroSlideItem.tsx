import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Banner } from "@/types";

export interface HeroSlideItemProps {
  banner: Banner;
  isActive: boolean;
}

/**
 * HeroSlideItem Component
 * Slide tunggal dengan layout visual responsif sempurna di mobile & desktop
 */
export const HeroSlideItem: React.FC<HeroSlideItemProps> = ({
  banner,
  isActive,
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-700 ${
        isActive ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"
      }`}
    >
      {/* Background Image Dinamis */}
      <Image
        src={banner.image_url}
        alt={banner.title}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Konten Teks & Call-to-Action */}
      <div className="relative z-10 flex h-full w-full items-center px-6 xs:px-8 sm:px-14 md:px-20 lg:px-24">
        <div className="max-w-[220px] xs:max-w-xs sm:max-w-lg lg:max-w-xl">
          {banner.tagline && (
            <span className="mb-1.5 inline-block rounded-xs bg-emerald-600 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase sm:mb-2 sm:px-2.5 sm:text-xs">
              {banner.tagline}
            </span>
          )}
          <h1 className="text-base font-extrabold tracking-tight text-white drop-shadow-md xs:text-lg sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
            {banner.title}
          </h1>
          {banner.subtitle && (
            <p className="mt-1 text-[10px] text-white/95 drop-shadow-xs line-clamp-2 max-w-[200px] xs:max-w-xs sm:mt-2 sm:text-sm sm:max-w-md md:text-base">
              {banner.subtitle}
            </p>
          )}
          <div className="mt-2.5 xs:mt-3 sm:mt-5 md:mt-6">
            <Link
              href={banner.cta_link}
              className="inline-flex items-center justify-center rounded-xs bg-[#18181b] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-black sm:px-5 sm:py-2.5 sm:text-xs md:text-sm"
            >
              <span>{banner.cta_text || "Shop Now"}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
