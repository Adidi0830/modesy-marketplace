/**
 * @file product-utils.ts
 * @description Helper utilitas kecil untuk produk (slugify, perhitungan diskon, format mata uang USD).
 * Bersifat pure sehingga dapat dipakai di service maupun store.
 */

/**
 * Mengubah string bebas menjadi slug URL yang ramah SEO.
 * Contoh: "Casual Cotton Bomber Jacket!" -> "casual-cotton-bomber-jacket"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Menghitung persentase diskon dari harga asli dan harga jual.
 * Mengembalikan undefined ketika tidak ada diskon yang valid.
 */
export function computeDiscount(original?: number, price?: number): number | undefined {
  if (!original || !price || original <= price) return undefined;
  return Math.max(0, Math.round(((original - price) / original) * 100));
}

/**
 * Memformat angka ke dalam format mata uang USD resmi ($X,XXX.XX)
 */
export function formatUSD(amount: number): string {
  if (isNaN(amount) || amount == null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
