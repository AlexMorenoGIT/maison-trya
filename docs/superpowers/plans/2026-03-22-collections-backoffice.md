# Maison Trya v2 — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the static Maison Trya site into a dynamic Supabase-backed e-commerce with 3 collections, product catalog, admin back-office, auth, and fake checkout.

**Architecture:** Next.js 16 App Router with Supabase (auth, database, storage). Server Components for data fetching, Client Components for interactivity. Cart state in localStorage via React Context. Admin routes protected by middleware checking admin emails.

**Tech Stack:** Next.js 16, React 19, Supabase JS + SSR, Tailwind 4, Framer Motion

---

## File Structure

### New files to create

```
lib/supabase/client.ts          — Browser Supabase client
lib/supabase/server.ts          — Server Supabase client
lib/supabase/middleware.ts       — Supabase auth middleware helpers
lib/supabase/admin.ts            — Admin email check utility
lib/cart-context.tsx             — Cart React Context provider
lib/cart-utils.ts                — Cart localStorage helpers
lib/constants.ts                 — Category taxonomy, collection enums, admin emails
lib/data/seed.ts                 — Migration script: hardcoded products → Supabase

app/catalogue/page.tsx           — Catalogue page with filters
app/connexion/page.tsx           — Login/signup page
app/panier/page.tsx              — Cart page
app/commande/[id]/page.tsx       — Order confirmation page
app/admin/layout.tsx             — Admin layout with sidebar nav
app/admin/page.tsx               — Admin dashboard
app/admin/produits/page.tsx      — Admin product list
app/admin/produits/nouveau/page.tsx — Admin add product form
app/admin/produits/[id]/page.tsx — Admin edit product form
app/admin/commandes/page.tsx     — Admin order list

components/MegaMenu.tsx          — Mega-menu dropdown for header
components/SearchModal.tsx       — Search modal overlay
components/CartIcon.tsx          — Cart icon with badge
components/ProductFilters.tsx    — Collection + category filter bar
components/ProductForm.tsx       — Shared product add/edit form
components/AdminProductTable.tsx — Product table for admin

middleware.ts                    — Next.js middleware for admin route protection
.env.local                       — Supabase env vars
```

### Files to modify

```
lib/types.ts                     — Update Product type (add slug, collection, subcategory, sizes)
app/layout.tsx                   — Wrap with CartProvider
app/page.tsx                     — Fetch featured products from Supabase
app/produit/[slug]/page.tsx       — Fetch product by slug from Supabase, add to cart
app/globals.css                  — Add any new utility styles
components/Header.tsx            — Horizontal layout, mega-menu, account/cart icons
components/ProductCard.tsx       — Support Supabase image URLs
package.json                     — Add @supabase/supabase-js, @supabase/ssr
```

### Files to delete

```
lib/data/products.ts             — Replaced by Supabase (after migration)
```

---

## Chunk 1: Supabase Foundation

### Task 1: Install dependencies and configure environment

**Files:**
- Modify: `package.json`
- Create: `.env.local`

- [ ] **Step 1: Install Supabase packages**

Run: `npm install @supabase/supabase-js @supabase/ssr`

- [ ] **Step 2: Create .env.local**

```env
NEXT_PUBLIC_SUPABASE_URL=<get from Supabase dashboard>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get from Supabase dashboard → API → anon/public>
SUPABASE_SERVICE_ROLE_KEY=<get from Supabase dashboard → API → service_role (secret)>
```

Note: Real credentials are provided by the user. Never commit them to git.

- [ ] **Step 3: Add .env.local to .gitignore (if not already)**

Check `.gitignore` for `.env*.local`. Add if missing.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: install Supabase dependencies"
```

### Task 2: Create Supabase client utilities

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/middleware.ts`
- Create: `lib/supabase/admin.ts`

- [ ] **Step 1: Create browser client** (`lib/supabase/client.ts`)

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 2: Create server client** (`lib/supabase/server.ts`)

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — ignore
          }
        },
      },
    }
  );
}
```

- [ ] **Step 3: Create middleware helper** (`lib/supabase/middleware.ts`)

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
```

