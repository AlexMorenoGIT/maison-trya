import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

function loadEnv(): Record<string, string> {
  const envPath = path.resolve(__dirname, "../../.env.local");
  const content = fs.readFileSync(envPath, "utf-8");
  const env: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const CSV_PATH = process.argv[2] ?? "/Users/alexmoreno/Downloads/Plan de Co Final.xlsx - Feuille 1.csv";

// ── CSV parser handling quoted fields with commas and newlines ───────────────
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else field += c;
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// ── Mappings ─────────────────────────────────────────────────────────────────
type Collection = "vulnerabilite" | "eveil" | "ferocite";
type Category = "pret-a-porter" | "lingerie" | "accessoires";

const COLLECTION_MAP: Record<string, Collection> = {
  "Vulnérabilité": "vulnerabilite",
  "Éveil": "eveil",
  "Eveil": "eveil",
  "Férocité": "ferocite",
  "Ferocite": "ferocite",
};

const CATEGORY_MAP: Record<string, Category> = {
  "Prêt-à-porter": "pret-a-porter",
  "Lingerie": "lingerie",
  "Accessoires": "accessoires",
};

function mapSubcategory(category: Category, groupe: string, sousGroupe: string): string {
  const g = groupe.trim();
  const sg = sousGroupe.trim().toLowerCase();

  if (category === "pret-a-porter") {
    if (/jupe|short|combi/.test(sg)) return "jupes-shorts";
    if (/pantalon/.test(sg)) return "pantalons";
    if (/robe/.test(sg)) return "robes";
    if (/veste|cape|kimono/.test(sg)) return "vestes";
    return "tops";
  }
  if (category === "lingerie") {
    if (g === "Bas") return "bas";
    return "hauts";
  }
  // accessoires
  if (g === "Sac") return "sacs";
  if (/ceinture/.test(sg)) return "ceintures";
  if (g === "Bijoux") return "bijoux";
  return "autres";
}

function getSizes(category: Category): string[] {
  switch (category) {
    case "pret-a-porter": return ["XS", "S", "M", "L", "XL"];
    case "lingerie": return ["XS", "S", "M", "L"];
    case "accessoires": return ["Unique"];
  }
}

const COLOR_HEX: Record<string, string> = {
  "ivoire": "#F5F0E1",
  "charbon": "#2D2D2D",
  "terracotta": "#B65439",
  "férocité": "#7A3B1F",
  "ferocite": "#7A3B1F",
  "fauve": "#C9A07A",
  "taupe": "#8B7D6B",
  "zèbre": "#1A1A1A",
  "zebre": "#1A1A1A",
  "python": "#8C7853",
  "instinct": "#C0A875",
};

function parseColors(raw: string): { name: string; hex: string }[] {
  if (!raw.trim()) return [];
  return raw.split(",").map((c) => {
    const name = c.trim();
    const key = name.toLowerCase();
    return { name, hex: COLOR_HEX[key] ?? "#888888" };
  });
}

function parsePrice(raw: string): number {
  const cleaned = raw.replace(/[€\s ]/g, "").replace(/,/g, ".");
  return parseFloat(cleaned);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const text = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parseCSV(text);
  const header = rows[0];
  const col = (name: string) => header.indexOf(name);

  const idxRef = col("REF");
  const idxSousSegment = col("SOUS-SEGMENT");
  const idxGroupes = col("GROUPES");
  const idxSousGroupes = col("SOUS-GROUPES");
  const idxCollection = col("COLLECTION");
  const idxColours = col("COULEUR SKU");
  const idxMatieres = col("MATIÈRES");
  const idxDescription = col("DESCRIPTIF");
  const idxCodif = col("CODIFICATION");
  const idxPrix = col("PRIX");

  type ProductRow = {
    slug: string;
    name: string;
    description: string;
    price: number;
    collection: Collection;
    category: Category;
    subcategory: string;
    colors: { name: string; hex: string }[];
    images: string[];
    sizes: string[];
    is_featured: boolean;
  };

  const products: ProductRow[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const ref = (r[idxRef] ?? "").trim();
    if (!ref) continue;

    const collectionRaw = r[idxCollection].trim();
    const categoryRaw = r[idxSousSegment].trim();
    const collection = COLLECTION_MAP[collectionRaw];
    const category = CATEGORY_MAP[categoryRaw];

    if (!collection) { console.warn(`Skip ${ref}: unknown collection "${collectionRaw}"`); continue; }
    if (!category) { console.warn(`Skip ${ref}: unknown category "${categoryRaw}"`); continue; }

    const subcategory = mapSubcategory(category, r[idxGroupes], r[idxSousGroupes]);
    const sousGroupe = r[idxSousGroupes].trim();
    const matiere = r[idxMatieres].trim();
    const descriptif = r[idxDescription].trim();
    const codif = r[idxCodif].trim().toLowerCase();
    const isFeatured = /best.?seller|signature/.test(codif);

    const description = matiere
      ? `${descriptif}\n\nMatière : ${matiere}.`
      : descriptif;

    products.push({
      slug: ref.toLowerCase(),
      name: sousGroupe,
      description,
      price: parsePrice(r[idxPrix]),
      collection,
      category,
      subcategory,
      colors: parseColors(r[idxColours]),
      images: [],
      sizes: getSizes(category),
      is_featured: isFeatured,
    });
  }

  console.log(`Parsed ${products.length} products from CSV.`);

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("Deleting all existing products...");
  const { error: delErr } = await supabase.from("products").delete().gt("price", 0);
  if (delErr) { console.error("Delete error:", delErr.message); process.exit(1); }

  console.log(`Inserting ${products.length} new products...`);
  const { data, error: insErr } = await supabase.from("products").insert(products).select("slug, name, collection, category, subcategory");
  if (insErr) { console.error("Insert error:", insErr.message); process.exit(1); }

  console.log(`✓ Inserted ${data.length} products.`);
  for (const p of data) {
    console.log(`  - ${p.slug}  ${p.name}  (${p.collection} / ${p.category} / ${p.subcategory})`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
