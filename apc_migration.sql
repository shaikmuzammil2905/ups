-- ============================================================
-- APC ONLINE UPS PAGE CMS — SUPABASE MIGRATION
-- Livkam Power Technologies
-- Run in: https://supabase.com/dashboard/project/shzlxqkjxuyxruthrsam/sql
-- ============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. APC PAGE SECTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS apc_page_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_type TEXT NOT NULL,
  label TEXT,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  content TEXT,
  paragraphs JSONB DEFAULT '[]',
  image_url TEXT,
  image_alt TEXT,
  image_caption TEXT,
  image_position TEXT DEFAULT 'right',
  bg_style TEXT DEFAULT 'white',
  cta_buttons JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. APC SECTION ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS apc_section_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_id UUID REFERENCES apc_page_sections(id) ON DELETE CASCADE,
  item_number TEXT,
  icon TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  image_alt TEXT,
  link_url TEXT,
  link_text TEXT,
  application TEXT,
  metadata JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. APC PAGE IMAGES TABLE (Gallery)
-- ============================================================
CREATE TABLE IF NOT EXISTS apc_page_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_id UUID REFERENCES apc_page_sections(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  public_id TEXT,
  alt_text TEXT,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. APC PAGE ENQUIRIES TABLE (Customer Submissions)
-- ============================================================
CREATE TABLE IF NOT EXISTS apc_enquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT,
  company_name TEXT,
  phone TEXT,
  email TEXT,
  requirement TEXT,
  preferred_contact TEXT DEFAULT 'phone',
  message TEXT,
  source TEXT DEFAULT 'apc_page',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'closed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. APC PAGE META TABLE (SEO & Page-Level Settings)
-- ============================================================
CREATE TABLE IF NOT EXISTS apc_page_meta (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_status TEXT DEFAULT 'published' CHECK (page_status IN ('draft', 'published')),
  seo_title TEXT DEFAULT 'APC Online UPS Solutions | Livkam Power Technologies',
  seo_description TEXT DEFAULT 'Explore APC Online UPS solutions from Livkam Power Technologies for reliable power protection, clean power delivery and dependable backup for critical applications.',
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT DEFAULT '/products/online-ups/apc',
  last_updated_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. APC ENQUIRY FORM CONFIG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS apc_enquiry_form_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  field_key TEXT UNIQUE NOT NULL,
  field_label TEXT NOT NULL,
  field_type TEXT DEFAULT 'text' CHECK (field_type IN ('text', 'email', 'tel', 'textarea', 'select', 'radio')),
  placeholder TEXT,
  options JSONB DEFAULT '[]',
  is_required BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE apc_page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE apc_section_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE apc_page_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE apc_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE apc_page_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE apc_enquiry_form_config ENABLE ROW LEVEL SECURITY;

-- Helper admin function fallback if not exists
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.role() = 'authenticated');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public Read Policies
DROP POLICY IF EXISTS "Public read apc_page_sections" ON apc_page_sections;
CREATE POLICY "Public read apc_page_sections" ON apc_page_sections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read apc_section_items" ON apc_section_items;
CREATE POLICY "Public read apc_section_items" ON apc_section_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read apc_page_images" ON apc_page_images;
CREATE POLICY "Public read apc_page_images" ON apc_page_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read apc_page_meta" ON apc_page_meta;
CREATE POLICY "Public read apc_page_meta" ON apc_page_meta FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read apc_enquiry_form_config" ON apc_enquiry_form_config;
CREATE POLICY "Public read apc_enquiry_form_config" ON apc_enquiry_form_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone submit apc_enquiry" ON apc_enquiries;
CREATE POLICY "Anyone submit apc_enquiry" ON apc_enquiries FOR INSERT WITH CHECK (true);

-- Admin Management Policies
DROP POLICY IF EXISTS "Admin manage apc_page_sections" ON apc_page_sections;
CREATE POLICY "Admin manage apc_page_sections" ON apc_page_sections FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin manage apc_section_items" ON apc_section_items;
CREATE POLICY "Admin manage apc_section_items" ON apc_section_items FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin manage apc_page_images" ON apc_page_images;
CREATE POLICY "Admin manage apc_page_images" ON apc_page_images FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin manage apc_enquiries" ON apc_enquiries;
CREATE POLICY "Admin manage apc_enquiries" ON apc_enquiries FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin manage apc_page_meta" ON apc_page_meta;
CREATE POLICY "Admin manage apc_page_meta" ON apc_page_meta FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin manage apc_enquiry_form_config" ON apc_enquiry_form_config;
CREATE POLICY "Admin manage apc_enquiry_form_config" ON apc_enquiry_form_config FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- 8. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_apc_sections_sort ON apc_page_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_apc_sections_type ON apc_page_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_apc_items_section ON apc_section_items(section_id);
CREATE INDEX IF NOT EXISTS idx_apc_items_sort ON apc_section_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_apc_images_section ON apc_page_images(section_id);
CREATE INDEX IF NOT EXISTS idx_apc_enquiries_status ON apc_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_apc_enquiries_created ON apc_enquiries(created_at DESC);

-- ============================================================
-- 9. SEED DATA: PAGE META
-- ============================================================
INSERT INTO apc_page_meta (page_status, seo_title, seo_description, og_title, og_description, canonical_url, last_updated_by)
SELECT 'published',
       'APC Online UPS Solutions | Livkam Power Technologies',
       'Explore APC Online UPS solutions from Livkam Power Technologies for reliable power protection, clean power delivery and dependable backup for critical applications.',
       'APC Online UPS Solutions | Livkam Power Technologies',
       'Discover APC Online UPS solutions engineered to deliver reliable, continuous and high-quality power protection for critical equipment, businesses and demanding environments.',
       '/products/online-ups/apc',
       'Admin'
WHERE NOT EXISTS (SELECT 1 FROM apc_page_meta);

-- ============================================================
-- 10. SEED DATA: ENQUIRY FORM FIELDS
-- ============================================================
INSERT INTO apc_enquiry_form_config (field_key, field_label, field_type, placeholder, is_required, is_visible, sort_order) VALUES
  ('customer_name', 'Full Name', 'text', 'Your full name', true, true, 1),
  ('company_name', 'Company Name', 'text', 'Your company or organisation name', false, true, 2),
  ('phone', 'Phone Number', 'tel', '+91 98765 43210', true, true, 3),
  ('email', 'Email Address', 'email', 'your@email.com', false, true, 4),
  ('requirement', 'Requirement', 'text', 'e.g. 3kVA Online UPS for server room', false, true, 5),
  ('preferred_contact', 'Preferred Contact Method', 'select', '', false, true, 6),
  ('message', 'Message / Additional Details', 'textarea', 'Describe your power backup requirements, load, location, etc.', false, true, 7)
ON CONFLICT (field_key) DO NOTHING;

UPDATE apc_enquiry_form_config
SET options = '[{"label":"Phone Call","value":"phone"},{"label":"WhatsApp","value":"whatsapp"},{"label":"Email","value":"email"}]'
WHERE field_key = 'preferred_contact';

-- ============================================================
-- 11. SEED DATA: PAGE SECTIONS
-- ============================================================
INSERT INTO apc_page_sections (section_type, label, title, subtitle, description, image_url, image_alt, cta_buttons, sort_order, is_visible, status, settings)
SELECT 'hero',
       'APC POWER PROTECTION',
       'APC Online UPS Solutions',
       'Reliable Power Protection for Critical Applications',
       'Discover APC Online UPS solutions engineered to deliver reliable, continuous and high-quality power protection for critical equipment, businesses and demanding environments.',
       'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=85',
       'APC Online UPS — Livkam Power Technologies',
       '[{"text":"Explore APC Solutions","link":"#solutions","style":"primary"},{"text":"Contact Us","link":"/contact","style":"secondary"}]',
       1, true, 'published', '{}'
WHERE NOT EXISTS (SELECT 1 FROM apc_page_sections WHERE section_type='hero');

INSERT INTO apc_page_sections (section_type, label, title, paragraphs, image_url, image_alt, image_caption, image_position, sort_order, is_visible, status, settings)
SELECT 'content',
       'APC POWER PROTECTION',
       'About APC Online UPS',
       '["APC by Schneider Electric is a globally recognised leader in critical power and cooling infrastructure. APC Online UPS systems use double-conversion technology to deliver clean, stable, continuous power that is completely isolated from the raw utility supply — protecting connected equipment from all major power disturbances.","Livkam Power Technologies is an authorised partner for APC Online UPS systems in Bengaluru. Our engineering team provides end-to-end support including site assessment, system selection, professional installation, commissioning, and ongoing maintenance contracts.","Whether you need to protect a single server, a server room, a data centre, a medical facility, or a manufacturing plant — APC Online UPS systems provide the level of power protection your critical infrastructure demands."]',
       'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=85',
       'APC Online UPS Installation',
       'APC Online UPS — Professional Installation by Livkam',
       'right', 2, true, 'published', '{}'
WHERE NOT EXISTS (SELECT 1 FROM apc_page_sections WHERE section_type='content');

INSERT INTO apc_page_sections (section_type, label, title, description, sort_order, is_visible, status, settings)
SELECT 'why_apc', 'WHY CHOOSE APC', 'Why Choose APC Online UPS?', 'APC Online UPS systems are engineered for mission-critical environments where power interruptions are not an option.', 3, true, 'published', '{}'
WHERE NOT EXISTS (SELECT 1 FROM apc_page_sections WHERE section_type='why_apc');

INSERT INTO apc_page_sections (section_type, label, title, description, sort_order, is_visible, status, settings)
SELECT 'solutions', 'APC PRODUCT RANGE', 'APC Online UPS Product Range', 'APC offers a comprehensive range of Online UPS systems designed for applications from small offices to large enterprise data centres.', 4, true, 'published', '{}'
WHERE NOT EXISTS (SELECT 1 FROM apc_page_sections WHERE section_type='solutions');

INSERT INTO apc_page_sections (section_type, label, title, description, sort_order, is_visible, status, settings)
SELECT 'applications', 'APPLICATIONS', 'Where APC Online UPS Solutions Are Used', 'APC Online UPS systems are deployed across a broad range of industries and applications requiring continuous, high-quality power protection.', 5, true, 'published', '{}'
WHERE NOT EXISTS (SELECT 1 FROM apc_page_sections WHERE section_type='applications');

INSERT INTO apc_page_sections (section_type, label, title, description, sort_order, is_visible, status, settings)
SELECT 'benefits', 'KEY BENEFITS', 'Key Benefits of APC Online UPS Systems', 'APC Online UPS technology delivers measurable advantages for organisations that depend on continuous, reliable power.', 6, true, 'published', '{}'
WHERE NOT EXISTS (SELECT 1 FROM apc_page_sections WHERE section_type='benefits');

INSERT INTO apc_page_sections (section_type, label, title, description, sort_order, is_visible, status, settings)
SELECT 'technical', 'TECHNOLOGY', 'APC Online UPS — Key Technology', 'APC Online UPS systems incorporate advanced power electronics and intelligent management technology to deliver industry-leading performance.', 7, true, 'published', '{}'
WHERE NOT EXISTS (SELECT 1 FROM apc_page_sections WHERE section_type='technical');

INSERT INTO apc_page_sections (section_type, label, title, description, sort_order, is_visible, status, settings)
SELECT 'how_it_works', 'HOW IT WORKS', 'How an Online UPS Works', 'An Online Double Conversion UPS continuously converts incoming AC power to DC, then back to clean AC — providing zero transfer time and complete isolation from utility power disturbances.', 8, true, 'published', '{}'
WHERE NOT EXISTS (SELECT 1 FROM apc_page_sections WHERE section_type='how_it_works');

INSERT INTO apc_page_sections (section_type, label, title, description, sort_order, is_visible, status, settings)
SELECT 'gallery', 'APC IN ACTION', 'APC Power Protection in Action', 'APC Online UPS systems deployed across data centres, offices, and industrial facilities by Livkam Power Technologies.', 9, true, 'published', '{}'
WHERE NOT EXISTS (SELECT 1 FROM apc_page_sections WHERE section_type='gallery');

INSERT INTO apc_page_sections (section_type, label, title, description, image_url, cta_buttons, sort_order, is_visible, status, settings)
SELECT 'cta', 'GET IN TOUCH', 'Need the Right APC UPS Solution?', 'Our team can help you identify the right power-protection solution based on your application, equipment and operational requirements. Contact us today for a consultation.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80', '[{"text":"Request a Consultation","link":"#enquiry","style":"primary"},{"text":"Call Us Now","link":"tel:+918884988990","style":"secondary"},{"text":"WhatsApp","link":"https://wa.me/918884988990","style":"whatsapp"}]', 10, true, 'published', '{}'
WHERE NOT EXISTS (SELECT 1 FROM apc_page_sections WHERE section_type='cta');

INSERT INTO apc_page_sections (section_type, label, title, sort_order, is_visible, status, settings)
SELECT 'contact', 'CONTACT US', 'Get In Touch', 11, true, 'published', '{}'
WHERE NOT EXISTS (SELECT 1 FROM apc_page_sections WHERE section_type='contact');

INSERT INTO apc_page_sections (section_type, label, title, description, sort_order, is_visible, status, settings)
SELECT 'enquiry_form', 'REQUEST CONSULTATION', 'Request an APC UPS Consultation', 'Fill out the form below and our team will get back to you promptly with the right solution for your power protection requirements.', 12, true, 'published', '{"submit_button_text":"Submit Enquiry"}'
WHERE NOT EXISTS (SELECT 1 FROM apc_page_sections WHERE section_type='enquiry_form');

INSERT INTO apc_page_sections (section_type, label, title, description, sort_order, is_visible, status, settings)
SELECT 'map', 'FIND US', 'Visit Our Showroom', 'Visit our showroom in Bengaluru to see APC Online UPS systems in person and speak with our expert engineers.', 13, true, 'published', '{"map_embed_url":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.3245!2d77.5495!3d12.9279!","address":"21, Subhash Chandra Bose Rd, Banashankari 2nd Stage, Bendre Nagar, Bengaluru, Karnataka 560070"}'
WHERE NOT EXISTS (SELECT 1 FROM apc_page_sections WHERE section_type='map');

-- ============================================================
-- 12. SEED DATA: SECTION ITEMS & CARDS
-- ============================================================

-- Why APC Items
INSERT INTO apc_section_items (section_id, item_number, icon, title, description, sort_order, is_visible)
SELECT s.id, '01', 'ShieldCheck', 'Continuous Power Protection', 'Online double-conversion technology provides uninterrupted, zero-transfer-time power for connected equipment, ensuring no disruption during power events.', 1, true
FROM apc_page_sections s
WHERE s.section_type = 'why_apc'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Continuous Power Protection'
  );

