import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

// ── Read .env.local ──────────────────────────────────────────────────────────
function loadEnv(): Record<string, string> {
  const envPath = path.resolve(__dirname, "../../.env.local");
  const content = fs.readFileSync(envPath, "utf-8");
  const env: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    env[key] = value;
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

// ── SQL Schema ───────────────────────────────────────────────────────────────
const SQL = `
-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  description text DEFAULT '' CHECK (char_length(description) <= 5000),
  price numeric(10,2) NOT NULL CHECK (price > 0 AND price < 100000),
  collection text NOT NULL CHECK (collection IN ('vulnerabilite', 'eveil', 'ferocite')),
  category text NOT NULL CHECK (category IN ('pret-a-porter', 'lingerie', 'accessoires')),
  subcategory text NOT NULL CHECK (char_length(subcategory) <= 100),
  colors jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  sizes jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 1 AND 200),
  customer_email text NOT NULL CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
  customer_address text DEFAULT '' CHECK (char_length(customer_address) <= 500),
  items jsonb NOT NULL,
  total numeric(10,2) NOT NULL CHECK (total > 0 AND total < 1000000),
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Server-side order total validation function
CREATE OR REPLACE FUNCTION validate_order_total()
RETURNS TRIGGER AS $$
DECLARE
  calculated_total numeric(10,2);
  item jsonb;
BEGIN
  -- Calculate total from items
  calculated_total := 0;
  FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
  LOOP
    calculated_total := calculated_total + (
      (item->>'price')::numeric * (item->>'quantity')::integer
    );
  END LOOP;

  -- Allow 1 cent tolerance for rounding
  IF ABS(NEW.total - calculated_total) > 0.01 THEN
    RAISE EXCEPTION 'Order total (%) does not match calculated total (%)', NEW.total, calculated_total;
  END IF;

  -- Ensure items array is not empty
  IF jsonb_array_length(NEW.items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  -- Set user_id from authenticated user
  NEW.user_id := auth.uid();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER validate_order_before_insert
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION validate_order_total();

-- Admin check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT email FROM auth.users WHERE id = auth.uid())
    IN ('amunico07@gmail.com', 'alex.moreno32390@gmail.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products policies (admin-only write, public read)
CREATE POLICY "products_select" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "products_update" ON products FOR UPDATE USING (is_admin());
CREATE POLICY "products_delete" ON products FOR DELETE USING (is_admin());

-- Orders policies (authenticated insert, users see own orders, admin sees all)
CREATE POLICY "orders_insert" ON orders FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "orders_select_own" ON orders FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "orders_select_admin" ON orders FOR SELECT
  USING (is_admin());
CREATE POLICY "orders_update" ON orders FOR UPDATE USING (is_admin());

-- Site settings table (key-value store for homepage video, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY CHECK (char_length(key) BETWEEN 1 AND 100),
  value text NOT NULL DEFAULT '' CHECK (char_length(value) <= 10000),
  updated_at timestamptz DEFAULT now()
);

-- Site settings policies (admin-only write, public read)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings_select" ON site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_insert" ON site_settings FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "site_settings_update" ON site_settings FOR UPDATE USING (is_admin());
CREATE POLICY "site_settings_delete" ON site_settings FOR DELETE USING (is_admin());

-- Insert default hero video setting
INSERT INTO site_settings (key, value) VALUES ('hero_video_url', '')
ON CONFLICT (key) DO NOTHING;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
`.trim();

// ── Storage policies SQL ─────────────────────────────────────────────────────
const STORAGE_SQL = `
-- Storage bucket policies (run AFTER creating buckets in Dashboard)
-- Bucket: product-images (public read, admin write)
CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND (SELECT is_admin()));

CREATE POLICY "product_images_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND (SELECT is_admin()));

-- Bucket: site-assets (public read, admin write)
CREATE POLICY "site_assets_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

CREATE POLICY "site_assets_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-assets' AND (SELECT is_admin()));

CREATE POLICY "site_assets_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-assets' AND (SELECT is_admin()));
`.trim();

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Test connection
  const { error } = await supabase.from("products").select("id").limit(1);

  if (error && !error.message.includes("does not exist")) {
    console.log("Connection successful (table may not exist yet).\n");
  } else {
    console.log("Connected to Supabase.\n");
  }

  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  Copy and paste the SQL below into the Supabase SQL Editor  ║");
  console.log("║  Dashboard → SQL Editor → New query → Paste → Run          ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log();
  console.log("═══════════════════ SCHEMA + RLS POLICIES ═══════════════════");
  console.log();
  console.log(SQL);
  console.log();
  console.log("═══════════════════ STORAGE BUCKET POLICIES ═══════════════════");
  console.log();
  console.log("⚠️  First create these buckets in Dashboard → Storage:");
  console.log("   1. product-images (public)");
  console.log("   2. site-assets (public)");
  console.log("   Then run this SQL:");
  console.log();
  console.log(STORAGE_SQL);
  console.log();
  console.log("──────────────────────────────────────────────────────────────");
  console.log("After running the SQL, execute the seed script:");
  console.log("  npx tsx lib/data/seed.ts");
}

main().catch(console.error);
