import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Props untuk SectionHeading
 */
export interface SectionHeadingProps {
  /** Judul section utama */
  title: string;
  /** Subtitle atau deskripsi singkat */
  subtitle?: string;
  /** Label link aksi (contoh: 'View All') */
  viewAllLabel?: string;
  /** Tautan tujuan tombol aksi */
  viewAllHref?: string;
  /** Custom className tambahan */
  className?: string;
}

/**
 * Komponen header section responsif dengan title, subtitle, dan link aksi
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  viewAllLabel = "View All",
  viewAllHref,
  className = "mb-4 sm:mb-6",
}) => {
  return (
    <div className={`flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs text-neutral-500 sm:text-sm">{subtitle}</p>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex items-center text-xs font-semibold text-emerald-600 transition hover:text-emerald-700 sm:text-sm"
        >
          {viewAllLabel}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      )}
    </div>
  );
};
