# Maison Trya v2 — Collections, Catalogue, Back-Office & Faux E-Commerce

## Context

Maison Trya is a school project for a women's fashion brand. The current site is a static Next.js 16 app with hardcoded product data, no backend, and no authentication. This spec transforms it into a dynamic, Supabase-backed site with 3 collections, product catalog filtering, admin back-office, and a simulated checkout flow.

## Collections

Three collections that coexist on the homepage without separation:

- **Vulnérabilité**
- **Éveil**
- **Férocité**

Each product belongs to exactly one collection. Collections are filterable only on the catalog page.

## Category Taxonomy

Three top-level categories, each with subcategories:

| Category | Subcategories |
|----------|---------------|
| Prêt à porter | Robes, Vestes, Top, Jupes & Shorts, Pantalons |
| Lingerie | Hauts, Bas, Jartières |
| Accessoires | Sacs, Ceinture, Bijoux, Autres |

Each product belongs to exactly one category + subcategory pair.

## Pages & Routing

| Route | Purpose | Auth |
|-------|---------|------|
| `/` | Homepage — unified mix of all 3 collections | Public |
| `/catalogue` | Product grid with collection + category filters | Public |
| `/produit/[id]` | Product detail (adapted from existing) | Public |
| `/a-propos` | About page (unchanged) | Public |
| `/connexion` | Login / signup page | Public |
| `/panier` | Cart + fake checkout | Public |
| `/commande/[id]` | Order confirmation page | Public |
| `/admin` | Dashboard (product count, order count) | Admin only |
| `/admin/produits` | Product list with search/filter/edit/delete | Admin only |
| `/admin/produits/nouveau` | Add product form | Admin only |
| `/admin/produits/[id]` | Edit product form | Admin only |
| `/admin/commandes` | Order list (read-only) | Admin only |

## Header — Mega-Menu

- Horizontal logo (left)
- Navigation links: Catalogue, Collections, L'Univers, À Propos
- **Catalogue hover** → mega-menu with 3 columns: Prêt à porter (subcategories), Lingerie (subcategories), Accessoires (subcategories). Each subcategory links to `/catalogue?category=X&subcategory=Y`.
- **Collections hover** → dropdown with Vulnérabilité, Éveil, Férocité. Each links to `/catalogue?collection=X`.
- **Catalogue click** → navigates to `/catalogue`. Hover shows mega-menu as preview.
- **Search icon** → opens a modal overlay with text input, live-searches product names, shows results as dropdown list. No dedicated search page.
- Right side: search icon, account icon, cart icon (with quantity badge)
- "L'Univers" links to `/a-propos` (no separate page)
- Mobile: hamburger menu with expandable categories

## Homepage

Stays unified — products from all 3 collections mix naturally. Sections:

1. **Hero** — full-screen, brand tagline, CTA to catalogue
2. **Manifesto** — brand story text + image
3. **Featured products** — curated grid, fetched from Supabase (is_featured = true), no collection labels
4. **Editorial quote** — full-width image + quote
5. **Values** — 4 brand values grid

Data comes from Supabase instead of hardcoded mock data.

## Catalogue Page

- **Filter bar** (top or sidebar): Collection filter (multi-select or single), Category/subcategory filter (hierarchical), Sort by price/newest
- **Product grid**: 4 columns desktop, 2 columns mobile
- **URL-driven filters**: query params for collection, category, subcategory, sort
- Empty state when no products match filters
- **Pagination**: 12 products per page, load more button (no infinite scroll)

## Product Detail Page

Adapt existing page to fetch from Supabase by slug (SEO-friendly URLs). Keep: image carousel, color selector, description, price, related products. Add: size selector, add-to-cart button, collection badge (subtle).

## Supabase Schema

### Table: `products`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | Default gen_random_uuid() |
| `slug` | text (unique) | Auto-generated from name, used in URLs |
| `name` | text | Required |
| `description` | text | |
| `price` | numeric(10,2) | Required |
| `collection` | text | One of: vulnerabilite, eveil, ferocite |
| `category` | text | One of: pret-a-porter, lingerie, accessoires |
| `subcategory` | text | e.g. robes, vestes, tops, etc. |
| `colors` | jsonb | Array of {name: string, hex: string} |
| `images` | jsonb | Array of URL strings |
| `sizes` | jsonb | Array of size strings |
| `is_featured` | boolean | Default false |
| `created_at` | timestamptz | Default now() |
| `updated_at` | timestamptz | Default now() |

