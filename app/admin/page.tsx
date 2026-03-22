import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [productsResult, ordersCountResult, recentOrdersResult] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const productCount = productsResult.count ?? 0;
  const orderCount = ordersCountResult.count ?? 0;
  const recentOrders = (recentOrdersResult.data ?? []) as Order[];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-widest text-tortoise mb-8">
        TABLEAU DE BORD
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl border border-tortoise/10 p-6 shadow-sm">
          <p className="text-sm text-tortoise/50 uppercase tracking-wider mb-1">
            Nombre de produits
          </p>
          <p className="text-4xl font-bold text-tortoise">{productCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-tortoise/10 p-6 shadow-sm">
          <p className="text-sm text-tortoise/50 uppercase tracking-wider mb-1">
            Nombre de commandes
          </p>
          <p className="text-4xl font-bold text-tortoise">{orderCount}</p>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-tortoise/10 shadow-sm">
        <div className="px-6 py-4 border-b border-tortoise/10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-tortoise">
            Commandes récentes
          </h2>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-6 py-10 text-center text-tortoise/40 text-sm">
            Aucune commande pour le moment
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-tortoise/50 uppercase tracking-wider text-xs border-b border-tortoise/10">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-tortoise/5 hover:bg-cloud/50 transition-colors"
                  >
                    <td className="px-6 py-3 font-mono text-xs text-tortoise/60">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-3">{order.customer_name}</td>
                    <td className="px-6 py-3 font-medium">
                      {order.total.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </td>
                    <td className="px-6 py-3 text-tortoise/60">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
