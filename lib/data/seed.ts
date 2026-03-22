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

// ── Product mapping ──────────────────────────────────────────────────────────

type Collection = "vulnerabilite" | "eveil" | "ferocite";
type Category = "pret-a-porter" | "lingerie" | "accessoires";

interface ProductMapping {
  collection: Collection;
  category: Category;
  subcategory: string;
}

const PRODUCT_MAP: Record<string, ProductMapping> = {
  "robe-sauvage": { collection: "vulnerabilite", category: "pret-a-porter", subcategory: "robes" },
  "blazer-instinct": { collection: "eveil", category: "pret-a-porter", subcategory: "vestes" },
  "pantalon-souveraine": { collection: "vulnerabilite", category: "pret-a-porter", subcategory: "pantalons" },
  "top-eveil": { collection: "eveil", category: "pret-a-porter", subcategory: "tops" },
  "manteau-refuge": { collection: "vulnerabilite", category: "pret-a-porter", subcategory: "vestes" },
  "jupe-cri": { collection: "eveil", category: "pret-a-porter", subcategory: "jupes-shorts" },
  "chemise-silence": { collection: "vulnerabilite", category: "pret-a-porter", subcategory: "tops" },
  "robe-dualite": { collection: "eveil", category: "pret-a-porter", subcategory: "robes" },
  "veste-territoire": { collection: "vulnerabilite", category: "pret-a-porter", subcategory: "vestes" },
  "combinaison-metamorphose": { collection: "eveil", category: "pret-a-porter", subcategory: "pantalons" },
  "top-griffe": { collection: "vulnerabilite", category: "pret-a-porter", subcategory: "tops" },
  "short-liberte": { collection: "eveil", category: "pret-a-porter", subcategory: "jupes-shorts" },
  "cape-eveil": { collection: "vulnerabilite", category: "pret-a-porter", subcategory: "vestes" },
  "robe-abri": { collection: "eveil", category: "pret-a-porter", subcategory: "robes" },
  "sac-souveraine": { collection: "ferocite", category: "accessoires", subcategory: "sacs" },
  "ceinture-instinct": { collection: "ferocite", category: "accessoires", subcategory: "ceintures" },
  "foulard-dualite": { collection: "ferocite", category: "accessoires", subcategory: "autres" },
  "collier-bascule": { collection: "ferocite", category: "accessoires", subcategory: "bijoux" },
  "bague-souverainete": { collection: "ferocite", category: "accessoires", subcategory: "bijoux" },
  "body-abri": { collection: "ferocite", category: "lingerie", subcategory: "hauts" },
};

function getSizes(category: Category): string[] {
  switch (category) {
    case "pret-a-porter":
      return ["XS", "S", "M", "L", "XL"];
    case "lingerie":
      return ["XS", "S", "M", "L"];
    case "accessoires":
      return ["Unique"];
  }
}

// ── Import existing products (inline to avoid module issues with tsx) ─────
// We read and parse the products file manually to avoid ESM/CJS issues
function loadProducts() {
  const productsPath = path.resolve(__dirname, "./products.ts");
  const content = fs.readFileSync(productsPath, "utf-8");

  // Extract product objects using regex — parse the essential fields
  const products: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    colors: { name: string; hex: string }[];
    images: string[];
    isFeatured: boolean;
  }> = [];

  // Match each product block
  const productBlocks = content.split(/\n  \{/);
  for (const block of productBlocks) {
    const idMatch = block.match(/id:\s*"([^"]+)"/);
    const nameMatch = block.match(/name:\s*"([^"]+)"/);
    const priceMatch = block.match(/price:\s*(\d+)/);
    const descMatch = block.match(/description:\s*\n?\s*"([^"]+(?:"[^"]*)*?)"/s);
    const featuredMatch = block.match(/isFeatured:\s*(true|false)/);

    if (!idMatch || !nameMatch || !priceMatch) continue;

    // Extract colors
    const colors: { name: string; hex: string }[] = [];
    const colorMatches = block.matchAll(/\{\s*name:\s*"([^"]+)",\s*hex:\s*"([^"]+)"\s*\}/g);
    for (const cm of colorMatches) {
      colors.push({ name: cm[1], hex: cm[2] });
    }

    // Extract images
    const images: string[] = [];
    const imageSection = block.match(/images:\s*\[([^\]]+)\]/);
    if (imageSection) {
      const imageMatches = imageSection[1].matchAll(/"([^"]+)"/g);
      for (const im of imageMatches) {
        images.push(im[1]);
      }
    }

    // Clean up description — handle multi-line strings
    let description = "";
    if (descMatch) {
      description = descMatch[1].replace(/\s+/g, " ").trim();
    }

    products.push({
      id: idMatch[1],
      name: nameMatch[1],
      price: parseInt(priceMatch[1]),
      description,
      colors,
      images,
      isFeatured: featuredMatch ? featuredMatch[1] === "true" : false,
    });
  }

  return products;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Loading existing products...");
  const oldProducts = loadProducts();
  console.log(`Found ${oldProducts.length} products.`);

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const newProducts = oldProducts.map((p) => {
    const mapping = PRODUCT_MAP[p.id];
    if (!mapping) {
      console.warn(`No mapping found for product: ${p.id}, skipping.`);
      return null;
    }

    return {
      slug: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      collection: mapping.collection,
      category: mapping.category,
      subcategory: mapping.subcategory,
      colors: p.colors,
      images: p.images,
      sizes: getSizes(mapping.category),
      is_featured: p.isFeatured,
    };
  }).filter(Boolean);

  console.log(`Upserting ${newProducts.length} products into Supabase...`);

  const { data, error } = await supabase
    .from("products")
    .upsert(newProducts, { onConflict: "slug" })
    .select();

  if (error) {
    console.error("Error upserting products:", error.message);
    process.exit(1);
  }

  console.log(`Successfully upserted ${data.length} products.`);
  for (const p of data) {
    console.log(`  - ${p.slug}: ${p.name} (${p.collection} / ${p.category} / ${p.subcategory})`);
  }
}

main().catch(console.error);