INSERT INTO apc_section_items (section_id, item_number, icon, title, description, sort_order, is_visible)
SELECT s.id, '02', 'Zap', 'Clean & Stable Power Output', 'Delivers clean, regulated sine wave output completely isolated from utility disturbances including surges, sags, spikes, harmonic distortion and frequency variations.', 2, true
FROM apc_page_sections s
WHERE s.section_type = 'why_apc'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Clean & Stable Power Output'
  );

INSERT INTO apc_section_items (section_id, item_number, icon, title, description, sort_order, is_visible)
SELECT s.id, '03', 'BatteryCharging', 'Extended Battery Runtime', 'APC Online UPS systems support extended runtime battery packs, enabling businesses to maintain operations during extended power outages.', 3, true
FROM apc_page_sections s
WHERE s.section_type = 'why_apc'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Extended Battery Runtime'
  );

INSERT INTO apc_section_items (section_id, item_number, icon, title, description, sort_order, is_visible)
SELECT s.id, '04', 'Wifi', 'Intelligent Network Management', 'SmartSlot connectivity supports APC network management cards for remote monitoring, control, and automated shutdown of connected systems via SNMP/Web interface.', 4, true
FROM apc_page_sections s
WHERE s.section_type = 'why_apc'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Intelligent Network Management'
  );

