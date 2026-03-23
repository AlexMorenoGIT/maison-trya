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
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) NOT NULL,
  collection text NOT NULL CHECK (collection IN ('vulnerabilite', 'eveil', 'ferocite')),
  category text NOT NULL CHECK (category IN ('pret-a-porter', 'lingerie', 'accessoires')),
  subcategory text NOT NULL,
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
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_address text DEFAULT '',
  items jsonb NOT NULL,
  total numeric(10,2) NOT NULL,
  status text DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

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

-- Products policies
CREATE POLICY "products_select" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "products_update" ON products FOR UPDATE USING (is_admin());
CREATE POLICY "products_delete" ON products FOR DELETE USING (is_admin());

-- Orders policies
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_select" ON orders FOR SELECT USING (is_admin());
CREATE POLICY "orders_update" ON orders FOR UPDATE USING (is_admin());

-- Site settings table (key-value store for homepage video, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Site settings policies
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
  console.log(SQL);
  console.log();
  console.log("──────────────────────────────────────────────────────────────");
  console.log("After running the SQL, execute the seed script:");
  console.log("  npx tsx lib/data/seed.ts");
}

main().catch(console.error);
