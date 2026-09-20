import React from "react";

/**
 * Props untuk komponen Container
 */
export interface ContainerProps {
  /** Elemen anak di dalam kontainer */
  children: React.ReactNode;
  /** Kelas Tailwind tambahan opsional */
  className?: string;
}

/**
 * Komponen pembungkus responsif dengan padding mobile-first
 * Baseline mobile: px-4, Desktop: sm:px-6 lg:px-8, max-w-7xl
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};
