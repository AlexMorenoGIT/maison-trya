"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import type { Product } from "@/lib/types";

interface LoadMoreProductsProps {
  collection?: string;
  category?: string;
  subcategory?: string;
  sort?: string;
  initialOffset: number;
}

export default function LoadMoreProducts({
  collection,
  category,
  subcategory,
  sort,
  initialOffset,
}: LoadMoreProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    setLoading(true);
    const supabase = createClient();

    let query = supabase.from("products").select("*");

    if (collection) query = query.eq("collection", collection);
    if (category) query = query.eq("category", category);
    if (subcategory) query = query.eq("subcategory", subcategory);

    if (sort === "prix-asc") {
      query = query.order("price", { ascending: true });
    } else if (sort === "prix-desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    query = query.range(offset, offset + 11);

    const { data } = await query;
    const newProducts = (data || []) as Product[];

    if (newProducts.length < 12) {
      setHasMore(false);
    }

    setProducts((prev) => [...prev, ...newProducts]);
    setOffset((prev) => prev + newProducts.length);
    setLoading(false);
  }

  return (
    <>
      {products.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {products.map((product, index) => (
            <FadeIn key={product.id} delay={index * 0.05}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="text-center mt-16">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-10 py-4 border border-tortoise text-tortoise font-bold uppercase tracking-[0.2em] text-sm hover:bg-tortoise hover:text-cream transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "CHARGEMENT..." : "CHARGER PLUS"}
          </button>
        </div>
      )}
    </>
  );
}
