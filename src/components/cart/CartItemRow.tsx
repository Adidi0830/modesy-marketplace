"use client";

import React from "react";
import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem } from "@/types";
import { useCart } from "@/context/CartContext";
import { ProductPrice } from "@/components/products/ProductPrice";

const qtyBtn =
  "flex h-6 w-6 items-center justify-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-100";

export const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <li className="flex gap-3 p-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded">
        <Image
          src={item.product.image_url}
          alt={item.product.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <p className="line-clamp-2 text-sm font-semibold">
          {item.product.title}
        </p>
        <div className="mt-1">
          <ProductPrice
            price={item.product.price}
            originalPrice={item.product.original_price}
          />
        </div>
<div className="mt-1 flex items-center gap-1">
          <button
            onClick={() =>
              updateQuantity(item.product.id, item.quantity - 1)
            }
            className={qtyBtn}
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="text-xs font-medium">{item.quantity}</span>
          <button
            onClick={() =>
              updateQuantity(item.product.id, item.quantity + 1)
            }
            className={qtyBtn}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
        </div>
        <button
          onClick={() => removeFromCart(item.product.id)}
          aria-label="Remove from cart"
          className="self-start p-1 text-neutral-400 hover:text-rose-500"
        >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
};