INSERT INTO apc_section_items (section_id, item_number, icon, title, description, sort_order, is_visible)
SELECT s.id, '05', 'Settings', 'Scalable & Modular Architecture', 'APC offers scalable UPS solutions from entry-level to enterprise-grade, with modular designs that grow with your infrastructure requirements.', 5, true
FROM apc_page_sections s
WHERE s.section_type = 'why_apc'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Scalable & Modular Architecture'
  );

INSERT INTO apc_section_items (section_id, item_number, icon, title, description, sort_order, is_visible)
SELECT s.id, '06', 'Award', 'Global Reliability & Certification', 'APC is a globally recognised brand with decades of proven reliability, backed by international certifications and a worldwide service network.', 6, true
FROM apc_page_sections s
WHERE s.section_type = 'why_apc'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Global Reliability & Certification'
  );

-- Solutions Range Items
INSERT INTO apc_section_items (section_id, icon, title, description, application, image_url, link_url, link_text, sort_order, is_visible)
SELECT s.id, 'Zap', 'APC Easy UPS', 'A reliable and affordable Online UPS solution designed for small businesses, retail outlets, and entry-level office environments requiring dependable power backup.', 'Small Offices, Retail, Light Commercial', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', '/contact', 'Enquire Now', 1, true
FROM apc_page_sections s
WHERE s.section_type = 'solutions'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'APC Easy UPS'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, application, image_url, link_url, link_text, sort_order, is_visible)
SELECT s.id, 'Zap', 'APC Smart-UPS', 'The industry-leading Smart-UPS range delivers high-efficiency, high-reliability power protection for network equipment, servers, and storage with intelligent battery management.', 'IT Infrastructure, Network Rooms, SMB Servers', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', '/contact', 'Enquire Now', 2, true
FROM apc_page_sections s
WHERE s.section_type = 'solutions'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'APC Smart-UPS'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, application, image_url, link_url, link_text, sort_order, is_visible)
SELECT s.id, 'Zap', 'APC Smart-UPS On-Line', 'True online double-conversion UPS providing zero transfer time and complete power isolation for mission-critical applications requiring the highest level of power protection.', 'Data Centres, Servers, Medical Equipment, Telecom', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', '/contact', 'Enquire Now', 3, true
FROM apc_page_sections s
WHERE s.section_type = 'solutions'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'APC Smart-UPS On-Line'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, application, image_url, link_url, link_text, sort_order, is_visible)
SELECT s.id, 'Zap', 'APC Galaxy Series', 'Enterprise-grade three-phase online UPS systems designed for large data centres, industrial applications, and critical infrastructure requiring high power capacity and maximum availability.', 'Large Data Centres, Industrial Facilities, Enterprise', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', '/contact', 'Enquire Now', 4, true
FROM apc_page_sections s
WHERE s.section_type = 'solutions'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'APC Galaxy Series'
  );

