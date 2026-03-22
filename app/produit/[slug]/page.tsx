import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import ProductDetailClient from "./ProductDetailClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch related products: same category, exclude current, limit 4
  let { data: related } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4);

  let relatedProducts: Product[] = related || [];

  // If not enough, fill with other products
  if (relatedProducts.length < 4) {
    const existingIds = [product.id, ...relatedProducts.map((p: Product) => p.id)];
    const { data: more } = await supabase
      .from("products")
      .select("*")
      .not("id", "in", `(${existingIds.join(",")})`)
      .limit(4 - relatedProducts.length);

    if (more) {
      relatedProducts = [...relatedProducts, ...(more as Product[])];
    }
  }

  return (
    <>
      <Header forceDark />
      <ProductDetailClient
        product={product as Product}
        relatedProducts={relatedProducts}
      />
      <Footer />
    </>
  );
}
