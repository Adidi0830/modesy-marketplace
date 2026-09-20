/**
 * @file blog.ts
 * @description Tipe data untuk artikel blog e-commerce Modesy Marketplace
 */

/**
 * Representasi artikel blog e-commerce
 */
export interface BlogPost {
  /** Identifier unik artikel */
  id: string;
  /** Judul artikel blog */
  title: string;
  /** Slug artikel untuk tautan baca */
  slug: string;
  /** Ringkasan konten artikel */
  excerpt: string;
  /** URL gambar sampul artikel */
  image_url: string;
  /** Nama penulis artikel */
  author: string;
  /** Kategori artikel blog */
  category: string;
  /** Tanggal rilis artikel (ISO string / formatted date) */
  published_at: string;
  /** Estimasi durasi membaca (contoh: '4 min read') */
  read_time?: string;
}