- [ ] **Step 4: Create admin check** (`lib/supabase/admin.ts`)

```typescript
const ADMIN_EMAILS = [
  "amunico07@gmail.com",
  "alex.moreno32390@gmail.com",
];

export function isAdminEmail(email: string | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email);
}
```

- [ ] **Step 5: Commit**

```bash
git add lib/supabase/
git commit -m "feat: add Supabase client utilities (browser, server, middleware, admin)"
```

### Task 3: Create Next.js middleware for admin protection

**Files:**
- Create: `middleware.ts` (project root)

- [ ] **Step 1: Create middleware**

```typescript
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isAdminEmail } from "@/lib/supabase/admin";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user || !isAdminEmail(user.email)) {
      const url = request.nextUrl.clone();
      url.pathname = "/connexion";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logos|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add middleware for auth session refresh and admin route protection"
```

### Task 4: Create Supabase database schema

**Files:** None (SQL executed in Supabase dashboard or via service role)

- [ ] **Step 1: Create the products table and RLS policies**

Execute this SQL in Supabase SQL Editor (or create a script at `lib/data/setup-db.ts` that runs via service role):

```sql
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

-- Admin helper function
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

-- Updated_at trigger
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
```

- [ ] **Step 2: Create storage bucket**

In Supabase Dashboard → Storage → Create bucket `product-images`, set to public. Add policy: SELECT for all, INSERT/UPDATE/DELETE for `is_admin()`.

- [ ] **Step 3: Create a setup script** (`lib/data/setup-db.ts`) to run the above SQL programmatically using the service role key. This is for convenience — can also be run manually.

- [ ] **Step 4: Commit**

```bash
git add lib/data/setup-db.ts
git commit -m "feat: add database setup script with products, orders, RLS"
```

### Task 5: Update types and constants

**Files:**
- Modify: `lib/types.ts`
- Create: `lib/constants.ts`

- [ ] **Step 1: Update Product type** (`lib/types.ts`)

```typescript
export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  collection: "vulnerabilite" | "eveil" | "ferocite";
  category: "pret-a-porter" | "lingerie" | "accessoires";
  subcategory: string;
  description: string;
  colors: { name: string; hex: string }[];
  images: string[];
  sizes: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  items: CartItem[];
  total: number;
  status: string;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
}
```

- [ ] **Step 2: Create constants** (`lib/constants.ts`)