### Table: `orders`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | Default gen_random_uuid() |
| `customer_name` | text | |
| `customer_email` | text | |
| `customer_address` | text | |
| `items` | jsonb | Array of {product_id, name, price, quantity, color, size} |
| `total` | numeric(10,2) | |
| `status` | text | Default 'confirmed' |
| `created_at` | timestamptz | Default now() |

### Storage

Bucket `product-images` for file uploads from the back-office. Public read access, authenticated write.

### Row Level Security

RLS uses a helper function to check admin status:

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT email FROM auth.users WHERE id = auth.uid())
    IN ('amunico07@gmail.com', 'alex.moreno32390@gmail.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Policies:
- `products`: SELECT for everyone (`true`), INSERT/UPDATE/DELETE where `is_admin() = true`
- `orders`: INSERT for everyone (`true`), SELECT/UPDATE where `is_admin() = true`
- Storage `product-images`: SELECT for everyone, INSERT/UPDATE/DELETE where `is_admin() = true`

Note: Hardcoded admin emails. Acceptable for school project scope. Could be replaced by an `admin_emails` table later.

## Authentication

- Supabase Auth (email + password)
- Login/signup page at `/connexion`
- Admin check: query Supabase auth.users email against allowed admin list
- Non-admin users can browse freely, place fake orders
- Admin users get access to `/admin/*` routes
- Middleware protects `/admin/*` — redirects to `/connexion` if not authenticated or not admin

## Back-Office

### Dashboard (`/admin`)

- Product count, order count, recent orders

### Product List (`/admin/produits`)

- Table with columns: image thumbnail, name, collection, category, price, actions
- Search by name
- Filter by collection/category
- Edit and delete actions

### Product Form (`/admin/produits/nouveau` and `/admin/produits/[id]`)

- Fields: name (text), description (textarea), price (number), collection (select: Vulnérabilité/Éveil/Férocité), category (select: Prêt à porter/Lingerie/Accessoires), subcategory (cascading select based on category), colors (dynamic list — add/remove, each with name input + hex color picker), sizes (multi-select or dynamic list), images (upload file to Supabase Storage OR paste URL, drag to reorder), is_featured (toggle)
- Validation: name and price required, at least 1 image
- Save creates/updates in Supabase

## Cart & Fake Checkout

- Cart state in localStorage (React context provider)
- Cart page: product list with image, name, color, size, quantity (editable), price, remove button, total
- Checkout: form with name, email, address → creates order in Supabase → confirmation page with order summary
- No real payment processing

## Login/Signup Page

- Cohesive luxury design: cream background, Century Gothic, tortoise/gold tones
- Two tabs: Connexion / Inscription
- Fields: email, password (+ confirm password for signup)
- Gold CTA button
- Error states for invalid credentials
- Post-login redirect: admin users → `/admin`, others → `/`

## Design Constraints

- All styling uses existing design tokens (tortoise, cream, cloud, rubber, gold)
- Century Gothic font throughout
- Framer Motion animations consistent with existing patterns
- Mobile-first responsive design
- French language for all UI text

## Tech Stack Additions

- `@supabase/supabase-js` — Supabase client
- `@supabase/ssr` — Server-side Supabase for Next.js
- No other new dependencies needed (Tailwind, Framer Motion already present)

## Migration Strategy

- Existing 20 hardcoded products get migrated to Supabase with assigned collections
- Product IDs change from slugs to UUIDs — add a `slug` column for SEO-friendly URLs, route by slug
- Existing components (Header, Footer, ProductCard, FadeIn, ImagePlaceholder) get adapted, not replaced

### Category mapping from old to new

Old `"vetements"` → new `"pret-a-porter"` with subcategories mapped by product type.
Old `"bijoux"` → new `"accessoires"` with subcategory `"bijoux"`.
Old `"accessoires"` → new `"accessoires"` with appropriate subcategory.
Old `"lingerie"` → new `"lingerie"` with subcategory `"hauts"` or `"bas"` as appropriate.

### Collection assignment for existing products

Existing products are distributed roughly evenly across the 3 collections during seed migration. The assignment is arbitrary (placeholder data) — real assignment will be done by admins via the back-office after launch.

### Sizes

Existing products have no size data. Migration assigns default size arrays based on category:
- Prêt à porter: ["XS", "S", "M", "L", "XL"]
- Lingerie: ["XS", "S", "M", "L"]
- Accessoires: ["Unique"]

### Image upload constraints

- Accepted formats: JPEG, PNG, WebP
- Max file size: 5 MB
- Recommended dimensions: 1200x1600px (3:4 portrait ratio)
- Images are resized client-side before upload if exceeding 2000px on longest side
