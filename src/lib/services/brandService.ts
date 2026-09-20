/**
 * @file brandService.ts
 * @description Layanan brand mitra dengan integrasi Supabase dan fallback
 */

import { Brand } from "@/types";
import { getSupabaseClient } from "@/lib/supabase/client";
import { MOCK_BRANDS } from "@/lib/mock-data/brands";

/**
 * Mengambil daftar brand mitra terpercaya
 * @returns {Promise<Brand[]>}
 */
export async function getBrands(): Promise<Brand[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return MOCK_BRANDS;
  }

  try {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_BRANDS;
    }

    return data as Brand[];
  } catch (err) {
    console.warn("Gagal mengambil brands, gunakan fallback:", err);
    return MOCK_BRANDS;
  }
}
