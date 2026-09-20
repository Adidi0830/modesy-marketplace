/**
 * @file category.ts
 * @description Tipe data untuk kategori produk e-commerce Modesy Marketplace
 */

/**
 * Representasi kategori produk
 */
export interface Category {
  /** Identifier unik kategori */
  id: string;
  /** Nama kategori (contoh: 'Women Clothing') */
  name: string;
  /** Slug URL ramah SEO */
  slug: string;
  /** URL gambar thumbnail kategori dari Supabase Storage / Fallback */
  image_url: string;
  /** Nama ikon (opsional untuk menu navigasi) */
  icon?: string;
  /** Jumlah total produk dalam kategori */
  product_count?: number;
  /** ID induk untuk sub-kategori */
  parent_id?: string | null;
}