-- Applications Items
INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'Server', 'Data Centres & Server Rooms', 'Protecting critical compute, storage, and networking infrastructure from power disturbances that could cause data loss, corruption, or system failure.', 1, true
FROM apc_page_sections s
WHERE s.section_type = 'applications'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Data Centres & Server Rooms'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'Monitor', 'IT & Networking Infrastructure', 'Ensuring continuous operation of network switches, routers, firewalls, and communication systems that underpin business connectivity.', 2, true
FROM apc_page_sections s
WHERE s.section_type = 'applications'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'IT & Networking Infrastructure'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'Building2', 'Corporate Offices', 'Protecting workstations, telecommunications systems, and office infrastructure in commercial environments against power interruptions.', 3, true
FROM apc_page_sections s
WHERE s.section_type = 'applications'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Corporate Offices'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'Factory', 'Industrial & Manufacturing', 'Providing clean, stable power for industrial automation systems, SCADA, PLCs, and manufacturing equipment in harsh power environments.', 4, true
FROM apc_page_sections s
WHERE s.section_type = 'applications'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Industrial & Manufacturing'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'Heart', 'Medical & Healthcare Facilities', 'Delivering mission-critical power protection for diagnostic equipment, life support systems, and medical monitoring devices.', 5, true
FROM apc_page_sections s
WHERE s.section_type = 'applications'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Medical & Healthcare Facilities'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'Radio', 'Telecommunications', 'Ensuring continuous operation of telecom towers, base stations, and communication infrastructure in areas with unreliable power supply.', 6, true
FROM apc_page_sections s
WHERE s.section_type = 'applications'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Telecommunications'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'Camera', 'Security & Surveillance Systems', 'Providing uninterrupted power for CCTV cameras, access control systems, alarm panels, and DVR/NVR recording equipment.', 7, true
FROM apc_page_sections s
WHERE s.section_type = 'applications'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Security & Surveillance Systems'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'ShoppingCart', 'Retail & Commercial', 'Protecting point-of-sale systems, inventory management, and retail IT infrastructure from power disruptions during business hours.', 8, true
FROM apc_page_sections s
WHERE s.section_type = 'applications'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Retail & Commercial'
  );

