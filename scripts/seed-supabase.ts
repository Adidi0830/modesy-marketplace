/**
 * @file seed-supabase.ts
 * @description Script untuk melakukan seeding mock data ke Supabase Database
 * Jalankan dengan: npx tsx scripts/seed-supabase.ts
 */

import { createClient } from "@supabase/supabase-js";
import { MOCK_CATEGORIES } from "../src/lib/mock-data/categories";
import { MOCK_PRODUCTS } from "../src/lib/mock-data/products";
import { MOCK_HERO_BANNERS, MOCK_PROMO_BANNERS } from "../src/lib/mock-data/banners";
import { MOCK_BRANDS } from "../src/lib/mock-data/brands";
import { MOCK_BLOG_POSTS } from "../src/lib/mock-data/blogs";
import { seedUsers } from "./seed-users";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function seed() {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("your-project")) {
    console.error("Harap isi NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("Memulai proses seed data ke Supabase...");

  // Seed Categories
  await supabase.from("categories").upsert(MOCK_CATEGORIES);
  console.log("✓ Categories seeded");

  // Seed Products
  await supabase.from("products").upsert(MOCK_PRODUCTS);
  console.log("✓ Products seeded");

  // Seed Banners
  await supabase.from("banners").upsert([...MOCK_HERO_BANNERS, ...MOCK_PROMO_BANNERS]);
  console.log("✓ Banners seeded");

  // Seed Brands
  await supabase.from("brands").upsert(MOCK_BRANDS);
  console.log("✓ Brands seeded");

  // Seed Blog Posts
  await supabase.from("blog_posts").upsert(MOCK_BLOG_POSTS);
  console.log("✓ Blog Posts seeded");

  // Seed 4 Role Users
  await seedUsers();

  console.log("Seeding selesai dengan sukses!");
}

seed().catch((err) => {
  console.error("Gagal melakukan seed:", err);
  process.exit(1);
});
