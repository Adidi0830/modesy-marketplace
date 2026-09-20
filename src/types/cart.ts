/**
 * @file cart.ts
 * @description Tipe data untuk keranjang belanja (cart) dan wishlist
 */

import { Product } from "./product";

/**
 * Representasi item dalam keranjang belanja
 */
export interface CartItem {
  /** Produk yang ditambahkan */
  product: Product;
  /** Kuantitas / jumlah unit produk */
  quantity: number;
}

/**
 * Kontrak state management keranjang belanja
 */
export interface CartContextType {
  /** Daftar item pada keranjang */
  items: CartItem[];
  /** Jumlah total kuantitas semua item */
  cartCount: number;
  /** Subtotal harga semua item */
  cartSubtotal: number;
  /** Status drawer terbuka/tutup */
  isCartOpen: boolean;
  /** Menambah produk ke keranjang (quantity default 1) */
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  /** Menghapus satu item produk dari keranjang */
  removeFromCart: (productId: string) => Promise<void>;
  /** Memperbarui kuantitas item pada keranjang */
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  /** Mengosongkan seluruh keranjang */
  clearCart: () => Promise<void>;
  /** Membuka drawer keranjang */
  openCart: () => void;
  /** Menutup drawer keranjang */
  closeCart: () => void;
}

/**
 * Kontrak state management wishlist
 */
export interface WishlistContextType {
  /** Daftar produk favorit */
  items: Product[];
  /** Jumlah total item pada wishlist */
  wishlistCount: number;
  /** Status modal wishlist terbuka/tutup */
  isWishlistOpen: boolean;
  /** Menoggle keberadaan produk pada wishlist */
  toggleWishlist: (product: Product) => void;
  /** Memeriksa apakah produk ada pada wishlist */
  isInWishlist: (productId: string) => boolean;
  /** Menghapus satu produk dari wishlist */
  removeFromWishlist: (productId: string) => void;
  /** Membuka modal wishlist */
  openWishlist: () => void;
  /** Menutup modal wishlist */
  closeWishlist: () => void;
}