```typescript
export const COLLECTIONS = [
  { value: "vulnerabilite", label: "Vulnérabilité" },
  { value: "eveil", label: "Éveil" },
  { value: "ferocite", label: "Férocité" },
] as const;

export const CATEGORIES = {
  "pret-a-porter": {
    label: "Prêt à porter",
    subcategories: [
      { value: "robes", label: "Robes" },
      { value: "vestes", label: "Vestes" },
      { value: "tops", label: "Top" },
      { value: "jupes-shorts", label: "Jupes & Shorts" },
      { value: "pantalons", label: "Pantalons" },
    ],
  },
  lingerie: {
    label: "Lingerie",
    subcategories: [
      { value: "hauts", label: "Hauts" },
      { value: "bas", label: "Bas" },
      { value: "jartieres", label: "Jartières" },
    ],
  },
  accessoires: {
    label: "Accessoires",
    subcategories: [
      { value: "sacs", label: "Sacs" },
      { value: "ceintures", label: "Ceinture" },
      { value: "bijoux", label: "Bijoux" },
      { value: "autres", label: "Autres" },
    ],
  },
} as const;

export type CollectionValue = (typeof COLLECTIONS)[number]["value"];
export type CategoryValue = keyof typeof CATEGORIES;
```

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts lib/constants.ts
git commit -m "feat: update Product type and add category/collection constants"
```

### Task 6: Seed migration script

**Files:**
- Create: `lib/data/seed.ts`

- [ ] **Step 1: Create seed script** that maps the 20 existing products to the new schema and inserts them into Supabase using the service role key.

**Product mapping (collection assignment — round-robin):**
- vulnerabilite: robe-sauvage, pantalon-souveraine, manteau-refuge, chemise-silence, veste-territoire, top-griffe, cape-eveil
- eveil: blazer-instinct, top-eveil, jupe-cri, robe-dualite, combinaison-metamorphose, short-liberte, robe-abri
- ferocite: sac-souveraine, ceinture-instinct, foulard-dualite, collier-bascule, bague-souverainete, body-abri

**Category/subcategory mapping:**
- Robes (robe-sauvage, robe-dualite, robe-abri) → pret-a-porter / robes
- Vestes (blazer-instinct, veste-territoire) → pret-a-porter / vestes
- Tops (top-eveil, top-griffe, chemise-silence) → pret-a-porter / tops
- Pantalons (pantalon-souveraine, combinaison-metamorphose) → pret-a-porter / pantalons
- Jupes & Shorts (jupe-cri, short-liberte) → pret-a-porter / jupes-shorts
- Manteaux (manteau-refuge, cape-eveil) → pret-a-porter / vestes
- Sacs (sac-souveraine) → accessoires / sacs
- Ceintures (ceinture-instinct) → accessoires / ceintures
- Foulards (foulard-dualite) → accessoires / autres
- Bijoux (collier-bascule, bague-souverainete) → accessoires / bijoux
- Lingerie (body-abri) → lingerie / hauts

**Default sizes:** pret-a-porter → ["XS","S","M","L","XL"], lingerie → ["XS","S","M","L"], accessoires → ["Unique"]

Use `npx tsx` (downloads automatically via npx). Script uses `createClient` from `@supabase/supabase-js` with service role key.

- [ ] **Step 2: Run the seed script**

Run: `npx tsx lib/data/seed.ts`

- [ ] **Step 3: Verify in Supabase dashboard** that all 20 products are inserted correctly.

- [ ] **Step 4: Commit**

```bash
git add lib/data/seed.ts
git commit -m "feat: add seed migration script for existing products"
```

---

## Chunk 2: Header Mega-Menu & Cart Context

### Task 7: Create cart context and utilities

**Files:**
- Create: `lib/cart-utils.ts`
- Create: `lib/cart-context.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create cart utilities** (`lib/cart-utils.ts`)

```typescript
import type { CartItem } from "./types";

const CART_KEY = "maison-trya-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(
  items: CartItem[],
  newItem: CartItem
): CartItem[] {
  const existing = items.find(
    (i) =>
      i.product_id === newItem.product_id &&
      i.color === newItem.color &&
      i.size === newItem.size
  );
  if (existing) {
    return items.map((i) =>
      i === existing ? { ...i, quantity: i.quantity + newItem.quantity } : i
    );
  }
  return [...items, newItem];
}

export function removeFromCart(
  items: CartItem[],
  productId: string,
  color: string,
  size: string
): CartItem[] {
  return items.filter(
    (i) =>
      !(i.product_id === productId && i.color === color && i.size === size)
  );
}

export function updateQuantity(
  items: CartItem[],
  productId: string,
  color: string,
  size: string,
  quantity: number
): CartItem[] {
  if (quantity <= 0) return removeFromCart(items, productId, color, size);
  return items.map((i) =>
    i.product_id === productId && i.color === color && i.size === size
      ? { ...i, quantity }
      : i
  );
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
```

- [ ] **Step 2: Create cart context** (`lib/cart-context.tsx`)

```typescript
"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { CartItem } from "./types";
import * as cartUtils from "./cart-utils";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateItemQuantity: (productId: string, color: string, size: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(cartUtils.getCart());
  }, []);

  useEffect(() => {
    if (items.length > 0 || cartUtils.getCart().length > 0) {
      cartUtils.saveCart(items);
    }
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => cartUtils.addToCart(prev, item));
  }, []);

  const removeItem = useCallback((productId: string, color: string, size: string) => {
    setItems((prev) => cartUtils.removeFromCart(prev, productId, color, size));
  }, []);

  const updateItemQuantity = useCallback(
    (productId: string, color: string, size: string, qty: number) => {
      setItems((prev) => cartUtils.updateQuantity(prev, productId, color, size, qty));
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
    cartUtils.saveCart([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        total: cartUtils.cartTotal(items),
        count: cartUtils.cartCount(items),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
```

