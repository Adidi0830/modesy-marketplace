import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/types";

export interface BrandLogoProps {
  brand: Brand;
}

/**
 * BrandLogo Component
 * Kartu logo mitra brand dengan efek grayscale hover
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ brand }) => {
  return (
    <Link
      href={`#brand-${brand.slug}`}
      className="group flex h-20 items-center justify-center rounded-lg border border-neutral-200 bg-white p-4 shadow-2xs transition hover:border-emerald-500 hover:shadow-xs sm:h-24"
    >
      <div className="relative h-10 w-24 sm:h-12 sm:w-28">
        <Image
          src={brand.logo_url}
          alt={brand.name}
          fill
          sizes="(max-width: 640px) 96px, 112px"
          className="object-contain filter grayscale transition duration-300 group-hover:filter-none group-hover:scale-105"
        />
      </div>
    </Link>
  );
};
