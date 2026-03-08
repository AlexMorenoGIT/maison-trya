# Maison trya. — Site Web Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Créer un site vitrine luxe pour Maison trya. avec 3 pages (homepage, détail produit, à propos) respectant strictement la charte graphique.

**Architecture:** App Next.js 15 (App Router) avec TypeScript et Tailwind CSS. Site statique, pas de backend. Données produits en JSON local. Images placeholder via CSS gradients. Police Century Gothic locale.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 4, Framer Motion (animations subtiles)

---

### Task 1: Scaffolding du projet Next.js

**Files:**
- Create: tout le projet via `npx create-next-app`
- Modify: `tailwind.config.ts`, `app/layout.tsx`, `app/globals.css`

**Step 1: Créer le projet Next.js**

```bash
cd /Users/alexmoreno/Documents/DEV/maison-trya
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --turbopack
```

Répondre : No pour `src/` dir si demandé, Yes pour App Router, Yes pour Tailwind.

**Step 2: Dézipper et installer Century Gothic**

```bash
cd /Users/alexmoreno/Documents/DEV/maison-trya
unzip "/Users/alexmoreno/Downloads/Century Gothic.zip" -d fonts-tmp
mkdir -p public/fonts
cp fonts-tmp/*.ttf fonts-tmp/*.otf fonts-tmp/**/*.ttf fonts-tmp/**/*.otf public/fonts/ 2>/dev/null || true
ls public/fonts/
rm -rf fonts-tmp
```

Vérifier que les fichiers .ttf ou .otf sont bien dans `public/fonts/`.

**Step 3: Copier les logos SVG dans public**

```bash
mkdir -p public/logos
cp "/Users/alexmoreno/Documents/DEV/maison-trya/logos/Fichier 1.svg" public/logos/logo-bloc.svg
cp "/Users/alexmoreno/Documents/DEV/maison-trya/logos/horizontal/SVG/Fichier 1.svg" public/logos/logo-horizontal.svg
```

**Step 4: Créer les variantes de logo Cloud Cream**

Les SVG existants utilisent `fill: #3c2413` (Tortoise Shell). Créer des variantes avec `fill: #FFF7EB` (Cloud Cream) pour les fonds foncés :

```bash
cd /Users/alexmoreno/Documents/DEV/maison-trya
sed 's/#3c2413/#FFF7EB/g' public/logos/logo-bloc.svg > public/logos/logo-bloc-cream.svg
sed 's/#3c2413/#FFF7EB/g' public/logos/logo-horizontal.svg > public/logos/logo-horizontal-cream.svg
```

**Step 5: Configurer Tailwind avec les couleurs de la charte et Century Gothic**

Fichier `app/globals.css` :

```css
@import "tailwindcss";

@theme {
  --color-tortoise: #3C2413;
  --color-cream: #FFF8EE;
  --color-cloud: #FBF9F8;
  --color-dark: #2B2B28;
  --color-rubber: #754926;
  --color-gold: #D3AC58;
  --color-gold-dark: #636225;

  --font-sans: 'Century Gothic', 'CenturyGothic', sans-serif;
}

@font-face {
  font-family: 'Century Gothic';
  src: url('/fonts/CenturyGothic.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Century Gothic';
  src: url('/fonts/CenturyGothic-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* NOTE: Les noms de fichier exacts des polices seront ajustés
   après vérification du contenu du zip Century Gothic */
```

Ajuster les noms de fichier `src: url(...)` selon les fichiers réels trouvés dans `public/fonts/`.

**Step 6: Configurer le layout racine**

Fichier `app/layout.tsx` :

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maison trya.",
  description: "Entre férocité et vulnérabilité",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-cream text-tortoise antialiased">
        {children}
      </body>
    </html>
  );
}
```

**Step 7: Vérifier que le projet démarre**

```bash
cd /Users/alexmoreno/Documents/DEV/maison-trya
npm run dev
```

Expected: Le serveur démarre sur localhost:3000 sans erreurs.

**Step 8: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js project with Tailwind, Century Gothic fonts, and brand colors"
```

---

### Task 2: Données produits et types

**Files:**
- Create: `lib/data/products.ts`
- Create: `lib/types.ts`

**Step 1: Créer les types**

Fichier `lib/types.ts` :

```ts
export interface Product {
  id: string;
  name: string;
  price: number;
  category: "vetements" | "accessoires" | "bijoux" | "lingerie";
  description: string;
  colors: { name: string; hex: string }[];
  images: string[]; // placeholder gradient descriptions
  isFeatured: boolean;
}
```

**Step 2: Créer les données produits (20 produits, 6 featured)**

Fichier `lib/data/products.ts` :

