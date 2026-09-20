-- Migration: ensure profiles table has is_super_admin column
-- Run this in your Supabase SQL editor.

alter table "profiles"
  add column if not exists "is_super_admin" boolean default false;

-- Optional: index for fast lookups
create index if not exists "profiles_is_super_admin_idx" on "profiles" ("is_super_admin");