-- Benefits Items
INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'Zap', 'Clean & Stable Power', 'Complete isolation from utility power problems including surges, sags, spikes, harmonic distortion, and frequency variations — delivering pure, conditioned power output.', 1, true
FROM apc_page_sections s
WHERE s.section_type = 'benefits'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Clean & Stable Power'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'Clock', 'Uninterrupted Operation', 'Zero transfer time on-line double-conversion topology ensures connected equipment experiences no interruption during power events or battery switchover.', 2, true
FROM apc_page_sections s
WHERE s.section_type = 'benefits'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Uninterrupted Operation'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'ShieldCheck', 'Comprehensive Protection', 'APC Online UPS systems protect against all nine categories of power problems including surges, spikes, undervoltage, overvoltage, noise, and complete power failures.', 3, true
FROM apc_page_sections s
WHERE s.section_type = 'benefits'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Comprehensive Protection'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'Wifi', 'Intelligent Remote Monitoring', 'Network management capability enables real-time monitoring, automated shutdown, and remote management of UPS systems and connected loads.', 4, true
FROM apc_page_sections s
WHERE s.section_type = 'benefits'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Intelligent Remote Monitoring'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'TrendingUp', 'Scalable Infrastructure', 'Expandable runtime with external battery packs and modular designs allow APC UPS systems to grow with your infrastructure and power requirements.', 5, true
FROM apc_page_sections s
WHERE s.section_type = 'benefits'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Scalable Infrastructure'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'Award', 'Industry-Leading Reliability', 'Decades of proven performance in mission-critical environments worldwide, backed by APCs global service network and comprehensive warranty programmes.', 6, true
FROM apc_page_sections s
WHERE s.section_type = 'benefits'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Industry-Leading Reliability'
  );

