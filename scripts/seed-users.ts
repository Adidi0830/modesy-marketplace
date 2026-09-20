#!/usr/bin/env node
// Script untuk seeding 4 akun demo ke database Supabase
// Jalankan: npx tsx --env-file=.env.local scripts/seed-users.ts
// Prerequisite: Run supabase/migrations/add_profile_columns.sql in SQL Editor first

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Environment check:");
console.log("  NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓ loaded" : "✗ MISSING");
console.log("  SUPABASE_SERVICE_ROLE_KEY:", serviceKey ? "✓ loaded" : "✗ MISSING");

if (!supabaseUrl || !serviceKey) {
  console.error("\nMissing required environment variables.");
  console.error("Make sure .env.local exists with:");
  console.error("  NEXT_PUBLIC_SUPABASE_URL=...");
  console.error("  SUPABASE_SERVICE_ROLE_KEY=...");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_USERS = [
  {
    email: "superadmin@modesy.com",
    username: "superadmin",
    full_name: "Super Admin Modesy",
    role: "superadmin",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    phone_number: "+62 812-0000-0001",
    store_name: null,
  },
  {
    email: "moderator@modesy.com",
    username: "moderator",
    full_name: "Moderator Modesy",
    role: "moderator",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    phone_number: "+62 812-0000-0002",
    store_name: null,
  },
  {
    email: "vendor@modesy.com",
    username: "techvendor",
    full_name: "Modesy Tech Store",
    role: "vendor",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    phone_number: "+62 812-0000-0003",
    store_name: "Modesy Official Store",
  },
  {
    email: "member@modesy.com",
    username: "johndoe",
    full_name: "John Doe Member",
    role: "member",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    phone_number: "+62 812-0000-0004",
    store_name: null,
  },
];

export async function seedUsers() {
  console.log("Seeding 4 demo users to Supabase...");

  // Upsert users by email (unique)
  const { data, error } = await supabase
    .from("profiles")
    .upsert(DEMO_USERS, { onConflict: "email" })
    .select();

  if (error) {
    console.error("Error:", error.message);
    if (error.message.includes("column") && error.message.includes("does not exist")) {
      console.error("\n→ Run supabase/migrations/add_profile_columns.sql in Supabase SQL Editor first!");
    }
    process.exit(1);
  }

  console.log(`Successfully seeded ${data?.length || 0} users:`);
  data?.forEach((u) => console.log(`  - ${u.role}: ${u.email} (${u.id})`));
}

seedUsers();