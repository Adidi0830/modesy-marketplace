/**
 * @file productStore.ts
 * @description Persistensi produk berbasis localStorage untuk mode admin (CRUD).
 * Seed data berasal dari MOCK_PRODUCTS; semua perubahan (create/update/delete)
 * disimpan di localStorage sehingga berkelanjutan antar sesi dev.
 *
 * Store ini berperan sebagai fallback utama bila Supabase tidak dapat
 * melakukan penulisan ( RLS hanya mengizinkan SELECT publik di schema demo ).
 */
import { Product, ProductInput } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mock-data/products";
import { slugify, computeDiscount } from "@/lib/utils/product-utils";

const STORE_KEY = "modesy_products";

/** Membaca seluruh produk dari localStorage (ataau kembalikan seed di server). */
function readAll(): Product[] {
  if (typeof window === "undefined") return MOCK_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed as Product[];
    }
    localStorage.setItem(STORE_KEY, JSON.stringify(MOCK_PRODUCTS));
    return MOCK_PRODUCTS;
  } catch {
    return MOCK_PRODUCTS;
  }
}

/** Menuliskan seluruh produk ke localStorage (amatan no-op di server). */
function writeAll(products: Product[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(products));
  } catch {
    /* kuota penuh — abaikan pada dev */
  }
}

/** Membuat ID unik sederhana berbasis timestamp + indeks acak. */
function generateId(): string {
  return `prod-${Date.now().toString(36).slice(-6)}${Math.random().toString(36).slice(2, 5)}`;
}

export const productStore = {
  getAll(): Product[] {
    return readAll();
  },

  getById(id: string): Product | undefined {
    return readAll().find((p) => p.id === id);
  },

  create(input: ProductInput): Product {
    const product: Product = {
      id: generateId(),
      title: input.title,
      slug: input.slug || slugify(input.title),
      price: input.price,
      original_price: input.original_price,
      rating: 0,
      reviews_count: 0,
      image_url: input.image_url,
      category_name: input.category_name,
      is_featured: !!input.is_featured,
      is_special_offer: !!input.is_special_offer,
      discount_percentage: computeDiscount(input.original_price, input.price),
      stock: input.stock ?? 0,
    };
    const products = readAll();
    writeAll([product, ...products]);
    return product;
  },

  update(id: string, input: ProductInput): Product | undefined {
    const products = readAll();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    const existing = products[idx];
    const updated: Product = {
      ...existing,
      title: input.title,
      slug: input.slug || slugify(input.title),
      price: input.price,
      original_price: input.original_price,
      image_url: input.image_url,
      category_name: input.category_name,
      is_featured: !!input.is_featured,
      is_special_offer: !!input.is_special_offer,
      discount_percentage: computeDiscount(input.original_price, input.price),
      stock: input.stock ?? 0,
    };
    products[idx] = updated;
    writeStore(products);
    return updated;
  },

  delete(id: string): boolean {
    const products = readAll();
    if (!products.some((p) => p.id === id)) return false;
    writeAll(products.filter((p) => p.id !== id));
    return true;
  },

  subtractStock(id: string, quantity: number): boolean {
    const products = readAll();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    const currentStock = products[idx].stock ?? 0;
    products[idx] = {
      ...products[idx],
      stock: Math.max(0, currentStock - quantity),
    };
    writeStore(products);
    return true;
  },
};

/* Alias internal agar pembaruan konsisten. */
const writeStore = writeAll;
