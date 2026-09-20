import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types";

export interface CategoryItemProps {
  category: Category;
}

/**
 * CategoryItem Component
 * Item kategori lingkaran responsif khas Modesy Marketplace
 */
export const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
  return (
    <Link
      href={`#category-${category.slug}`}
      className="group flex flex-col items-center text-center transition focus:outline-none"
    >
      {/* Lingkaran Avatar Gambar */}
      <div className="relative h-14 w-14 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 p-0.5 transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-500 group-hover:shadow-md sm:h-20 sm:w-20 sm:border-2 sm:p-1 md:h-24 md:w-24">
        <div className="relative h-full w-full overflow-hidden rounded-full">
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 56px, (max-width: 768px) 80px, 96px"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Label Kategori */}
      <span className="mt-1.5 max-w-[70px] truncate text-[11px] font-semibold text-neutral-800 transition group-hover:text-emerald-600 sm:mt-2.5 sm:max-w-[110px] sm:text-xs md:text-sm">
        {category.name}
      </span>
    </Link>
  );
};
