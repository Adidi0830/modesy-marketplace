"use client";

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
 * Slide tunggal dengan layout visual responsif persis seperti screenshot Modesy
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
      <div className="relative z-10 flex h-full w-full items-center px-6 xs:px-10 sm:px-14 md:px-20 lg:px-24">
        <div className="max-w-[280px] xs:max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
          {banner.tagline && (
            <span className="mb-2 inline-block rounded-xs bg-[#00a896] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase sm:mb-2.5 sm:px-2.5 sm:text-xs">
              {banner.tagline}
            </span>
          )}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight">
            {banner.title}
          </h1>
          {banner.subtitle && (
            <p className="mt-2 text-xs xs:text-sm sm:text-base text-white/95 drop-shadow-xs line-clamp-3 leading-relaxed">
              {banner.subtitle}
            </p>
          )}
          <div className="mt-4 sm:mt-6">
            <Link
              href={banner.cta_link}
              className="inline-flex items-center justify-center rounded bg-[#222222] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-black"
            >
              <span>{banner.cta_text || "Explore Now"}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
