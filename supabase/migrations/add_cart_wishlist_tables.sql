-- Migration: Add Cart and Wishlist Tables
-- Eksekusi file ini pada Supabase SQL Editor

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Wishlist Items Table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cart_items
DO $$ BEGIN
  CREATE POLICY "Users can view own cart items" ON cart_items FOR SELECT USING (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own cart items" ON cart_items FOR INSERT WITH CHECK (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own cart items" ON cart_items FOR UPDATE USING (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own cart items" ON cart_items FOR DELETE USING (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- RLS Policies for wishlist_items
DO $$ BEGIN
  CREATE POLICY "Users can view own wishlist items" ON wishlist_items FOR SELECT USING (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own wishlist items" ON wishlist_items FOR INSERT WITH CHECK (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own wishlist items" ON wishlist_items FOR DELETE USING (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);