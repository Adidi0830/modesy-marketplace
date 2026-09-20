-- Schema Database Supabase untuk Modesy Marketplace - Vendor Tables
-- Eksekusi file ini pada Supabase SQL Editor untuk menyiapkan tabel & RLS publik

-- Ensure the extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Storage bucket for product images (run in Supabase dashboard or SQL)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Vendors table (store settings, total balance, vendor name)
CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  store_name TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  total_balance NUMERIC(12, 2) DEFAULT 0,
  avatar_url TEXT,
  phone_number TEXT,
  address TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table (with vendor reference)
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
  vendor_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
  is_featured BOOLEAN DEFAULT false,
  is_special_offer BOOLEAN DEFAULT false,
  discount_percentage INT DEFAULT 0,
  stock INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- Orders / Sales table (order ID, status, payment status, date, amount, vendor)
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  vendor_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'cancelled', 'refunded')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'received', 'failed', 'refunded')),
  amount NUMERIC(10, 2) NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  shipping_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- Reviews table (star rating, text, product reference, vendor, timestamp)
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  vendor_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  product_name TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  vendor_id TEXT NOT NULL,
  product_id TEXT,
  customer_id TEXT NOT NULL,
  content TEXT NOT NULL,
  product_name TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  vendor_id TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  max_discount NUMERIC(10, 2),
  min_purchase NUMERIC(10, 2) DEFAULT 0,
  usage_limit INT DEFAULT 0,
  used_count INT DEFAULT 0,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- Quote Requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id TEXT PRIMARY KEY,
  vendor_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  product_ids TEXT[],
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- Refund Requests table
CREATE TABLE IF NOT EXISTS refund_requests (
  id TEXT PRIMARY KEY,
  vendor_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS)
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW Level SECURITY;
ALTER TABLE comments ENABLE ROW Level SECURITY;
ALTER TABLE coupons ENABLE ROW Level Security;
ALTER TABLE quote_requests ENABLE ROW Level Security;
ALTER TABLE refund_requests ENABLE ROW Level Security;

-- Policies for vendors (read/write own data)
DO $$ BEGIN
  CREATE POLICY "Vendor read own profile" ON vendors FOR SELECT USING (user_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Vendor update own profile" ON vendors FOR UPDATE USING (user_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Vendor insert own profile" ON vendors FOR INSERT WITH CHECK (user_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Policies for products
DO $$ BEGIN
  CREATE POLICY "Vendor read own products" ON products FOR SELECT USING (vendor_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Vendor insert own products" ON products FOR INSERT WITH CHECK (vendor_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Vendor update own products" ON products FOR UPDATE USING (vendor_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Policies for orders
DO $$ BEGIN
  CREATE POLICY "Vendor read own orders" ON orders FOR SELECT USING (vendor_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Vendor update own orders" ON orders FOR UPDATE USING (vendor_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Policies for reviews (vendor reads, public creates)
DO $$ BEGIN
  CREATE POLICY "Vendor read own reviews" ON reviews FOR SELECT USING (vendor_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Policies for comments
DO $$ BEGIN
  CREATE POLICY "Vendor read own comments" ON comments FOR SELECT USING (vendor_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public insert comments" ON comments FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Policies for coupons
DO $$ BEGIN
  CREATE POLICY "Vendor read own coupons" ON coupons FOR SELECT USING (vendor_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Vendor manage own coupons" ON coupons FOR ALL USING (vendor_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Public read for orders (vendor checks)
DO $$ BEGIN
  CREATE POLICY "Vendor read own orders detailed" ON orders FOR SELECT USING (vendor_id = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
