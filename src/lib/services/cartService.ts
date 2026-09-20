/**
 * @file cartService.ts
 * @description Layanan data keranjang belanja yang langsung berinteraksi dengan Supabase
 */

import { CartItem, Product } from "@/types";
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
 * Mengambil item keranjang untuk user tertentu langsung dari Supabase
 */
export async function getCartFromDB(userId: string): Promise<CartItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return [];

  try {
    const { data: cartItems, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        quantity,
        product_id,
        created_at,
        products (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("Notice: Cart query to Supabase:", error.message || error);
      return [];
    }

    const items: CartItem[] = [];

    for (const item of cartItems || []) {
      const prod = Array.isArray(item.products) ? item.products[0] : item.products;
      if (prod) {
        items.push({
          product: mapProduct(prod),
          quantity: item.quantity,
        });
      } else if (item.product_id) {
        const fallbackProd = productStore.getById(item.product_id) || MOCK_PRODUCTS.find(p => p.id === item.product_id);
        if (fallbackProd) {
          items.push({
            product: fallbackProd,
            quantity: item.quantity,
          });
        }
      }
    }

    return items;
  } catch (err) {
    console.warn("Unexpected error in getCartFromDB:", err);
    return [];
  }
}

/**
 * Menambahkan atau mengupdate kuantitas item keranjang di Supabase
 */
export async function addToCartDB(userId: string, productId: string, quantity = 1): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !userId || !productId) return false;

  try {
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle();

    if (existingItem) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("cart_items")
        .insert({ user_id: userId, product_id: productId, quantity });
      if (error) throw error;
    }
    return true;
  } catch (err) {
    console.warn("Error in addToCartDB:", err);
    return false;
  }
}

/**
 * Mengubah jumlah kuantitas produk di keranjang Supabase
 */
export async function updateCartQuantityDB(userId: string, productId: string, quantity: number): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !userId || !productId || quantity < 1) return false;

  try {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("Error in updateCartQuantityDB:", err);
    return false;
  }
}

/**
 * Menghapus produk dari keranjang Supabase
 */
export async function removeFromCartDB(userId: string, productId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !userId || !productId) return false;

  try {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("Error in removeFromCartDB:", err);
    return false;
  }
}

/**
 * Mengosongkan seluruh keranjang user di Supabase
 */
export async function clearCartDB(userId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return false;

  try {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("Error in clearCartDB:", err);
    return false;
  }
}
