import React from "react";
import { formatUSD } from "@/lib/utils/product-utils";

export interface ProductPriceProps {
  price: number;
  originalPrice?: number;
}

/**
 * ProductPrice Component
 * Format tampilan harga produk dan harga coret (diskon) dalam format USD
 */
export const ProductPrice: React.FC<ProductPriceProps> = ({
  price,
  originalPrice,
}) => {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-sm font-bold text-neutral-900 sm:text-base">
        {formatUSD(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <span className="text-xs text-neutral-400 line-through">
          {formatUSD(originalPrice)}
        </span>
      )}
    </div>
  );
};