```ts
import { Product } from "../types";

export const products: Product[] = [
  {
    id: "robe-sauvage",
    name: "ROBE SAUVAGE",
    price: 890,
    category: "vetements",
    description: "Une robe asymétrique en soie sauvage, entre douceur et affirmation. Coupe fluide, détails structurés au niveau des épaules. La pièce manifeste de la collection.",
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
    description: "Blazer oversize en laine vierge. Épaules structurées, tombé fluide. L'armure de celle qui ne s'excuse plus.",
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
    description: "Pantalon taille haute à jambe large en crêpe de soie. Mouvement et structure, pour celle qui avance sans se retourner.",
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
    description: "Top drapé en jersey de soie. Dos nu, devant structuré. La dualité incarnée.",
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
    description: "Manteau long en cachemire double-face. L'abri absolu. Enveloppant, protecteur, souverain.",
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
    description: "Jupe midi plissée en cuir souple. Le mouvement de la révolte, la grâce de l'affirmation.",
    colors: [
      { name: "Nuit", hex: "#2B2B28" },
      { name: "Rubber", hex: "#754926" },
    ],
    images: ["placeholder-1", "placeholder-2", "placeholder-3"],
    isFeatured: true,
  },
  // Non-featured products
  {
    id: "chemise-silence",
    name: "CHEMISE SILENCE",
    price: 480,
    category: "vetements",
    description: "Chemise oversize en popeline de coton. Col ouvert, manches volantes.",
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
    description: "Robe longue bi-matière : soie et cuir. La rencontre de la douceur et de la griffe.",
    colors: [
      { name: "Nuit", hex: "#2B2B28" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "veste-territoire",
    name: "VESTE TERRITOIRE",
    price: 980,
    category: "vetements",
    description: "Veste en daim brossé, coupe courte. Franges subtiles aux manches.",
    colors: [
      { name: "Sable", hex: "#C4A882" },
      { name: "Rubber", hex: "#754926" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "combinaison-metamorphose",
    name: "COMBINAISON MÉTAMORPHOSE",
    price: 1350,
    category: "vetements",
    description: "Combinaison ajustée en crêpe stretch. Dos ouvert, lignes pures.",
    colors: [
      { name: "Nuit", hex: "#2B2B28" },
      { name: "Tortoise", hex: "#3C2413" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "top-griffe",
    name: "TOP GRIFFE",
    price: 380,
    category: "vetements",
    description: "Top bustier en cuir nappa. Précis, radical, sans concession.",
    colors: [
      { name: "Nuit", hex: "#2B2B28" },
      { name: "Rubber", hex: "#754926" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "short-liberte",
    name: "SHORT LIBERTÉ",
    price: 420,
    category: "vetements",
    description: "Short taille haute en lin lavé. Décontracté et souverain.",
    colors: [
      { name: "Sable", hex: "#C4A882" },
      { name: "Crème", hex: "#FFF8EE" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "cape-eveil",
    name: "CAPE ÉVEIL",
    price: 1450,
    category: "vetements",
    description: "Cape en laine mérinos double face. L'envergure de celle qui s'éveille.",
    colors: [
      { name: "Camel", hex: "#C4A882" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "robe-abri",
    name: "ROBE ABRI",
    price: 760,
    category: "vetements",
    description: "Robe pull en maille de cachemire. Enveloppante, protectrice.",
    colors: [
      { name: "Crème", hex: "#FFF8EE" },
      { name: "Sable", hex: "#C4A882" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  // Accessoires
  {
    id: "sac-souveraine",
    name: "SAC SOUVERAINE",
    price: 1680,
    category: "accessoires",
    description: "Sac structuré en cuir grainé. Fermoir triangle inversé en or.",
    colors: [
      { name: "Tortoise", hex: "#3C2413" },
      { name: "Sable", hex: "#C4A882" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "ceinture-instinct",
    name: "CEINTURE INSTINCT",
    price: 340,
    category: "accessoires",
    description: "Ceinture large en cuir tressé. Boucle monogramme MT.",
    colors: [
      { name: "Tortoise", hex: "#3C2413" },
      { name: "Nuit", hex: "#2B2B28" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "foulard-dualite",
    name: "FOULARD DUALITÉ",
    price: 280,
    category: "accessoires",
    description: "Foulard en soie imprimée. Motif triangle inversé.",
    colors: [
      { name: "Gold", hex: "#D3AC58" },
      { name: "Crème", hex: "#FFF8EE" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  // Bijoux
  {
    id: "collier-bascule",
    name: "COLLIER BASCULE",
    price: 520,
    category: "bijoux",
    description: "Collier chaîne fine avec pendentif triangle inversé en or 18 carats.",
    colors: [
      { name: "Or", hex: "#D3AC58" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  {
    id: "bague-souverainete",
    name: "BAGUE SOUVERAINETÉ",
    price: 680,
    category: "bijoux",
    description: "Bague chevalière revisitée. Monogramme MT gravé.",
    colors: [
      { name: "Or", hex: "#D3AC58" },
    ],
    images: ["placeholder-1", "placeholder-2"],
    isFeatured: false,
  },
  // Lingerie
  {
    id: "body-abri",
    name: "BODY ABRI",
    price: 290,
    category: "lingerie",
    description: "Body en dentelle et soie. La douceur comme armure invisible.",
    colors: [
      { name: "Crème", hex: "#FFF8EE" },
      { name: "Nuit", hex: "#2B2B28" },
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
```