- [ ] **Step 3: Wrap layout with CartProvider** (`app/layout.tsx`)

Add `CartProvider` import and wrap `{children}` inside the body.

- [ ] **Step 4: Commit**

```bash
git add lib/cart-utils.ts lib/cart-context.tsx app/layout.tsx
git commit -m "feat: add cart context with localStorage persistence"
```

### Task 8: Redesign Header with mega-menu

**Files:**
- Modify: `components/Header.tsx` — Complete rewrite: horizontal logo left, nav center, icons right, mega-menu on hover
- Create: `components/MegaMenu.tsx` — Mega-menu dropdown component
- Create: `components/SearchModal.tsx` — Search modal overlay
- Create: `components/CartIcon.tsx` — Cart icon with badge from context

- [ ] **Step 1: Create CartIcon component** (`components/CartIcon.tsx`)

A small component that renders the bag SVG icon with a quantity badge from `useCart()`. Takes `className` prop for color styling.

- [ ] **Step 2: Create MegaMenu component** (`components/MegaMenu.tsx`)

Three-column layout using `CATEGORIES` from `lib/constants.ts`. Each column header is the category label, items are subcategory links to `/catalogue?category=X&subcategory=Y`. Absolute positioned below the nav, with a subtle fade-in animation (Framer Motion). Also includes a collections dropdown that shows the 3 collection names linking to `/catalogue?collection=X`.

- [ ] **Step 3: Create SearchModal** (`components/SearchModal.tsx`)

Full-screen overlay with a centered search input. On typing (debounced 300ms), queries Supabase `products` table with `ilike` on name. Shows results as a list of product cards (name + price + image thumbnail). Click navigates to product page and closes modal. Escape closes.

- [ ] **Step 4: Rewrite Header** (`components/Header.tsx`)

