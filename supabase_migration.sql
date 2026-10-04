-- ============================================================
-- LIVKAM POWER TECHNOLOGIES - COMPLETE SUPABASE DATABASE SCHEMA
-- Business: Livkam Power Technologies (Bengaluru, Karnataka)
-- Run this entire script in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/shzlxqkjxuyxruthrsam/sql
-- ============================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (Admin & Customer Accounts)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile trigger on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.email, ''),
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
      COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      updated_at = NOW();
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Helper function: Check if current user is Admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- SITE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES
  ('business_name', 'Livkam Power Technologies'),
  ('phone1', '8884988990'),
  ('phone2', '9945535819'),
  ('whatsapp', '8884988990'),
  ('email', 'info@livkampower.in'),
  ('address', '21, Subhash Chandra Bose Rd, Banashankari 2nd Stage, Bendre Nagar, Bengaluru, Karnataka 560070'),
  ('gst', '29CYMPN3694M1ZC'),
  ('business_hours', 'Mon-Sat: 9AM - 7PM'),
  ('google_maps_url', 'https://maps.google.com/?q=21+Subhash+Chandra+Bose+Rd+Banashankari+2nd+Stage+Bengaluru'),
  ('google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.3245!2d77.5495!3d12.9279!'),
  ('facebook_url', 'https://facebook.com'),
  ('instagram_url', 'https://instagram.com'),
  ('youtube_url', 'https://youtube.com'),
  ('linkedin_url', 'https://linkedin.com'),
  ('tagline', 'Smart Power. Sustainable Future.'),
  ('emergency_banner_text', '⚡ 24/7 Emergency UPS Breakdown Support & Mobile Battery Delivery in Bengaluru: +91 8884988990'),
  ('emergency_banner_active', 'true')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_desc TEXT,
  image_url TEXT,
  banner_url TEXT,
  badge TEXT,
  fallback_icon TEXT DEFAULT 'Zap',
  item_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO categories (id, name, slug, short_desc, image_url, banner_url, badge, fallback_icon, item_count, display_order) VALUES
  ('online-ups', 'Online UPS', 'online-ups', 'High-grade pure sine wave online UPS for critical IT and industrial loads.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', 'Industrial & IT', 'Zap', 48, 1),
  ('smf-batteries', 'SMF Batteries', 'smf-batteries', 'Sealed Maintenance-Free VRLA batteries for commercial UPS & backups.', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80', 'Maintenance Free', 'BatteryCharging', 64, 2),
  ('tubular-batteries', 'Tubular Batteries', 'tubular-batteries', 'Deep-cycle robust tubular batteries for long power backup and heavy home use.', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80', 'Long Life', 'Battery', 52, 3),
  ('lithium-ups-batteries', 'Lithium UPS & Batteries', 'lithium-ups-batteries', 'Next-gen LiFePO4 ultra-fast charging energy storage with 10+ year lifespan.', 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80', 'Next-Gen Tech', 'Cpu', 36, 4),
  ('home-inverter', 'Home Inverter', 'home-inverter', 'Pure sine wave home inverters ensuring silent, efficient backup for residences.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', 'Residential', 'Home', 58, 5),
  ('ups-services', 'UPS Services', 'ups-services', 'Certified installation, repair, AMC maintenance, and battery health inspections.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', 'Certified Engineers', 'Wrench', 16, 6),
  ('stabilizer', 'Stabilizer', 'stabilizer', 'Automatic high/low voltage surge protectors for ACs, TVs, and heavy equipment.', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80', 'Surge Protection', 'ShieldAlert', 42, 7),
  ('small-backups', 'Small Backups', 'small-backups', 'Compact line-interactive UPS for desktop PCs, routers, and CCTV systems.', 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1200&q=80', 'Desktop & CCTV', 'Monitor', 30, 8)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- BRANDS
-- ============================================================
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  full_name TEXT,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  logo_text TEXT,
  sub_text TEXT,
  color TEXT DEFAULT '#0f2b48',
  description TEXT,
  banner_url TEXT,
  authorized_partner BOOLEAN DEFAULT TRUE,
  established TEXT,
  country TEXT DEFAULT 'India',
  popular_categories TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO brands (id, name, full_name, slug, logo_text, sub_text, color, description, banner_url, authorized_partner, established, country, popular_categories, display_order) VALUES
  ('apc', 'APC', 'APC by Schneider Electric', 'apc', 'APC', 'by Schneider Electric', '#e11d48', 'Global leader in critical power and digital infrastructure solutions.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', true, '1981', 'USA / Global', ARRAY['online-ups', 'small-backups', 'stabilizer'], 1),
  ('delta', 'Delta', 'Delta Power Solutions', 'delta', 'DELTA', NULL, '#0284c7', 'Renowned for its world-class, energy-saving power management systems.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', true, '1971', 'Taiwan / Global', ARRAY['online-ups', 'lithium-ups-batteries'], 2),
  ('luminous', 'Luminous', 'Luminous Power Technologies', 'luminous', 'LUMINOUS', NULL, '#0369a1', 'Widely recognized as India''s most trusted household and commercial name.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', true, '1988', 'India', ARRAY['home-inverter', 'tubular-batteries', 'smf-batteries'], 3),
  ('microtek', 'Microtek', 'Microtek International', 'microtek', 'MICROTEK', 'TECHNOLOGY WE LIVE', '#dc2626', 'A pioneer in the power sector, delivering robust solar inverters and stabilizers.', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80', true, '1989', 'India', ARRAY['home-inverter', 'stabilizer', 'small-backups'], 4),
  ('vertiv', 'Vertiv', 'Vertiv Liebert Power Systems', 'vertiv', 'VERTIV', NULL, '#111827', 'As the architects of digital continuity, Vertiv delivers the Liebert series of online UPS systems.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', true, '2016 (Liebert 1965)', 'USA / Global', ARRAY['online-ups', 'small-backups'], 5),
  ('numeric', 'Numeric', 'Numeric (A Group Brand of Legrand)', 'numeric', 'numeric', NULL, '#0284c7', 'A top-tier UPS manufacturer backed by Legrand, ensuring continuous power uptime.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', true, '1984', 'India / France', ARRAY['online-ups', 'small-backups'], 6),
  ('elnova', 'Elnova', 'Elnova Power Solutions', 'elnova', 'elnova', NULL, '#0f172a', 'Specializes in heavy-duty industrial online UPS systems and isolation transformers.', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80', true, '1975', 'India', ARRAY['online-ups', 'stabilizer'], 7),
  ('exide', 'Exide', 'Exide Industries Limited', 'exide', 'EXIDE', NULL, '#dc2626', 'Setting the undisputed benchmark in storage battery technology for decades.', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80', true, '1947', 'India', ARRAY['tubular-batteries', 'smf-batteries'], 8),
  ('amaron', 'Amaron', 'Amaron (Amara Raja Energy & Mobility)', 'amaron', 'AMARON', NULL, '#16a34a', 'Famed for their long-lasting zero-maintenance architecture with Silven-X alloy.', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80', true, '2000', 'India', ARRAY['smf-batteries', 'tubular-batteries'], 9),
  ('quanta', 'Quanta', 'Amaron Quanta VRLA Batteries', 'quanta', 'QUANTA', NULL, '#1e293b', 'The pinnacle of industrial-grade heavy standby VRLA batteries with AGM tech.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', true, '2002', 'India', ARRAY['smf-batteries'], 10)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT,
  brand_id TEXT REFERENCES brands(id),
  brand_name TEXT,
  category_id TEXT REFERENCES categories(id),
  category_name TEXT,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  original_price NUMERIC(12,2),
  rating NUMERIC(3,2) DEFAULT 4.8,
  review_count INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 10,
  in_stock BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  capacity TEXT,
  voltage TEXT,
  warranty TEXT,
  short_specs TEXT,
  description TEXT,
  features JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  public_id TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Products
INSERT INTO products (id, name, slug, sku, brand_id, brand_name, category_id, category_name, price, original_price, rating, review_count, stock, in_stock, is_featured, is_bestseller, capacity, voltage, warranty, short_specs, description, features, specifications, display_order) VALUES
('apc-smart-ups-1000va', 'APC Smart-UPS 1000VA', 'apc-smart-ups-1000va', 'APC-SMT1000I', 'apc', 'APC', 'online-ups', 'Online UPS', 42000, 49990, 4.8, 42, 18, true, true, true, '1000VA / 700W', '230V Pure Sine Wave', '2 Years On-Site Comprehensive Warranty', '1000VA / 700W • Pure Sine Wave • LCD Display • SmartSlot', 'Intelligent and efficient network power protection from entry level to scaleable runtime.', '["Intuitive LCD interface","Pure sine wave output","Green mode patent-pending operating mode","Temperature-compensated battery charging"]', '{"Output Power Capacity":"700 Watts / 1.0kVA","Nominal Output Voltage":"230V","Waveform Type":"Sine wave"}', 1),
('luminous-inverlast-150ah', 'Luminous Inverlast 150Ah', 'luminous-inverlast-150ah', 'LUM-ILST150AH', 'luminous', 'Luminous', 'smf-batteries', 'SMF Batteries', 16500, 19200, 4.7, 68, 25, true, true, true, '150Ah', '12V DC', '36 Months (18 Full + 18 Pro-rata)', '150Ah • 12V • Tall Tubular Tech • High Charge Acceptance', 'Engineered with heavy-duty spines cast under high pressure to ensure resistance against corrosion.', '["Ultra-low maintenance","Spine cast under 100 bar high pressure","Superior thermal management"]', '{"Nominal Voltage":"12V","Rated Capacity":"150 Ah @ C20"}', 2),
('exide-tubular-battery-150ah', 'EXIDE Tubular Battery 150Ah', 'exide-tubular-battery-150ah', 'EXD-IT500-150', 'exide', 'Exide', 'tubular-batteries', 'Tubular Batteries', 28000, 32500, 4.9, 95, 14, true, true, true, '150Ah C20', '12V DC', '48 Months Warranty', '150Ah • 12V Tall Tubular • Heavy Duty Cast', 'Exide Inva Tubular IT500 is the undisputed gold standard in inverter batteries.', '["Thick spine plates","Special polyester gauntlet","Ceramic vent plugs"]', '{"Battery Type":"Tall Tubular","Nominal Voltage":"12 Volts","Capacity @ C20":"150 Ah"}', 3),
('microtek-solar-inverter', 'Microtek Solar Inverter', 'microtek-solar-inverter', 'MTK-SOL-1435', 'microtek', 'Microtek', 'home-inverter', 'Home Inverter', 14500, 17000, 4.6, 37, 20, true, true, true, '1435VA / 12V', '230V Pure Sine Wave', '2 Years Replacement', '1435VA • Pure Sine Wave • Solar MPPT / PWM', 'Microtek Hybrid Solar Inverter integrates DSP sine wave technology with intelligent solar charge controller.', '["Intelligent solar power priority mode","Smart PWM / MPPT solar charge controller","Dual charging mode"]', '{"System Rating":"1435 VA / 12V","Max Solar Panel Support":"800 Watts"}', 4),
('vertiv-liebert-gxt5', 'Vertiv Liebert GXT5', 'vertiv-liebert-gxt5', 'VTV-GXT5-3000IRT', 'vertiv', 'Vertiv', 'online-ups', 'Online UPS', 68000, 79000, 4.9, 29, 8, true, true, true, '3000VA / 3000W', '230V Double Conversion', '3 Years On-Site Warranty', '3kVA / 3kW • Unity PF (1.0) • Rack/Tower 2U', 'Enterprise-grade 2U rack/tower double conversion online UPS solution.', '["Unity Power Factor (PF = 1.0)","Rotatable multi-color graphic LCD","Hot-swappable internal battery packs"]', '{"Output Rating":"3000 VA / 3000 W","Topology":"On-Line Double Conversion"}', 5)
ON CONFLICT (id) DO NOTHING;

-- Seed Images
INSERT INTO product_images (product_id, url, display_order) VALUES
('apc-smart-ups-1000va', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', 0),
('luminous-inverlast-150ah', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80', 0),
('exide-tubular-battery-150ah', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80', 0),
('microtek-solar-inverter', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', 0),
('vertiv-liebert-gxt5', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', 0)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_desc TEXT,
  introduction TEXT,
  badge TEXT,
  price_starts_at TEXT,
  turnaround TEXT,
  icon TEXT DEFAULT 'Wrench',
  image_url TEXT,
  banner_url TEXT,
  features JSONB DEFAULT '[]',
  about_content JSONB DEFAULT '[]',
  four_columns JSONB DEFAULT '[]',
  process JSONB DEFAULT '[]',
  technical_info TEXT,
  related_products JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO services (id, slug, title, short_desc, introduction, badge, price_starts_at, turnaround, icon, image_url, features, display_order) VALUES
('ups-installation', 'ups-installation', 'UPS Installation & Commissioning', 'End-to-end professional installation, cabling, load testing, and electrical safety commissioning.', 'Professional UPS installation and commissioning solutions designed for homes and commercial setups.', 'Most Popular', '₹ 1,499', 'Same Day / 24 Hours', 'Wrench', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', '["Load calculation & input/output wire sizing","Earth fault testing & neutral grounding verification","Battery rack assembly & inter-cell torque calibration","Full load testing with safety circuit verification"]', 1),
('ups-maintenance', 'ups-maintenance', 'Preventive UPS Maintenance', 'Scheduled diagnostic health checks, capacitor inspections, and thermal heat imaging.', 'Ensure the longevity and reliability of your UPS systems with preventive maintenance.', 'Recommended', '₹ 999', 'Scheduled Visit', 'ShieldCheck', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80', '["DC bus capacitor ripple voltage analysis","Internal thermal scanning for hotspot detection","Cooling fan bearing check and dust cleaning","Battery internal impedance & conductance audit"]', 2),
('ups-repair', 'ups-repair', 'Emergency UPS Repair & Component Service', 'Rapid fault isolation, motherboard PCB repair, IGBT replacement, and inverter rectifiers.', 'Fast, reliable emergency UPS repair services to get systems back online.', '24/7 Emergency', '₹ 1,299', '2 - 4 Hours Emergency SLA', 'AlertTriangle', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', '["Genuine OEM spare replacement","Faulty IGBT & power module component repair","Loaner/Standby UPS provision for critical clients","90-day comprehensive repair warranty"]', 3),
('battery-replacement', 'battery-replacement', 'Battery Replacement & Buyback', 'Fresh factory-sealed SMF/Tubular battery swap with doorstep installation and old battery scrap buyback.', 'Professional battery replacement services ensuring your backup power systems run smoothly.', 'Best Buyback Value', 'Exchange Discounts Available', 'Instant Doorstep Delivery', 'BatteryCharging', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80', '["100% genuine fresh manufacturing date batteries","Safe eco-friendly recycling with highest scrap rebate","Heavy duty copper link connectors replacement"]', 4),
('amc-maintenance', 'amc-maintenance', 'Annual Maintenance Contracts (AMC)', 'Comprehensive & non-comprehensive AMC agreements with 4hr response time SLA for offices and factories.', 'Zero-stress enterprise power assurance with guaranteed SLAs.', 'Enterprise SLA', 'Custom Corporate Quote', 'Contractual SLA Guarantee', 'FileCheck', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80', '["Guaranteed 4-hour breakdown turnaround time","4 mandatory quarterly preventive maintenance visits","Unlimited breakdown emergency callouts"]', 5)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ENQUIRIES & LEADS
-- ============================================================
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT,
  phone TEXT,
  email TEXT,
  subject TEXT,
  service_name TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compatibility VIEW for customer_enquiries
CREATE OR REPLACE VIEW customer_enquiries AS SELECT * FROM enquiries;

-- ============================================================
-- ORDERS & ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  subtotal NUMERIC(12,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  tax_amount NUMERIC(12,2) DEFAULT 0,
  shipping_address TEXT,
  payment_method TEXT DEFAULT 'UPI',
  payment_status TEXT DEFAULT 'pending',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT,
  product_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- HERO SLIDES & ADVERTISEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  badge TEXT DEFAULT 'Industrial Power Grade',
  cta_primary_text TEXT DEFAULT 'Explore Online UPS',
  cta_primary_url TEXT DEFAULT '/products',
  cta_secondary_text TEXT DEFAULT 'Book Repair Service',
  cta_secondary_url TEXT DEFAULT '/services',
  bg_image TEXT,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO hero_slides (title, subtitle, badge, cta_primary_text, cta_primary_url, cta_secondary_text, cta_secondary_url, display_order) VALUES
('Smart Power. Sustainable Future.', 'High-performance Online UPS, Lithium energy storage, and industrial backup engineering in Bengaluru.', 'Bengaluru''s #1 UPS Specialists', 'Explore Online UPS', '/products', 'Book Repair Service', '/services', 1),
('Certified Multi-Brand UPS Maintenance & AMC', 'Official service engineers for APC, Vertiv, Luminous, Delta and Exide power infrastructure.', 'Same Day Response', 'View AMC Packages', '/services', 'Contact Engineering', '/contact', 2)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS advertisements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT,
  cta_text TEXT DEFAULT 'Explore Now',
  link_url TEXT,
  image_url TEXT,
  mobile_image_url TEXT,
  placement TEXT DEFAULT 'hero' CHECK (placement IN ('hero', 'promo_bar', 'middle_banner', 'sidebar', 'popup')),
  click_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- POSTS & KNOWLEDGE ARTICLES
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  author TEXT DEFAULT 'Livkam Engineering Team',
  category TEXT DEFAULT 'UPS Maintenance',
  read_time TEXT DEFAULT '4 min read',
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO posts (title, slug, excerpt, content, author, category, read_time, is_published) VALUES
('How to Choose the Right Online UPS for Critical IT Workloads', 'how-to-choose-online-ups', 'Understand KVA sizing, power factors, and runtime battery calculations for servers.', 'Detailed guide on sizing and selecting double conversion online UPS units...', 'Livkam Engineering Team', 'Buying Guides', '5 min read', true),
('SMF vs Tubular Batteries: Longevity and Duty Cycle Comparison', 'smf-vs-tubular-batteries', 'A deep dive into lead-acid battery chemistries, cycle lives, and maintenance needs.', 'Comparing VRLA AGM batteries with deep-cycle tall tubular cells...', 'Livkam Technical Team', 'Battery Care', '4 min read', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- REVIEWS & TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  product_name TEXT DEFAULT 'General Service',
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT TRUE,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO reviews (customer_name, product_name, rating, review_text, is_verified, is_approved) VALUES
('Anand Vardhan (Koramangala IT)', 'APC Smart-UPS 1000VA', 5, 'Exceptional doorstep installation in Bengaluru. Our servers have had zero downtime since setup.', true, true),
('Dr. Preethi Rao', 'Tubular Battery 150Ah & Inverter', 5, 'Livkam replaced our clinic battery within 3 hours on a weekend. Highly recommended engineers.', true, true),
('Manjunath Gowda', 'Annual Maintenance Contract', 5, 'Transparent pricing, genuine OEM parts, and courteous technicians. 5 stars.', true, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- CATALOGS & PDF BROCHURES
-- ============================================================
CREATE TABLE IF NOT EXISTS catalogs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  brand_name TEXT DEFAULT 'APC',
  category_name TEXT DEFAULT 'Online UPS',
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size TEXT DEFAULT '2.4 MB PDF',
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WEBSITE CONTENT
-- ============================================================
CREATE TABLE IF NOT EXISTS website_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

INSERT INTO website_content (section, key, value) VALUES
  ('homepage', 'hero_title', 'Smart Power. Sustainable Future.'),
  ('homepage', 'hero_subtitle', 'Leading industrial UPS systems, solar inverters, and high-performance battery solutions in Bengaluru.'),
  ('homepage', 'emergency_banner_text', '⚡ 24/7 Emergency UPS Breakdown Support & Mobile Battery Delivery in Bengaluru: +91 8884988990'),
  ('homepage', 'emergency_banner_active', 'true'),
  ('seo', 'seo_title', 'Livkam Power Technologies | Online UPS, Batteries & Inverters Bengaluru'),
  ('seo', 'seo_description', 'Bangalore''s leading authorized distributor & service provider for APC, Luminous, Exide, and Vertiv Online UPS systems, SMF batteries, and emergency repair.')
ON CONFLICT (section, key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read hero_slides" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Public read advertisements" ON advertisements FOR SELECT USING (true);
CREATE POLICY "Public read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public read catalogs" ON catalogs FOR SELECT USING (true);
CREATE POLICY "Public read website_content" ON website_content FOR SELECT USING (true);

-- 2. Public / Customer Submission Policies
CREATE POLICY "Anyone insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone submit review" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Full Admin Management Policies
CREATE POLICY "Admin manage profiles" ON profiles FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage site_settings" ON site_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage brands" ON brands FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage products" ON products FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage product_images" ON product_images FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage services" ON services FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage enquiries" ON enquiries FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage orders" ON orders FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage order_items" ON order_items FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage hero_slides" ON hero_slides FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage advertisements" ON advertisements FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage posts" ON posts FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage reviews" ON reviews FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage catalogs" ON catalogs FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin manage website_content" ON website_content FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- PERFORMANCE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_is_published ON products(is_published);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_display_order ON product_images(display_order);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_published ON categories(is_published);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);

-- ============================================================
-- STORAGE BUCKETS SETUP (For file & image uploads)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('media', 'media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']),
  ('public', 'public', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public read storage media" ON storage.objects;
CREATE POLICY "Public read storage media" ON storage.objects FOR SELECT USING (bucket_id IN ('media', 'public'));

DROP POLICY IF EXISTS "Anyone upload to media" ON storage.objects;
CREATE POLICY "Anyone upload to media" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('media', 'public'));

DROP POLICY IF EXISTS "Anyone update media" ON storage.objects;
CREATE POLICY "Anyone update media" ON storage.objects FOR UPDATE USING (bucket_id IN ('media', 'public'));

DROP POLICY IF EXISTS "Anyone delete media" ON storage.objects;
CREATE POLICY "Anyone delete media" ON storage.objects FOR DELETE USING (bucket_id IN ('media', 'public'));

