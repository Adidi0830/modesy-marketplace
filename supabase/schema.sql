-- Schema Database Supabase untuk Modesy Marketplace
-- Eksekusi file ini pada Supabase SQL Editor untuk menyiapkan tabel & RLS publik

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  icon TEXT,
  product_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  image_url TEXT NOT NULL,
  category_name TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_special_offer BOOLEAN DEFAULT false,
  discount_percentage INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  cta_link TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tagline TEXT,
  placement TEXT NOT NULL,
  badge_color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  published_at TEXT NOT NULL,
  read_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('superadmin', 'moderator', 'vendor', 'member')),
  avatar_url TEXT,
  phone_number TEXT,
  store_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mengaktifkan Row Level Security (RLS) dengan akses publik READ
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public Read Banners" ON banners FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public Read Brands" ON brands FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public Read Blog Posts" ON blog_posts FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;