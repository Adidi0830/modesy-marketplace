/**
 * @file wishlistService.ts
 * @description Layanan data wishlist yang langsung berinteraksi dengan Supabase
 */

import { Product } from "@/types";
import { getSupabaseClient } from "@/lib/supabase/client";
import { productStore } from "@/lib/stores/productStore";
import { MOCK_PRODUCTS } from "@/lib/mock-data/products";

function normalizePrice(val?: number | null): number | undefined {
  if (val == null || isNaN(val)) return undefined;
  const num = Number(val);
  if (num >= 1000) return Math.round((num / 1000) * 100) / 100;
  return Math.round(num * 100) / 100;
}

function mapProduct(row: any): Product {
  const rawPrice = Number(row.price || 0);
  const rawDiscountPrice = row.discount_price != null ? Number(row.discount_price) : undefined;
  const price = normalizePrice(rawPrice) || 0;
  const discountPrice = normalizePrice(rawDiscountPrice);
  const originalPrice = discountPrice ? price : normalizePrice(row.original_price);
  const finalPrice = discountPrice ? discountPrice : price;
  const discountPercentage = row.discount_percentage ?? (originalPrice && originalPrice > finalPrice
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0);

  const categoryName = Array.isArray(row.categories)
    ? row.categories[0]?.name || "General"
    : row.categories?.name || row.category_name || "General";

  return {
    id: String(row.id),
    title: row.title || row.name || "Product",
    slug: row.slug || "product",
    price: finalPrice,
    original_price: originalPrice,
    rating: Number(row.rating || 4.8),
    reviews_count: Number(row.reviews_count || 12),
    image_url: row.image_url || "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
    category_name: categoryName,
    discount_percentage: discountPercentage,
    stock: row.stock ?? 20,
  };
}

/**
 * Mengambil daftar produk wishlist milik user
 */
export async function getWishlistFromDB(userId: string): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return [];

  try {
    const { data: wishlistItems, error } = await supabase
      .from("wishlist_items")
      .select(`
        id,
        product_id,
        products (*)
      `)
      .eq("user_id", userId);

    if (error) {
      console.warn("Notice: Wishlist query to Supabase:", error.message || error);
      return [];
    }

    const items: Product[] = [];

    for (const item of wishlistItems || []) {
      const prod = Array.isArray(item.products) ? item.products[0] : item.products;
      if (prod) {
        items.push(mapProduct(prod));
      } else if (item.product_id) {
        const fallbackProd = productStore.getById(item.product_id) || MOCK_PRODUCTS.find(p => p.id === item.product_id);
        if (fallbackProd) items.push(fallbackProd);
      }
    }

    return items;
  } catch (err) {
    console.warn("Unexpected error in getWishlistFromDB:", err);
    return [];
  }
}

/**
 * Menambahkan atau menghapus produk dari wishlist (toggle)
 */
export async function toggleWishlistDB(userId: string, productId: string): Promise<"added" | "removed" | null> {
  const supabase = getSupabaseClient();
  if (!supabase || !userId || !productId) return null;

  try {
    const { data: existingItem } = await supabase
      .from("wishlist_items")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle();

    if (existingItem) {
      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("id", existingItem.id);
      if (error) throw error;
      return "removed";
    } else {
      const { error } = await supabase
        .from("wishlist_items")
        .insert({ user_id: userId, product_id: productId });
      if (error) throw error;
      return "added";
    }
  } catch (err) {
    console.warn("Error in toggleWishlistDB:", err);
    return null;
  }
}

/**
 * Menghapus produk dari wishlist
 */
export async function removeFromWishlistDB(userId: string, productId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !userId || !productId) return false;

  try {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("Error in removeFromWishlistDB:", err);
    return false;
  }
}