**Step 3: Commit**

```bash
git add lib/
git commit -m "feat: add product types and mock data (20 products, 6 featured)"
```

---

### Task 3: Composants partagés (Header, Footer, ProductCard)

**Files:**
- Create: `components/Header.tsx`
- Create: `components/Footer.tsx`
- Create: `components/ProductCard.tsx`
- Create: `components/ImagePlaceholder.tsx`

**Step 1: Créer le composant ImagePlaceholder**

Fichier `components/ImagePlaceholder.tsx` :

Génère des rectangles avec des dégradés chauds (tons sable, crème, tortoise) pour simuler des photos de mode. Accepte `aspect` (portrait, landscape, square), `seed` (pour varier les gradients), et `className`.

**Step 2: Créer le Header**

Fichier `components/Header.tsx` :

- Logo bloc SVG centré en haut (utiliser `logo-bloc.svg` sur fond clair, `logo-bloc-cream.svg` sur fond foncé)
- Navigation centrée en dessous : `COLLECTIONS` | `L'UNIVERS` | `À PROPOS`
- Texte en Century Gothic Bold, majuscules, tracking élargi
- Sur le hero : position fixed, fond transparent, logo/texte en Cloud Cream
- Au scroll : fond Cloud Cream, logo/texte en Tortoise Shell
- Transition fluide avec `backdrop-blur`

**Step 3: Créer le Footer**

Fichier `components/Footer.tsx` :

- Fond Tortoise Shell `#3C2413`
- Logo Cloud Cream centré (`logo-bloc-cream.svg`)
- Liens de navigation en Century Gothic Regular, majuscules, couleur Cloud Cream
- Section newsletter : input email + bouton "S'INSCRIRE"
- Copyright en bas : "© 2026 MAISON TRYA. TOUS DROITS RÉSERVÉS."
- Tout le texte en `#FFF7EB`

**Step 4: Créer le ProductCard**

Fichier `components/ProductCard.tsx` :

- Image placeholder en aspect portrait (3:4)
- Nom du produit en Century Gothic Bold, majuscules
- Prix formaté (ex: "890 €") en Century Gothic Regular
- Pastilles de couleur rondes (12px) pour les coloris
- Lien vers `/produit/[id]`
- Hover : légère animation scale sur l'image

**Step 5: Commit**

```bash
git add components/
git commit -m "feat: add shared components (Header, Footer, ProductCard, ImagePlaceholder)"
```

---

### Task 4: Homepage

**Files:**
- Modify: `app/page.tsx`

**Step 1: Section Hero Vidéo**

- Conteneur plein écran `100vh`
- Fond Tortoise Shell `#3C2413` (placeholder vidéo, avec animation grain/texture CSS subtile)
- Logo bloc Cloud Cream `#FFF7EB` centré
- Texte : "ENTRE FÉROCITÉ ET VULNÉRABILITÉ" — Century Gothic Bold, majuscules, tracking très élargi, couleur Cloud Cream
- CTA : "DÉCOUVRIR LA COLLECTION" — Century Gothic Regular, majuscules, bordure Cloud Cream, hover inversé
- Scroll indicator animé en bas

**Step 2: Section Manifeste**

- Fond Cloud Cream `#FFF8EE`
- Layout split : texte à gauche (60%), image placeholder à droite (40%)
- Titre : "L'INSTINCT" — Century Gothic Bold, grande taille
- Sous-texte manifeste (3-4 lignes poétiques tirées de la plateforme de marque) — Century Gothic Regular
- Image placeholder en portrait

**Step 3: Section Produits Featured (6 pièces)**

- Fond Cloud Cream
- Titre : "LA COLLECTION" — Century Gothic Bold, majuscules, centré
- Grille 2 colonnes asymétriques : alternance grande (span 7/12) et petite (span 5/12)
- Utiliser le composant ProductCard pour chaque produit
- Espacement généreux entre les produits

**Step 4: Section Éditorial**

- Image placeholder plein écran (100vw, ~70vh)
- Fond gradient foncé simulant une photo sombre
- Citation overlay en Cloud Cream : "NOUS NE VENDONS PAS DE LA PARURE, MAIS UNE MÉTAMORPHOSE."
- Century Gothic Bold, majuscules, grande taille
- Logo monogramme Cloud Cream en bas

