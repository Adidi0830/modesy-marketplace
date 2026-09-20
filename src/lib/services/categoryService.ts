/**
 * @file categoryService.ts
 * @description Layanan data kategori dengan query Supabase dan fallback mock data
 */

import { Category } from "@/types";
import { getSupabaseClient } from "@/lib/supabase/client";
import { MOCK_CATEGORIES } from "@/lib/mock-data/categories";

/**
 * Mengambil daftar 12 kategori utama untuk beranda
 * @returns {Promise<Category[]>} Array objek Category
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return MOCK_CATEGORIES;
  }

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_CATEGORIES;
    }

    // Jika kategori dari database < 12, lengkapi dengan MOCK_CATEGORIES agar grid 12 selalu penuh
    if (data.length < 12) {
      const existingNames = new Set(data.map((c: any) => c.name.toLowerCase()));
      const extra = MOCK_CATEGORIES.filter((c) => !existingNames.has(c.name.toLowerCase()));
      return [...(data as Category[]), ...extra].slice(0, 12);
    }

    return data.slice(0, 12) as Category[];
  } catch (err) {
    console.warn("Gagal mengambil kategori dari Supabase, gunakan fallback:", err);
    return MOCK_CATEGORIES;
  }
}
