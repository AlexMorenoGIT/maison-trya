// Local interface for seed data — intentionally different from the Supabase Product type.
// This file is read as raw text by seed.ts (via fs.readFileSync + regex parsing).
interface SeedProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  colors: { name: string; hex: string }[];
  images: string[];
  isFeatured: boolean;
}

export const products: SeedProduct[] = [
  // ── Featured (6 vetements) ──────────────────────────────────────────
  {
    id: "robe-sauvage",
    name: "ROBE SAUVAGE",
    price: 890,
    category: "vetements",
    description:
      "Robe asymétrique en soie sauvage, taillée pour celles qui dansent entre l'ombre et la lumière. Un drapé instinctif qui épouse le mouvement de celle qui le porte.",
    colors: [
      { name: "Sable", hex: "#C4A882" },
      { name: "Nuit", hex: "#2B2B28" },
      { name: "Terre", hex: "#754926" },
    ],
    images: ["placeholder-1", "placeholder-2", "placeholder-3"],
    isFeatured: true,
  },
  {
    id: "blazer-instinct",
    name: "BLAZER INSTINCT",
    price: 1250,
    category: "vetements",
    description:
      "Blazer oversize en laine vierge, armure douce pour les âmes indomptées. Sa coupe magistrale impose sans jamais contraindre.",
    colors: [
      { name: "Tortoise", hex: "#3C2413" },
      { name: "Crème", hex: "#FFF8EE" },
    ],
    images: ["placeholder-1", "placeholder-2", "placeholder-3"],
    isFeatured: true,
  },
  {
    id: "pantalon-souveraine",
    name: "PANTALON SOUVERAINE",
    price: 680,
    category: "vetements",
    description:
      "Pantalon taille haute jambe large en crêpe de soie, chaque pas devient une déclaration. La fluidité du tissu murmure la puissance de celle qui avance.",
    colors: [
      { name: "Ivoire", hex: "#FBF9F8" },
      { name: "Nuit", hex: "#2B2B28" },
    ],
    images: ["placeholder-1", "placeholder-2", "placeholder-3"],
    isFeatured: true,
  },
  {
    id: "top-eveil",
    name: "TOP ÉVEIL",
    price: 420,
    category: "vetements",
    description:
      "Top drapé en jersey de soie, dos nu, une invitation à révéler ce que l'on cache. Entre pudeur et audace, la peau respire.",
    colors: [
      { name: "Sable", hex: "#C4A882" },
      { name: "Crème", hex: "#FFF8EE" },
      { name: "Nuit", hex: "#2B2B28" },
    ],
    images: ["placeholder-1", "placeholder-2", "placeholder-3"],
    isFeatured: true,
  },
  {
    id: "manteau-refuge",
    name: "MANTEAU REFUGE",
    price: 1890,
    category: "vetements",
    description:
      "Manteau long en cachemire double-face, un sanctuaire porté sur les épaules. Il enveloppe comme une promesse, protège comme un serment.",
    colors: [
      { name: "Camel", hex: "#C4A882" },
      { name: "Tortoise", hex: "#3C2413" },
    ],
    images: ["placeholder-1", "placeholder-2", "placeholder-3"],
    isFeatured: true,
  },
  {
    id: "jupe-cri",
    name: "JUPE CRI",
    price: 590,
    category: "vetements",
    description:
      "Jupe midi plissée en cuir souple, le rugissement silencieux d'une féminité sans concession. Chaque pli est une vague de révolte élégante.",
    colors: [
      { name: "Nuit", hex: "#2B2B28" },
      { name: "Rubber", hex: "#754926" },
    ],
    images: ["placeholder-1", "placeholder-2", "placeholder-3"],
    isFeatured: true,
  },

  // ── Non-featured vetements (8) ──────────────────────────────────────
  {
    id: "chemise-silence",
    name: "CHEMISE SILENCE",
    price: 480,
    category: "vetements",
    description:
      "Une chemise qui parle tout bas, en coton lavé et col ouvert. Le luxe de ne rien avoir à prouver.",
    colors: [
      { name: "Crème", hex: "#FFF8EE" },
      { name: "Sable", hex: "#C4A882" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "robe-dualite",
    name: "ROBE DUALITÉ",
    price: 1120,
    category: "vetements",
    description:
      "Robe longue bimatière, mi-soie mi-cuir, née de la tension entre douceur et résistance. Deux natures, une seule femme.",
    colors: [
      { name: "Nuit", hex: "#2B2B28" },
      { name: "Ivoire", hex: "#FBF9F8" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "veste-territoire",
    name: "VESTE TERRITOIRE",
    price: 980,
    category: "vetements",
    description:
      "Veste structurée aux épaules affirmées, en tweed artisanal. Délimiter son espace, revendiquer son territoire.",
    colors: [
      { name: "Tortoise", hex: "#3C2413" },
      { name: "Sable", hex: "#C4A882" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "combinaison-metamorphose",
    name: "COMBINAISON MÉTAMORPHOSE",
    price: 1350,
    category: "vetements",
    description:
      "Combinaison fluide à ceinture nouée, en crêpe de laine. Se glisser dedans, c'est devenir une autre version de soi-même.",
    colors: [
      { name: "Nuit", hex: "#2B2B28" },
      { name: "Camel", hex: "#C4A882" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "top-griffe",
    name: "TOP GRIFFE",
    price: 380,
    category: "vetements",
    description:
      "Top ajusté à manches longues, en maille fine griffée de détails bruts. La douceur qui porte la marque de ses combats.",
    colors: [
      { name: "Nuit", hex: "#2B2B28" },
      { name: "Crème", hex: "#FFF8EE" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "short-liberte",
    name: "SHORT LIBERTÉ",
    price: 420,
    category: "vetements",
    description:
      "Short taille haute en lin lavé, la désinvolture comme acte de résistance. Marcher pieds nus dans le luxe.",
    colors: [
      { name: "Sable", hex: "#C4A882" },
      { name: "Ivoire", hex: "#FBF9F8" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "cape-eveil",
    name: "CAPE ÉVEIL",
    price: 1450,
    category: "vetements",
    description:
      "Cape en laine mérinos doublée de soie, un geste ample qui déploie les ailes. Se couvrir pour mieux se révéler.",
    colors: [
      { name: "Camel", hex: "#C4A882" },
      { name: "Nuit", hex: "#2B2B28" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "robe-abri",
    name: "ROBE ABRI",
    price: 760,
    category: "vetements",
    description:
      "Robe pull en cachemire côtelé, la tendresse comme forteresse. Un cocon tricoté pour les jours où la vulnérabilité est une force.",
    colors: [
      { name: "Crème", hex: "#FFF8EE" },
      { name: "Sable", hex: "#C4A882" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },

  // ── Accessoires (3) ─────────────────────────────────────────────────
  {
    id: "sac-souveraine",
    name: "SAC SOUVERAINE",
    price: 1680,
    category: "accessoires",
    description:
      "Sac en cuir grainé à fermoir sculptural, l'assurance portée au creux du bras. Chaque détail est un acte de souveraineté.",
    colors: [
      { name: "Tortoise", hex: "#3C2413" },
      { name: "Nuit", hex: "#2B2B28" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "ceinture-instinct",
    name: "CEINTURE INSTINCT",
    price: 340,
    category: "accessoires",
    description:
      "Ceinture large en cuir tressé, serrer la taille comme on reprend les rênes. L'instinct noué à même la peau.",
    colors: [
      { name: "Tortoise", hex: "#3C2413" },
      { name: "Sable", hex: "#C4A882" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "foulard-dualite",
    name: "FOULARD DUALITÉ",
    price: 280,
    category: "accessoires",
    description:
      "Foulard en twill de soie imprimé, un territoire de motifs entre ordre et chaos. Se nouer au cou ou aux cheveux, libre.",
    colors: [
      { name: "Sable", hex: "#C4A882" },
      { name: "Nuit", hex: "#2B2B28" },
      { name: "Crème", hex: "#FFF8EE" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },

  // ── Bijoux (2) ──────────────────────────────────────────────────────
  {
    id: "collier-bascule",
    name: "COLLIER BASCULE",
    price: 520,
    category: "bijoux",
    description:
      "Collier en argent massif oxydé, un pendentif asymétrique qui oscille entre deux mondes. Le point de bascule, porté au cœur.",
    colors: [
      { name: "Argent", hex: "#C0C0C0" },
      { name: "Nuit", hex: "#2B2B28" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "bague-souverainete",
    name: "BAGUE SOUVERAINETÉ",
    price: 680,
    category: "bijoux",
    description:
      "Bague sculptée en or jaune mat, un sceau que l'on se donne à soi-même. Régner sur sa propre histoire.",
    colors: [
      { name: "Or", hex: "#D4A843" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },

  // ── Lingerie (1) ────────────────────────────────────────────────────
  {
    id: "body-abri",
    name: "BODY ABRI",
    price: 290,
    category: "lingerie",
    description:
      "Body en dentelle et tulle de soie, la dernière frontière entre soi et le monde. Une seconde peau qui honore la première.",
    colors: [
      { name: "Nuit", hex: "#2B2B28" },
      { name: "Crème", hex: "#FFF8EE" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
];

export const featuredProducts = products.filter((p) => p.isFeatured);

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(id: string, limit = 4) {
  const product = getProductById(id);
  if (!product) return [];
  return products
    .filter((p) => p.id !== id && p.category === product.category)
    .slice(0, limit);
}
