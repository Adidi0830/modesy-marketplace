/**
 * @file navigation.ts
 * @description Tipe data untuk elemen navigasi, bahasa, dan mata uang
 */

/**
 * Pilihan bahasa antarmuka
 */
export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

/**
 * Pilihan mata uang
 */
export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

/**
 * Item menu navigasi
 */
export interface NavItem {
  label: string;
  href: string;
  isNew?: boolean;
  isHot?: boolean;
  subItems?: { label: string; href: string }[];
}
