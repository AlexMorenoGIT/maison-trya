import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import AdminProductTable from "@/components/AdminProductTable";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-widest text-tortoise mb-8">
        PRODUITS
      </h1>
      <AdminProductTable products={(products ?? []) as Product[]} />
    </div>
  );
}
