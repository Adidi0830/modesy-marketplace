/**
 * @file client.ts
 * @description Inisialisasi klien Supabase browser dengan fallback yang aman
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Memeriksa apakah konfigurasi Supabase lengkap
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl !== "https://your-project.supabase.co"
  );
};

/**
 * Instance Supabase Client tunggal (singleton)
 */
let supabaseInstance: SupabaseClient | null = null;

/**
 * Mengambil atau menginisialisasi klien Supabase
 * @returns {SupabaseClient | null}
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};
