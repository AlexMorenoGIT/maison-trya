import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import FadeIn from "@/components/FadeIn";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

interface CataloguePageProps {
  searchParams: Promise<{
    collection?: string;
    category?: string;
    subcategory?: string;
    sort?: string;
  }>;
}

function interleaveByCollection(products: Product[]): Product[] {
  const order: Product["collection"][] = ["vulnerabilite", "eveil", "ferocite"];
  const groups: Record<string, Product[]> = {
    vulnerabilite: [],
    eveil: [],
    ferocite: [],
  };
  for (const p of products) {
    if (groups[p.collection]) groups[p.collection].push(p);
  }
  const result: Product[] = [];
  let i = 0;
  let added = true;
  while (added) {
    added = false;
    for (const c of order) {
      const item = groups[c][i];
      if (item) {
        result.push(item);
        added = true;
      }
    }
    i++;
  }
  return result;
}

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
  const params = await searchParams;
  const { collection, category, subcategory, sort } = params;

  const supabase = await createClient();

  let query = supabase.from("products").select("*");

  if (collection) query = query.eq("collection", collection);
  if (category) query = query.eq("category", category);
  if (subcategory) query = query.eq("subcategory", subcategory);

  const isDefaultSort = !sort;
  if (sort === "prix-asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "prix-desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data } = await query;
  let products: Product[] = (data || []) as Product[];

  // Interleave by collection only when there's no explicit collection filter and default sort
  if (!collection && isDefaultSort) {
    products = interleaveByCollection(products);
  }

  return (
    <>
      <Header forceDark />

      <main className="bg-cream text-tortoise min-h-screen pt-28 pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h1 className="text-center text-3xl md:text-4xl font-bold uppercase tracking-[0.3em] mb-16">
              CATALOGUE
            </h1>
          </FadeIn>

          {/* Filters */}
          <FadeIn delay={0.1}>
            <Suspense fallback={null}>
              <ProductFilters />
            </Suspense>
          </FadeIn>

          {/* Product grid */}
          {products.length > 0 ? (
            <div className="mt-16">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <FadeIn key={product.id} delay={Math.min(index * 0.04, 0.6)}>
                    <ProductCard product={product} />
                  </FadeIn>
                ))}
              </div>
            </div>
          ) : (
            <FadeIn delay={0.2}>
              <div className="text-center py-24">
                <p className="text-lg uppercase tracking-[0.15em] text-tortoise/50">
                  Aucun produit trouvé
                </p>
                <a
                  href="/catalogue"
                  className="inline-block mt-6 text-sm uppercase tracking-[0.12em] text-tortoise underline underline-offset-4 hover:text-tortoise/70 transition-colors"
                >
                  Réinitialiser les filtres
                </a>
              </div>
            </FadeIn>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
