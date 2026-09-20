/**
 * @file blogService.ts
 * @description Layanan artikel blog marketplace dengan Supabase & fallback
 */

import { BlogPost } from "@/types";
import { getSupabaseClient } from "@/lib/supabase/client";
import { MOCK_BLOG_POSTS } from "@/lib/mock-data/blogs";

/**
 * Mengambil daftar artikel blog terbaru
 * @param {number} limit - Jumlah maksimal artikel
 * @returns {Promise<BlogPost[]>}
 */
export async function getLatestBlogPosts(limit = 3): Promise<BlogPost[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return MOCK_BLOG_POSTS.slice(0, limit);
  }

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return MOCK_BLOG_POSTS.slice(0, limit);
    }

    return data as BlogPost[];
  } catch (err) {
    console.warn("Gagal mengambil blog posts, gunakan fallback:", err);
    return MOCK_BLOG_POSTS.slice(0, limit);
  }
}
