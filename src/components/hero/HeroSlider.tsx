"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "@/types";
import { HeroSlideItem } from "./HeroSlideItem";

export interface HeroSliderProps {
  banners: Banner[];
}

/**
 * HeroSlider Component
 * Carousel banner utama dengan responsive height yang seimbang di mobile & desktop
 */
export const HeroSlider: React.FC<HeroSliderProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play rotasi slide setiap 6 detik
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative h-[200px] w-full overflow-hidden bg-neutral-900 xs:h-[240px] sm:h-[300px] md:h-[380px] lg:h-[440px] xl:h-[480px]">
      {/* List Slide Banner */}
      {banners.map((banner, index) => (
        <HeroSlideItem
          key={banner.id}
          banner={banner}
          isActive={index === currentIndex}
        />
      ))}

      {/* Kontrol Navigasi Prev & Next */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute top-1/2 left-2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs transition hover:bg-black/70 sm:left-6 sm:h-10 sm:w-10"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute top-1/2 right-2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs transition hover:bg-black/70 sm:right-6 sm:h-10 sm:w-10"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:bottom-4">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all sm:h-2 ${
                  idx === currentIndex
                    ? "w-5 bg-emerald-500 sm:w-6"
                    : "w-1.5 bg-white/60 hover:bg-white sm:w-2"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
