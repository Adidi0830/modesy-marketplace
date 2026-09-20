/**
 * @file brand.ts
 * @description Tipe data untuk entitas merek/brand mitra e-commerce
 */

/**
 * Representasi brand mitra
 */
export interface Brand {
  /** Identifier unik brand */
  id: string;
  /** Nama brand (contoh: 'Nike', 'Zara') */
  name: string;
  /** Slug URL brand */
  slug: string;
  /** URL logo brand beresolusi tinggi */
  logo_url: string;
}
