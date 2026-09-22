import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  className = "mb-3 sm:mb-6",
}) => {
  return (
    <div className={`flex items-center justify-between gap-2 ${className}`}>
      <div>
        <h2 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-neutral-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 hidden text-xs text-neutral-500 sm:block sm:text-sm">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-neutral-800 transition hover:text-[#00a896]"
        >
          <span>{viewAllLabel}</span>
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
};
