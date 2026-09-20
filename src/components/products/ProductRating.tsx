import React from "react";
import { Star } from "lucide-react";

export interface ProductRatingProps {
  rating: number;
  reviewsCount?: number;
}

/**
 * ProductRating Component
 * Merender 5 bintang rating visual dan counter ulasan pembeli
 */
export const ProductRating: React.FC<ProductRatingProps> = ({
  rating,
  reviewsCount,
}) => {
  const roundedRating = Math.round(rating);

  return (
    <div className="flex items-center gap-1 text-[11px] text-neutral-500 sm:text-xs">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
              star <= roundedRating ? "fill-amber-400" : "fill-neutral-200 text-neutral-200"
            }`}
          />
        ))}
      </div>
      {reviewsCount !== undefined && (
        <span className="font-medium text-neutral-400">({reviewsCount})</span>
      )}
    </div>
  );
};