-- Technical Specs & Architecture Items
INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'RefreshCw', 'Online Double Conversion', 'The incoming AC power is continuously converted to DC, then back to clean AC — isolating connected equipment completely from the raw utility supply and its associated disturbances.', 1, true
FROM apc_page_sections s
WHERE s.section_type = 'technical'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Online Double Conversion'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'Activity', 'Voltage Regulation', 'Automatic Voltage Regulation (AVR) maintains stable output voltage within tight tolerances regardless of input voltage fluctuations, protecting sensitive equipment from damage.', 2, true
FROM apc_page_sections s
WHERE s.section_type = 'technical'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Voltage Regulation'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'BatteryCharging', 'Intelligent Battery Management', 'Temperature-compensated charging, battery health monitoring, and predictive battery replacement alerts maximise battery life and ensure system reliability.', 3, true
FROM apc_page_sections s
WHERE s.section_type = 'technical'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Intelligent Battery Management'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'Filter', 'Power Conditioning', 'Active filtering removes harmonic distortion and electrical noise from the power supply, delivering a clean, regulated sine wave to connected equipment.', 4, true
FROM apc_page_sections s
WHERE s.section_type = 'technical'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Power Conditioning'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'Wifi', 'Network Management', 'SmartSlot architecture supports APC network management cards for SNMP monitoring, automated graceful server shutdown, environmental monitoring, and remote management.', 5, true
FROM apc_page_sections s
WHERE s.section_type = 'technical'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Network Management'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'GitBranch', 'Automatic Bypass Protection', 'Static bypass circuitry automatically transfers the load to utility power in the event of an internal UPS fault, ensuring continuous equipment operation during maintenance.', 6, true
FROM apc_page_sections s
WHERE s.section_type = 'technical'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Automatic Bypass Protection'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'Globe', 'Extended Runtime Capability', 'Supports connection of external battery packs to extend runtime during prolonged power outages, providing greater operational flexibility for critical applications.', 7, true
FROM apc_page_sections s
WHERE s.section_type = 'technical'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'Extended Runtime Capability'
  );

INSERT INTO apc_section_items (section_id, icon, title, description, sort_order, is_visible)
SELECT s.id, 'BarChart2', 'High Efficiency Operation', 'Advanced power electronics deliver high efficiency across the load range, minimising energy consumption and operational costs whilst maintaining full protection capability.', 8, true
FROM apc_page_sections s
WHERE s.section_type = 'technical'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.title = 'High Efficiency Operation'
  );

