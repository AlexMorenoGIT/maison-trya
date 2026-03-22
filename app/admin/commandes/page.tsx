import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";
import OrderTable from "./OrderTable";

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-widest text-tortoise mb-8">
        COMMANDES
      </h1>
      <OrderTable orders={(orders ?? []) as Order[]} />
    </div>
  );
}
