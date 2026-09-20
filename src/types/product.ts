/**
 * @file product.ts
 * @description Tipe data untuk entitas produk e-commerce Modesy Marketplace
 */

/**
 * Representasi produk marketplace
 */
export interface Product {
  /** Identifier unik produk */
  id: string;
  /** Judul atau nama produk */
  title: string;
  /** Slug produk untuk link URL */
  slug: string;
  /** Harga saat ini dalam USD */
  price: number;
  /** Harga asli sebelum diskon (opsional jika diskon) */
  original_price?: number;
  /** Rata-rata rating produk (1.0 - 5.0) */
  rating: number;
  /** Jumlah total ulasan pelanggan */
  reviews_count: number;
  /** URL gambar produk dinamis (Supabase / Unsplash fallback) */
  image_url: string;
  /** ID kategori produk */
  category_id?: string;
  /** Nama kategori untuk ditampilkan di card */
  category_name?: string;
  /** Status apakah produk termasuk featured */
  is_featured?: boolean;
  /** Status apakah produk merupakan penawaran khusus */
  is_special_offer?: boolean;
  /** Persentase diskon yang dihitung otomatis */
  discount_percentage?: number;
  /** Stok ketersediaan produk */
  stock?: number;
  /** Deskripsi lengkap produk */
  description?: string;
  /** Deskripsi singkat produk */
  short_description?: string;
  /** Tag / kata kunci produk */
  tags?: string[];
  /** Tipe produk (physical / digital) */
  product_type?: string;
  /** Tipe listing (sale, quote, etc) */
  listing_type?: string;
  /** Daftar URL gambar tambahan */
  images?: string[];
}

/**
 * Payload untuk membuat atau memperbarui produk via admin CRUD.
 * Dipisahkan dari {@link Product} karena `id`, `rating`, `reviews_count`,
 * dan `discount_percentage` dihitung otomatis oleh sistem.
 */
export interface ProductInput {
  title: string;
  slug?: string;
  price: number;
  original_price?: number;
  image_url: string;
  category_name?: string;
  is_featured?: boolean;
  is_special_offer?: boolean;
  stock?: number;
}
