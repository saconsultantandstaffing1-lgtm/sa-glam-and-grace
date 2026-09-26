-- ==============================================================================
-- SA GLAM & GRACE (NAIRA FASHION) - COMPLETE SUPABASE DATABASE & STORAGE SCHEMA
-- ==============================================================================
-- Run this complete script in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Click Run
-- ==============================================================================

-- 1. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Customer'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'in-stock',
  image TEXT,
  rating NUMERIC DEFAULT 5.0,
  sales INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" 
  ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert/update/delete products" ON public.products;
CREATE POLICY "Anyone can insert/update/delete products" 
  ON public.products FOR ALL USING (true) WITH CHECK (true);


-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT,
  items_summary TEXT,
  total NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'UPI / Card',
  payment_status TEXT DEFAULT 'Paid',
  status TEXT DEFAULT 'Processing',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
CREATE POLICY "Anyone can view orders" 
  ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create or modify orders" ON public.orders;
CREATE POLICY "Anyone can create or modify orders" 
  ON public.orders FOR ALL USING (true) WITH CHECK (true);


-- 4. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  color TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;
CREATE POLICY "Anyone can view order items" 
  ON public.order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items" 
  ON public.order_items FOR ALL USING (true) WITH CHECK (true);


-- 5. CUSTOMERS DIRECTORY TABLE
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  orders_count INTEGER DEFAULT 0,
  total_spend NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view customers" ON public.customers;
CREATE POLICY "Anyone can view customers" 
  ON public.customers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can manage customers" ON public.customers;
CREATE POLICY "Anyone can manage customers" 
  ON public.customers FOR ALL USING (true) WITH CHECK (true);


-- 6. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'percentage',
  value NUMERIC NOT NULL,
  min_spend NUMERIC DEFAULT 0,
  usage_limit INTEGER DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view coupons" ON public.coupons;
CREATE POLICY "Anyone can view coupons" 
  ON public.coupons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can manage coupons" ON public.coupons;
CREATE POLICY "Anyone can manage coupons" 
  ON public.coupons FOR ALL USING (true) WITH CHECK (true);


-- 7. SUPABASE STORAGE BUCKETS (product-images & banners)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('banners', 'banners', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access Product Images" ON storage.objects;
CREATE POLICY "Public Access Product Images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('product-images', 'banners'));

DROP POLICY IF EXISTS "Upload Access Product Images" ON storage.objects;
CREATE POLICY "Upload Access Product Images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('product-images', 'banners'));

DROP POLICY IF EXISTS "Update Access Product Images" ON storage.objects;
CREATE POLICY "Update Access Product Images"
  ON storage.objects FOR UPDATE
  USING (bucket_id IN ('product-images', 'banners'));

DROP POLICY IF EXISTS "Delete Access Product Images" ON storage.objects;
CREATE POLICY "Delete Access Product Images"
  ON storage.objects FOR DELETE
  USING (bucket_id IN ('product-images', 'banners'));


-- 8. INITIAL LUXURY SEED DATA
INSERT INTO public.products (id, name, category, price, original_price, stock, status, image, rating, sales)
VALUES 
  ('NF-101', 'Handcrafted Chikankari Anarkali Set', 'Anarkali', 8499, 10999, 24, 'in-stock', 'assets/images/about_anarkali.png', 4.9, 142),
  ('NF-102', 'Royal Crimson Zari Bridal Lehenga', 'Lehenga', 24999, 32000, 8, 'low-stock', 'assets/images/about_lehenga.png', 5.0, 89),
  ('NF-103', 'Pure Banarasi Katan Silk Saree', 'Saree', 14500, 18500, 18, 'in-stock', 'assets/images/about_saree.png', 4.8, 210),
  ('NF-104', 'Embroidered Georgette Peplum Top & Sharara', 'Tops', 5299, 6999, 35, 'in-stock', 'assets/images/about_tops.png', 4.7, 165),
  ('NF-105', 'Velvet Royal Churidar & Zardozi Kurti', 'Churidar', 7800, 9500, 0, 'out-of-stock', 'assets/images/chudidar.png', 4.9, 115),
  ('NF-106', 'Heritage Organza Hand-Painted Dupatta', 'Dupatta', 3499, 4200, 42, 'in-stock', 'assets/images/dupatta.png', 4.9, 310),
  ('NF-107', 'Pastel Mint Mirror-Work Gown', 'Gowns', 11999, 15000, 12, 'in-stock', 'assets/images/hero_1.png', 4.8, 76),
  ('NF-108', 'Gulab Velvet Embroidered Kurta Set', 'Kurta', 6499, 8200, 19, 'in-stock', 'assets/images/hero_2.png', 4.6, 98)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.customers (id, name, email, phone, orders_count, total_spend, status)
VALUES
  ('CUST-001', 'Priya Sharma', 'priya.sharma@gmail.com', '+91 98765 43210', 4, 38496, 'Active'),
  ('CUST-002', 'Ananya Deshmukh', 'ananya.d@outlook.com', '+91 98111 22334', 6, 84200, 'VIP'),
  ('CUST-003', 'Kavita Reddy', 'kavita.reddy@yahoo.co.in', '+91 97444 55667', 2, 14998, 'Active'),
  ('CUST-004', 'Meera Kapoor', 'meera.kapoor@gmail.com', '+91 99222 33445', 5, 52390, 'VIP'),
  ('CUST-005', 'Shalini Verma', 'shalini.v@gmail.com', '+91 98333 11223', 1, 3499, 'Inactive')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, customer_name, customer_email, customer_phone, total, payment_method, payment_status, status, items_summary, created_at)
VALUES
  ('ORD-9821', 'Priya Sharma', 'priya.sharma@gmail.com', '+91 98765 43210', 8499, 'UPI / GPay', 'Paid', 'Delivered', '1x Chikankari Anarkali Set (M)', now() - interval '2 days'),
  ('ORD-9822', 'Ananya Deshmukh', 'ananya.d@outlook.com', '+91 98111 22334', 24999, 'Credit Card', 'Paid', 'Shipped', '1x Royal Crimson Zari Bridal Lehenga (L)', now() - interval '1 day'),
  ('ORD-9823', 'Kavita Reddy', 'kavita.reddy@yahoo.co.in', '+91 97444 55667', 14500, 'Net Banking', 'Paid', 'Processing', '1x Pure Banarasi Katan Silk Saree', now() - interval '4 hours'),
  ('ORD-9824', 'Meera Kapoor', 'meera.kapoor@gmail.com', '+91 99222 33445', 5299, 'Cash on Delivery', 'Pending', 'Pending', '1x Embroidered Georgette Peplum (S)', now() - interval '30 minutes')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.coupons (id, code, type, value, min_spend, usage_limit, used_count, status)
VALUES
  ('CPN-1', 'ROYAL20', 'percentage', 20, 5000, 200, 48, 'active'),
  ('CPN-2', 'FESTIVE15', 'percentage', 15, 3000, 500, 112, 'active'),
  ('CPN-3', 'FLAT1000', 'fixed', 1000, 8000, 100, 31, 'active'),
  ('CPN-4', 'BRIDAL10', 'percentage', 10, 15000, 50, 12, 'active')
ON CONFLICT (id) DO NOTHING;