New layout:
- Single row: horizontal logo left (`/logos/logo-horizontal.svg` or cream variant), nav links center (Catalogue, Collections, L'Univers, A Propos), icons right (search, account, CartIcon)
- Catalogue link: on hover shows MegaMenu. On click navigates to `/catalogue`.
- Collections link: on hover shows dropdown with 3 collection names. On click navigates to `/catalogue`.
- L'Univers → `/a-propos`
- A Propos → `/a-propos`
- Account icon → `/connexion` (or `/admin` if logged in — check via Supabase client)
- Search icon → opens SearchModal
- Mobile: hamburger opens full-screen menu with expandable accordion for categories
- Keep existing scroll-based styling (transparent → cream background)

- [ ] **Step 5: Verify** — check header renders correctly in browser at `http://localhost:3000`, test mega-menu hover, search modal, cart badge

- [ ] **Step 6: Commit**

```bash
git add components/Header.tsx components/MegaMenu.tsx components/SearchModal.tsx components/CartIcon.tsx
git commit -m "feat: redesign header with horizontal logo, mega-menu, search modal, cart badge"
```

---

## Chunk 3: Catalogue & Product Pages

### Task 9: Create catalogue page

**Files:**
- Create: `app/catalogue/page.tsx`
- Create: `components/ProductFilters.tsx`

- [ ] **Step 1: Create ProductFilters component** (`components/ProductFilters.tsx`)

Client component. Renders filter bar with:
- Collection pills (Vulnérabilité, Éveil, Férocité) — click to toggle
- Category dropdown or pills (Prêt à porter, Lingerie, Accessoires)
- When a category is selected, show subcategory pills below
- Sort dropdown: "Nouveautés" (created_at desc), "Prix croissant", "Prix décroissant"
- Uses URL search params (`useSearchParams`, `useRouter`) to sync filters with URL

- [ ] **Step 2: Create catalogue page** (`app/catalogue/page.tsx`)

Server component. Reads search params (collection, category, subcategory, sort). Fetches products from Supabase with appropriate filters. Uses Supabase query builder:
- `.eq('collection', ...)` if collection param present
- `.eq('category', ...)` if category param present
- `.eq('subcategory', ...)` if subcategory param present
- `.order(...)` based on sort param
- `.range(0, 11)` for first 12 products

Renders:
- Header (forceDark)
- Page title "CATALOGUE"
- ProductFilters (client component, wrapped in Suspense)
- Product grid (4 cols desktop, 2 cols mobile) using ProductCard
- "Charger plus" button — client component that tracks current offset, fetches next 12 products via Supabase browser client (`createClient().from('products').select('*').range(offset, offset+11)` with same filters), appends to displayed list. Button hidden when no more results.
- Footer

- [ ] **Step 3: Verify** — navigate to `/catalogue`, test filters, check URL params update

- [ ] **Step 4: Commit**

```bash
git add app/catalogue/page.tsx components/ProductFilters.tsx
git commit -m "feat: add catalogue page with collection and category filters"
```

### Task 10: Update ProductCard for Supabase data

**Files:**
- Modify: `components/ProductCard.tsx`

- [ ] **Step 1: Update ProductCard**

- Change link to use `product.slug` instead of `product.id`
- If `product.images[0]` starts with `http`, render an `<img>` tag. Otherwise fall back to `ImagePlaceholder`.
- Keep existing styling and hover effect.

- [ ] **Step 2: Commit**

```bash
git add components/ProductCard.tsx
git commit -m "feat: update ProductCard to support Supabase images and slugs"
```

### Task 11: Update product detail page

**Files:**
- Rename: `app/produit/[id]/page.tsx` → `app/produit/[slug]/page.tsx`

- [ ] **Step 1: Rename route directory and convert to Server Component**

Rename `app/produit/[id]/` to `app/produit/[slug]/`. Fetch product from Supabase: `supabase.from('products').select('*').eq('slug', params.slug).single()`. Fetch related products: same category, limit 4.

Wrap interactive parts (image carousel, color selector, size selector, add-to-cart) in a client component `ProductDetailClient`.

- [ ] **Step 2: Add size selector and add-to-cart with context**

In the client component:
- Add size selector (buttons for each size in `product.sizes`)
- Wire "AJOUTER AU PANIER" button to `useCart().addItem()`
- Show success feedback (brief toast or button text change)

- [ ] **Step 3: Support real images**

If image URL starts with `http`, render `<img>` instead of `ImagePlaceholder`.

- [ ] **Step 4: Update breadcrumb** to link to `/catalogue`

- [ ] **Step 5: Verify** — navigate to a product page, check data loads, add to cart works

- [ ] **Step 6: Commit**

```bash
git add app/produit/
git commit -m "feat: update product detail page for Supabase data, sizes, and cart"
```

### Task 12: Update homepage to fetch from Supabase

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Convert to Server Component**

Remove `"use client"`. Fetch featured products from Supabase: `supabase.from('products').select('*').eq('is_featured', true).limit(6)`.

Move interactive sections (hero animations) into a client component `HomeClient` or use individual client wrappers.

- [ ] **Step 2: Update CTA link** from `#collection` to `/catalogue`

- [ ] **Step 3: Verify** — homepage loads with Supabase data

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: homepage fetches featured products from Supabase"
```

---

## Chunk 4: Authentication

### Task 13: Create login/signup page

**Files:**
- Create: `app/connexion/page.tsx`

- [ ] **Step 1: Build the connexion page**

Client component. Two tabs: "Connexion" and "Inscription".

**Connexion tab:**
- Email input, password input
- "Se connecter" gold button
- Error message display

**Inscription tab:**
- Email input, password input, confirm password input
- "Créer un compte" gold button
- Error message display

Uses `createClient()` from `lib/supabase/client.ts`:
- Login: `supabase.auth.signInWithPassword({ email, password })`
- Signup: `supabase.auth.signUp({ email, password })`

Post-login: check if admin email → redirect to `/admin`, else redirect to `/`.

**Design:**
- Cream background, centered card
- Logo at top (bloc version)
- Century Gothic, tortoise text, gold accents
- Subtle FadeIn animations
- Mobile responsive

- [ ] **Step 2: Verify** — navigate to `/connexion`, test login/signup flow

- [ ] **Step 3: Commit**

```bash
git add app/connexion/
git commit -m "feat: add luxury login/signup page with Supabase auth"
```

---

## Chunk 5: Cart & Checkout

### Task 14: Create cart page

**Files:**
- Create: `app/panier/page.tsx`

- [ ] **Step 1: Build cart page**

Client component using `useCart()`.

- Header (forceDark)
- Title "VOTRE PANIER"
- If empty: message + CTA to catalogue
- If items: list with image thumbnail, name, color, size, quantity (+/- buttons), unit price, line total, remove button
- Summary bar: subtotal, "PASSER COMMANDE" button
- Footer

**Checkout form** (shown when clicking "PASSER COMMANDE"):
- Name, email, address fields
- "CONFIRMER LA COMMANDE" button
- On submit: insert order into Supabase `orders` table, clear cart, redirect to `/commande/[id]`

- [ ] **Step 2: Verify** — add items to cart, view cart, modify quantities, checkout

- [ ] **Step 3: Commit**

```bash
git add app/panier/
git commit -m "feat: add cart page with checkout form"
```

### Task 15: Create order confirmation page

**Files:**
- Create: `app/commande/[id]/page.tsx`

- [ ] **Step 1: Build confirmation page**

**Approach:** Store order data in localStorage before redirect (avoids RLS issues — orders SELECT is admin-only). On the confirmation page, read from localStorage and display. Clear the stored data after rendering.

```typescript
// In cart page, after successful order insert:
localStorage.setItem("last-order", JSON.stringify({ id: order.id, items, total, customer_name }));
router.push(`/commande/${order.id}`);

// In confirmation page:
const orderData = JSON.parse(localStorage.getItem("last-order") || "null");
// Display orderData, then: localStorage.removeItem("last-order");
```

Display:
- Header (forceDark)
- Success icon/message
- Order number
- Items summary
- Total
- "CONTINUER LES ACHATS" CTA → `/catalogue`
- Footer

- [ ] **Step 2: Commit**

```bash
git add app/commande/
git commit -m "feat: add order confirmation page"
```

---

## Chunk 6: Back-Office

### Task 16: Create admin layout and dashboard

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Create admin layout** (`app/admin/layout.tsx`)

Different layout from main site. Sidebar navigation with:
- Logo (small)
- Links: Dashboard, Produits, Commandes
- Logout button
- Main content area

Clean, professional design. White/light gray background with tortoise accents.

- [ ] **Step 2: Create admin dashboard** (`app/admin/page.tsx`)

Server component. Fetch counts from Supabase:
- `supabase.from('products').select('id', { count: 'exact', head: true })`
- `supabase.from('orders').select('id', { count: 'exact', head: true })`
- Recent 5 orders

Display stat cards + recent orders table.

- [ ] **Step 3: Verify** — login as admin, access `/admin`, see dashboard

- [ ] **Step 4: Commit**

```bash
git add app/admin/layout.tsx app/admin/page.tsx
git commit -m "feat: add admin layout with sidebar and dashboard"
```

### Task 17: Create admin product list

**Files:**
- Create: `app/admin/produits/page.tsx`
- Create: `components/AdminProductTable.tsx`

- [ ] **Step 1: Create AdminProductTable** (`components/AdminProductTable.tsx`)

Client component. Renders a table with columns: thumbnail, name, collection, category, price, featured badge, actions (edit link, delete button).

Delete action: confirm dialog → `supabase.from('products').delete().eq('id', id)` → refresh.

Search input filters by name (client-side for simplicity, or Supabase ilike).

- [ ] **Step 2: Create product list page** (`app/admin/produits/page.tsx`)

Server component. Fetch all products ordered by `created_at` desc. Pass to `AdminProductTable`. "Ajouter un produit" button links to `/admin/produits/nouveau`.

- [ ] **Step 3: Verify** — see product list, search, delete works

- [ ] **Step 4: Commit**

```bash
git add app/admin/produits/page.tsx components/AdminProductTable.tsx
git commit -m "feat: add admin product list with search and delete"
```

### Task 18: Create product form (add/edit)

**Files:**
- Create: `components/ProductForm.tsx`
- Create: `app/admin/produits/nouveau/page.tsx`
- Create: `app/admin/produits/[id]/page.tsx`

- [ ] **Step 1: Create ProductForm** (`components/ProductForm.tsx`)

Client component. Props: `product?: Product` (for edit mode), `onSave: (data) => void`.

Fields:
- `name` — text input
- `description` — textarea
- `price` — number input
- `collection` — select (from COLLECTIONS constant)
- `category` — select (from CATEGORIES keys)
- `subcategory` — select (cascading, updates when category changes)
- `colors` — dynamic list. Each row: name input + hex color picker. Add/remove buttons.
- `sizes` — dynamic list or comma-separated input
- `images` — list of image entries. Each can be a URL (text input) or a file upload. File upload constraints: accepted formats JPEG/PNG/WebP only (`accept="image/jpeg,image/png,image/webp"`), max 5 MB (validate before upload, show error if exceeded). Upload to Supabase Storage `product-images` bucket → get public URL. Up/down buttons to reorder. Remove button per image. Shows preview thumbnail.
- `is_featured` — toggle/checkbox

Validation: name required, price > 0, at least 1 image. File size < 5 MB per image.

Auto-generates slug from name (lowercase, spaces→dashes, remove accents with `normalize('NFD').replace(/[\u0300-\u036f]/g, '')`).

- [ ] **Step 2: Create "nouveau" page** (`app/admin/produits/nouveau/page.tsx`)

Renders ProductForm. On save: `supabase.from('products').insert(data)` → redirect to `/admin/produits`.

- [ ] **Step 3: Create edit page** (`app/admin/produits/[id]/page.tsx`)

Server component fetches product by ID. Client wrapper renders ProductForm with existing data. On save: `supabase.from('products').update(data).eq('id', id)` → redirect to `/admin/produits`.

- [ ] **Step 4: Verify** — create a new product, edit an existing product, upload images

- [ ] **Step 5: Commit**

```bash
git add components/ProductForm.tsx app/admin/produits/
git commit -m "feat: add product form with image upload, color picker, cascading categories"
```

### Task 19: Create admin order list

**Files:**
- Create: `app/admin/commandes/page.tsx`

- [ ] **Step 1: Build order list page**

Server component. Fetch all orders ordered by `created_at` desc. Display table with: order ID (truncated), customer name, email, total, status, date. Click to expand and see order items.

- [ ] **Step 2: Commit**

```bash
git add app/admin/commandes/
git commit -m "feat: add admin order list page"
```

---

## Chunk 7: Cleanup & Polish

### Task 20: Delete old mock data, final wiring

**Files:**
- Delete: `lib/data/products.ts`
- Verify all imports are updated

- [ ] **Step 1: Remove `lib/data/products.ts`**

Search all files for imports from `@/lib/data/products` and ensure they've been replaced with Supabase fetches.

- [ ] **Step 2: Verify entire flow end-to-end**

- Homepage loads featured products from Supabase
- Header mega-menu works (hover categories, hover collections)
- Catalogue page filters work (collection, category, subcategory, sort)
- Product detail loads from Supabase, add to cart works
- Cart page shows items, checkout creates order
- Order confirmation displays
- Login/signup works
- Admin dashboard shows stats
- Admin product list, add, edit, delete all work
- Search modal finds products

- [ ] **Step 3: Commit**

```bash
git rm lib/data/products.ts
git add -A
git commit -m "chore: remove hardcoded mock data, complete Supabase migration"
```

### Task 21: Visual polish pass

**Files:** Various — apply @frontend-design skill

- [ ] **Step 1: Review all new pages for design consistency**

Use the `frontend-design` skill. Ensure:
- All pages use existing design tokens (tortoise, cream, gold, etc.)
- Animations are consistent (FadeIn component)
- Mobile responsive on all new pages
- Typography consistent (Century Gothic, uppercase tracking)
- Admin BO has professional, clean appearance

- [ ] **Step 2: Fix any visual issues found**

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "style: visual polish across all new pages"
```
