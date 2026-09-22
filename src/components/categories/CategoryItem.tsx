import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types";

export interface CategoryItemProps {
  category: Category;
}

/**
 * CategoryItem Component
 * Item kategori lingkaran responsif khas Modesy Marketplace (3 kolom di mobile)
 */
export const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
  return (
    <Link
      href={`#category-${category.slug}`}
      className="group flex flex-col items-center text-center transition focus:outline-none w-full"
    >
      {/* Lingkaran Avatar Gambar */}
      <div className="relative h-20 w-20 xs:h-24 xs:w-24 sm:h-24 sm:w-24 md:h-28 md:w-28 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 shadow-2xs transition-all duration-300 group-hover:scale-105 group-hover:border-[#00a896] group-hover:shadow-md">
        <Image
          src={category.image_url}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 96px, 112px"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Label Kategori */}
      <span className="mt-2 w-full max-w-[100px] text-center text-[12px] sm:text-xs md:text-sm font-medium text-neutral-800 transition group-hover:text-[#00a896] leading-tight">
        {category.name}
      </span>
    </Link>
  );
};