**Step 5: Section "Valeurs" (pré-footer)**

- Fond Tortoise Shell
- 4 colonnes : L'INSTINCT, L'ÉVEIL, LA DUALITÉ, LA SOUVERAINETÉ
- Titre en Century Gothic Bold, texte court en Regular, tout en Cloud Cream

**Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "feat: implement homepage with hero, manifesto, products, and editorial sections"
```

---

### Task 5: Page Détail Produit

**Files:**
- Create: `app/produit/[id]/page.tsx`

**Step 1: Layout produit**

- Layout split : carrousel images à gauche (55%), infos à droite (45%)
- Carrousel : navigation par flèches et dots, images en aspect portrait
- Zone images : full height du viewport, scroll indépendant

**Step 2: Infos produit**

- Nom en Century Gothic Bold, majuscules, grande taille
- Prix en Century Gothic Regular : "890 €"
- Sélecteur coloris : pastilles rondes cliquables (24px) avec nom du coloris au hover
- Description en Century Gothic Regular, taille modérée
- Bouton "AJOUTER AU PANIER" — plein width, fond Tortoise Shell, texte Cloud Cream, Century Gothic Bold
- Bouton "GUIDE DES TAILLES" — lien discret en dessous

**Step 3: Section "VOUS AIMEREZ AUSSI"**

- Séparation nette (trait fin Tortoise Shell)
- Titre centré en Century Gothic Bold
- 4 produits liés en grille horizontale (ProductCard)

**Step 4: Commit**

```bash
git add app/produit/
git commit -m "feat: implement product detail page with carousel and related products"
```

---

### Task 6: Page À Propos

**Files:**
- Create: `app/a-propos/page.tsx`

**Step 1: Hero**

- Image placeholder plein écran (~80vh) fond sombre
- Titre overlay : "L'UNIVERS MAISON TRYA." — Century Gothic Bold, majuscules, Cloud Cream, grande taille

**Step 2: Section Vision**

- Fond Cloud Cream
- Titre : "NOTRE VISION" — Century Gothic Bold
- Texte manifeste tiré de la plateforme de marque (adapté pour le web, 2-3 paragraphes)
- Century Gothic Regular, taille confortable de lecture

**Step 3: Section Valeurs (4 blocs)**

- Grille 2x2 sur desktop, 1 colonne sur mobile
- Chaque bloc : image placeholder en fond, titre de la valeur en overlay
  - "L'INSTINCT" — "La vérité sauvage qui survit quand tout s'écroule."
  - "L'ÉVEIL" — "Le passage brutal de l'inertie à l'action."
  - "LA DUALITÉ" — "L'équilibre souverain entre la douceur et la griffe."
  - "LA SOUVERAINETÉ" — "Le droit absolu de régner sur son propre territoire."
- Century Gothic Bold pour les titres, Regular pour les descriptions, Cloud Cream sur fond sombre

**Step 4: Section Fondatrice (placeholder)**

- Layout split inversé : image à gauche, texte à droite
- Titre : "LA FONDATRICE" — Century Gothic Bold
- Texte placeholder : "Son histoire. Sa vision. Bientôt."
- Century Gothic Regular

**Step 5: Section Big Idea**

- Plein écran, fond Tortoise Shell
- Grande citation centrée en Cloud Cream : "ENTRE FÉROCITÉ ET VULNÉRABILITÉ"
- Logo monogramme Cloud Cream en dessous

**Step 6: Commit**

```bash
git add app/a-propos/
git commit -m "feat: implement about page with vision, values, and founder sections"
```

---

### Task 7: Responsive, animations et polish final

**Files:**
- Modify: tous les composants et pages existants

**Step 1: Installer Framer Motion**

```bash
npm install framer-motion
```

**Step 2: Animations**

- Fade-in au scroll sur les sections (intersection observer)
- Hover scale subtil sur les ProductCard images
- Transition douce du header transparent → opaque au scroll
- Smooth scroll entre sections

**Step 3: Responsive**

- Mobile : header hamburger, grille produits 1 colonne, hero texte réduit
- Tablette : grille produits 2 colonnes, ajustements padding
- Desktop : layout complet tel que designé

**Step 4: Vérification finale charte graphique**

Checklist :
- [ ] Logo Cloud Cream sur fond Tortoise Shell
- [ ] Logo Tortoise Shell sur fond Cloud Cream
- [ ] Logo Cloud Cream sur sections images
- [ ] Zones d'exclusion respectées
- [ ] Century Gothic Bold pour tous les titres (majuscules)
- [ ] Century Gothic Regular pour tous les corps de texte
- [ ] Couleurs exclusivement de la charte
- [ ] Pas d'effets, ombres, contours sur le logo

**Step 5: Commit final**

```bash
git add .
git commit -m "feat: add animations, responsive design, and final brand compliance polish"
```
