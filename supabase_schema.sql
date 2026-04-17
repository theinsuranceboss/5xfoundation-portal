-- SQL Schema for Five Time Foundation™
-- Run this in your Supabase SQL Editor

-- 1. SITE CONTENT (CMS)
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL, -- e.g., 'mission_statement', 'founder_bio'
  content TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. EVENTS
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. GALLERY MEDIA
CREATE TABLE gallery_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  category TEXT, -- e.g., 'Community', 'Fundraiser'
  media_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ADVERTISEMENT BANNERS
CREATE TABLE ad_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  location TEXT NOT NULL CHECK (location IN ('footer', 'sidebar')),
  clicks INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PRODUCTS (For Pricing Sync)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  sku TEXT UNIQUE,
  category TEXT
);

-- Insert initial values
INSERT INTO site_content (section_key, content) VALUES 
('mission_statement', 'Five Time Foundation™ empowers cancer warriors to reclaim mobility, confidence, and connection after limb loss. We provide access to prosthetics, ease care-related costs, and build a strong, supportive community grounded in perseverance, strength, and purpose.'),
('founder_bio', 'Rich Canci is a proud six-time cancer survivor and amputee who founded the foundation in 2016...');

INSERT INTO products (name, base_price, category) VALUES
('"fckcncr" Unisex T-Shirt', 30.00, 'T-Shirts'),
('Burgundy Unisex Hoodie', 50.00, 'Hoodies');

-- Enable Row Level Security (RLS)
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allow public read, restrict write to authenticated admin)
CREATE POLICY "Public Read Site Content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public Read Events" ON events FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON gallery_media FOR SELECT USING (true);
CREATE POLICY "Public Read Ads" ON ad_banners FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

-- (Admin policies would require auth setup, usually specific to the admin user uid)
