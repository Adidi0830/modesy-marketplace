/**
 * @file bannerService.ts
 * @description Layanan banner hero dan banner promo dengan Supabase & fallback
 */

import { Banner, BannerPlacement } from "@/types";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  MOCK_HERO_BANNERS,
  MOCK_PROMO_BANNERS,
  MOCK_TRIPLE_BANNERS,
} from "@/lib/mock-data/banners";

/**
 * Mengambil daftar banner berdasarkan penempatan (hero / mid_promo / triple_promo)
 * @param {BannerPlacement} placement - Posisi banner
 * @returns {Promise<Banner[]>}
 */
export async function getBanners(placement: BannerPlacement): Promise<Banner[]> {
  const fallback =
    placement === "hero"
      ? MOCK_HERO_BANNERS
      : placement === "triple_promo"
      ? MOCK_TRIPLE_BANNERS
      : MOCK_PROMO_BANNERS;
  const supabase = getSupabaseClient();
  if (!supabase) {
    return fallback;
  }

  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("placement", placement);

    if (error || !data || data.length === 0) {
      return fallback;
    }

    return data as Banner[];
  } catch (err) {
    console.warn(`Gagal mengambil banner ${placement}:`, err);
    return fallback;
  }
}