-- How It Works Steps
INSERT INTO apc_section_items (section_id, item_number, icon, title, description, sort_order, is_visible)
SELECT s.id, '1', 'Plug', 'Utility Power Input', 'Raw AC power from the utility grid enters the APC Online UPS system. This power may contain surges, sags, spikes, noise, or other disturbances.', 1, true
FROM apc_page_sections s
WHERE s.section_type = 'how_it_works'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.item_number = '1'
  );

INSERT INTO apc_section_items (section_id, item_number, icon, title, description, sort_order, is_visible)
SELECT s.id, '2', 'RefreshCw', 'Rectifier / Charger', 'The rectifier continuously converts incoming AC power to DC while simultaneously charging the internal battery bank, maintaining it at full charge readiness.', 2, true
FROM apc_page_sections s
WHERE s.section_type = 'how_it_works'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.item_number = '2'
  );

INSERT INTO apc_section_items (section_id, item_number, icon, title, description, sort_order, is_visible)
SELECT s.id, '3', 'BatteryCharging', 'Battery / DC Bus', 'The battery bank is constantly maintained at full charge and is always connected in the power path. During a power failure, the battery seamlessly supplies the load with zero transfer time.', 3, true
FROM apc_page_sections s
WHERE s.section_type = 'how_it_works'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.item_number = '3'
  );

INSERT INTO apc_section_items (section_id, item_number, icon, title, description, sort_order, is_visible)
SELECT s.id, '4', 'Zap', 'Inverter', 'The inverter continuously converts DC power back to clean, stable AC power. This power is completely independent of utility quality, delivering pure sine wave output to connected equipment.', 4, true
FROM apc_page_sections s
WHERE s.section_type = 'how_it_works'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.item_number = '4'
  );

INSERT INTO apc_section_items (section_id, item_number, icon, title, description, sort_order, is_visible)
SELECT s.id, '5', 'Server', 'Protected Equipment', 'Connected equipment receives clean, stable, uninterrupted power at all times — completely protected from all utility power problems and outages.', 5, true
FROM apc_page_sections s
WHERE s.section_type = 'how_it_works'
  AND NOT EXISTS (
    SELECT 1 FROM apc_section_items si WHERE si.section_id = s.id AND si.item_number = '5'
  );

-- Gallery Images
INSERT INTO apc_page_images (section_id, image_url, alt_text, caption, sort_order, is_visible)
SELECT s.id, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', 'APC Online UPS Installation', 'APC Online UPS in server room', 1, true
FROM apc_page_sections s
WHERE s.section_type = 'gallery'
  AND NOT EXISTS (
    SELECT 1 FROM apc_page_images pi WHERE pi.section_id = s.id AND pi.alt_text = 'APC Online UPS Installation'
  );

INSERT INTO apc_page_images (section_id, image_url, alt_text, caption, sort_order, is_visible)
SELECT s.id, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', 'UPS Maintenance Service', 'Certified UPS maintenance by Livkam engineers', 2, true
FROM apc_page_sections s
WHERE s.section_type = 'gallery'
  AND NOT EXISTS (
    SELECT 1 FROM apc_page_images pi WHERE pi.section_id = s.id AND pi.alt_text = 'UPS Maintenance Service'
  );

INSERT INTO apc_page_images (section_id, image_url, alt_text, caption, sort_order, is_visible)
SELECT s.id, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', 'Data Centre Power Protection', 'Data centre power infrastructure', 3, true
FROM apc_page_sections s
WHERE s.section_type = 'gallery'
  AND NOT EXISTS (
    SELECT 1 FROM apc_page_images pi WHERE pi.section_id = s.id AND pi.alt_text = 'Data Centre Power Protection'
  );

INSERT INTO apc_page_images (section_id, image_url, alt_text, caption, sort_order, is_visible)
SELECT s.id, 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80', 'Network Room UPS', 'Network room protected by APC UPS', 4, true
FROM apc_page_sections s
WHERE s.section_type = 'gallery'
  AND NOT EXISTS (
    SELECT 1 FROM apc_page_images pi WHERE pi.section_id = s.id AND pi.alt_text = 'Network Room UPS'
  );
