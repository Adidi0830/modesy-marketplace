/**
 * @file productService.ts
 * @description Layanan data produk e-commerce dengan Supabase & fallback
 */

import { Product, ProductInput } from "@/types";
import { getSupabaseClient } from "@/lib/supabase/client";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { MOCK_PRODUCTS } from "@/lib/mock-data/products";
import { productStore } from "@/lib/stores/productStore";
import { slugify, computeDiscount } from "@/lib/utils/product-utils";

function getClient() {
  return getSupabaseAdmin() || getSupabaseClient();
}

function normalizePrice(val?: number | null): number | undefined {
  if (val == null || isNaN(val)) return undefined;
  const num = Number(val);
  if (num >= 1000) return Math.round((num / 1000) * 100) / 100;
  return Math.round(num * 100) / 100;
}

function mapRowToProduct(row: any): Product {
  const rawPrice = Number(row.price || 0);
  const rawDiscountPrice = row.discount_price != null ? Number(row.discount_price) : undefined;

  const price = normalizePrice(rawPrice) || 0;
  const discountPrice = normalizePrice(rawDiscountPrice);

  const originalPrice = discountPrice ? price : (normalizePrice(row.original_price));
  const finalPrice = discountPrice ? discountPrice : price;
  const discountPercentage = row.discount_percentage ?? (originalPrice && originalPrice > finalPrice
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0);

  return {
    id: String(row.id),
    title: row.title || row.name || "Product",
    slug: row.slug || slugify(row.title || row.name || "product"),
    price: finalPrice,
    original_price: originalPrice,
    rating: Number(row.rating || 4.8),
    reviews_count: Number(row.reviews_count || 12),
    image_url: row.image_url || "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
    category_id: row.category_id,
    category_name: row.categories?.name || row.category_name || "General",
    is_featured: row.is_featured ?? true,
    is_special_offer: row.is_special_offer ?? (Boolean(discountPrice)),
    discount_percentage: discountPercentage,
    stock: row.stock ?? 20,
    description: row.description || "",
    short_description: row.short_description || "",
    product_type: row.product_type || "physical",
    listing_type: row.listing_type || "sale",
  };
}

/**
 * Mengambil daftar produk unggulan (Featured Products)
 */
export async function getFeaturedProducts(limit: number = 12): Promise<Product[]> {
  const supabase = getClient();
  if (!supabase) {
    return MOCK_PRODUCTS.slice(0, limit);
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .limit(limit);

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS.slice(0, limit);
    }

    return data.map(mapRowToProduct);
  } catch (err) {
    console.warn("Gagal mengambil featured products, gunakan fallback:", err);
    return MOCK_PRODUCTS.slice(0, limit);
  }
}

/**
 * Mengambil daftar penawaran khusus (Special Offers)
 */
export async function getSpecialOfferProducts(limit: number = 6): Promise<Product[]> {
  const supabase = getClient();
  if (!supabase) {
    return MOCK_PRODUCTS.filter((p) => p.is_special_offer || (p.discount_percentage && p.discount_percentage > 0)).slice(0, limit);
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS.filter((p) => p.is_special_offer || (p.discount_percentage && p.discount_percentage > 0)).slice(0, limit);
    }

    return data.map(mapRowToProduct);
  } catch (err) {
    console.warn("Gagal mengambil special offers, gunakan fallback:", err);
    return MOCK_PRODUCTS.filter((p) => p.is_special_offer || (p.discount_percentage && p.discount_percentage > 0)).slice(0, limit);
  }
}

/**
 * Mengambil daftar produk terbaru (Latest Products)
 */
export async function getLatestProducts(limit: number = 12): Promise<Product[]> {
  const supabase = getClient();
  if (!supabase) {
    return [...MOCK_PRODUCTS].reverse().slice(0, limit);
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return [...MOCK_PRODUCTS].reverse().slice(0, limit);
    }

    return data.map(mapRowToProduct);
  } catch (err) {
    console.warn("Gagal mengambil latest products, gunakan fallback:", err);
    return [...MOCK_PRODUCTS].reverse().slice(0, limit);
  }
}

/**
 * Mengambil seluruh produk (untuk admin CRUD).
 */
export async function getAllProducts(): Promise<Product[]> {
  const supabase = getClient();
  if (!supabase) return productStore.getAll();

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return productStore.getAll();
    return data.map(mapRowToProduct);
  } catch (err) {
    console.warn("Gagal mengambil products, gunakan fallback:", err);
    return productStore.getAll();
  }
}

/**
 * Mengambil satu produk berdasarkan ID.
 */
export async function getProductById(id: string): Promise<Product | undefined> {
  const supabase = getClient();
  if (!supabase) return productStore.getById(id);

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("id", id)
      .maybeSingle();
      
    if (error || !data) return productStore.getById(id);
    return mapRowToProduct(data);
  } catch (err) {
    console.warn("Gagal mengambil product by id, gunakan fallback:", err);
    return productStore.getById(id);
  }
}

/**
 * Membuat produk baru.
 */
export async function createProduct(input: ProductInput): Promise<Product> {
  const payload = {
    name: input.title,
    title: input.title,
    slug: input.slug || slugify(input.title),
    price: input.price,
    discount_price: input.original_price ? input.price : null,
    image_url: input.image_url,
    category_name: input.category_name,
    stock: input.stock ?? 10,
  };

  const supabase = getClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("products").insert(payload).select("*, categories(name)").maybeSingle();
      if (data && !error) return mapRowToProduct(data);
    } catch (err) {
      console.warn("Supabase createProduct gagal, gunakan local store:", err);
    }
  }
  return productStore.create(input);
}

/**
 * Memperbarui produk yang ada.
 */
export async function updateProduct(id: string, input: ProductInput): Promise<Product | undefined> {
  const payload = {
    name: input.title,
    title: input.title,
    slug: input.slug || slugify(input.title),
    price: input.price,
    image_url: input.image_url,
    stock: input.stock ?? 10,
  };

  const supabase = getClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", id)
        .select("*, categories(name)")
        .maybeSingle();
      if (data && !error) return mapRowToProduct(data);
    } catch (err) {
      console.warn("Supabase updateProduct gagal, gunakan local store:", err);
    }
  }
  return productStore.update(id, input);
}

/**
 * Menghapus produk.
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.warn("Supabase deleteProduct gagal, gunakan local store:", err);
    }
  }
  return productStore.delete(id);
}

/**
 * Mengambil produk berdasarkan kategori
 */
export async function getProductsByCategory(categoryName: string, limit: number = 8): Promise<Product[]> {
  const supabase = getClient();
  if (!supabase) {
    return MOCK_PRODUCTS.filter((p) => p.category_name === categoryName).slice(0, limit);
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .limit(limit);

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS.filter((p) => p.category_name === categoryName).slice(0, limit);
    }

    return data.map(mapRowToProduct);
  } catch (err) {
    console.warn(`Gagal mengambil produk untuk kategori ${categoryName}, gunakan fallback:`, err);
    return MOCK_PRODUCTS.filter((p) => p.category_name === categoryName).slice(0, limit);
  }
}
