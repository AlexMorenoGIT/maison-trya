import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import FadeIn from "@/components/FadeIn";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import LoadMoreProducts from "./LoadMoreProducts";

interface CataloguePageProps {
  searchParams: Promise<{
    collection?: string;
    category?: string;
    subcategory?: string;
    sort?: string;
  }>;
}

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
  const params = await searchParams;
  const { collection, category, subcategory, sort } = params;

  const supabase = await createClient();

  let query = supabase.from("products").select("*");

  if (collection) {
    query = query.eq("collection", collection);
  }
  if (category) {
    query = query.eq("category", category);
  }
  if (subcategory) {
    query = query.eq("subcategory", subcategory);
  }

  if (sort === "prix-asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "prix-desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(0, 11);

  const { data: products } = await query;
  const initialProducts: Product[] = products || [];
  const hasMore = initialProducts.length === 12;

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
          {initialProducts.length > 0 ? (
            <div className="mt-16">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {initialProducts.map((product, index) => (
                  <FadeIn key={product.id} delay={index * 0.05}>
                    <ProductCard product={product} />
                  </FadeIn>
                ))}
              </div>

              {hasMore && (
                <LoadMoreProducts
                  collection={collection}
                  category={category}
                  subcategory={subcategory}
                  sort={sort}
                  initialOffset={12}
                />
              )}
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
