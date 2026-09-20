/**
 * @file banner.ts
 * @description Tipe data untuk hero carousel dan promo banner promosi
 */

/**
 * Tipe penempatan banner di landing page
 */
export type BannerPlacement = "hero" | "mid_promo" | "triple_promo" | "sidebar";

/**
 * Representasi banner promosi
 */
export interface Banner {
  /** Identifier unik banner */
  id: string;
  /** Judul utama banner (contoh: 'Buy Nice and Unique Clothes') */
  title: string;
  /** Subtitle atau keterangan diskon */
  subtitle: string;
  /** Teks tombol Call-to-Action (contoh: 'Shop Now') */
  cta_text: string;
  /** Tautan tujuan tombol */
  cta_link: string;
  /** URL gambar dinamis banner */
  image_url: string;
  /** Tagline kecil di atas judul (opsional) */
  tagline?: string;
  /** Posisi penempatan banner */
  placement: BannerPlacement;
  /** Warna aksen atau tema badge */
  badge_color?: string;
}
