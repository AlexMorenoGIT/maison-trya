"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { COLLECTIONS, CATEGORIES } from "@/lib/constants";
import type { Product } from "@/lib/types";
import type { CategoryValue, CollectionValue } from "@/lib/constants";

interface AdminProductTableProps {
  products: Product[];
}

export default function AdminProductTable({ products }: AdminProductTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [collectionFilter, setCollectionFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (collectionFilter && p.collection !== collectionFilter) return false;
    if (categoryFilter && p.category !== categoryFilter) return false;
    return true;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Supprimer le produit "${name}" ? Cette action est irréversible.`)) return;
    setDeleting(id);
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Erreur lors de la suppression : " + error.message);
      setDeleting(null);
      return;
    }
    router.refresh();
    setDeleting(null);
  };

  const getCollectionLabel = (value: string) =>
    COLLECTIONS.find((c) => c.value === value)?.label ?? value;

  const getCategoryLabel = (value: string) =>
    CATEGORIES[value as CategoryValue]?.label ?? value;

  return (
    <div>
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 border border-tortoise/20 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
          />
        </div>
        <select
          value={collectionFilter}
          onChange={(e) => setCollectionFilter(e.target.value)}
          className="px-4 py-2.5 border border-tortoise/20 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          <option value="">Toutes les collections</option>
          {COLLECTIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 border border-tortoise/20 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          <option value="">Toutes les catégories</option>
          {Object.entries(CATEGORIES).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-tortoise text-cream text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-rubber transition-colors whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-tortoise/10 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-tortoise/40 text-sm">
            Aucun produit
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-tortoise/50 uppercase tracking-wider text-xs border-b border-tortoise/10">
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3 hidden md:table-cell">Collection</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Catégorie</th>
                  <th className="px-4 py-3">Prix</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Vedette</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, i) => (
                  <tr
                    key={product.id}
                    className={`border-b border-tortoise/5 hover:bg-cloud/50 transition-colors ${
                      i % 2 === 1 ? "bg-cloud/30" : ""
                    }`}
                  >
                    <td className="px-4 py-2">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="w-[50px] h-[50px] object-cover rounded"
                        />
                      ) : (
                        <div className="w-[50px] h-[50px] bg-tortoise/5 rounded flex items-center justify-center text-tortoise/20">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 font-medium">{product.name}</td>
                    <td className="px-4 py-2 hidden md:table-cell text-tortoise/60">
                      {getCollectionLabel(product.collection)}
                    </td>
                    <td className="px-4 py-2 hidden lg:table-cell text-tortoise/60">
                      {getCategoryLabel(product.category)}
                      {product.subcategory && (
                        <span className="text-tortoise/40"> / {product.subcategory}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 font-medium">
                      {product.price.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </td>
                    <td className="px-4 py-2 hidden sm:table-cell text-center">
                      {product.is_featured && (
                        <span className="text-gold text-lg">&#9733;</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/produits/${product.id}`}
                          className="p-1.5 rounded hover:bg-cloud transition-colors text-tortoise/50 hover:text-tortoise"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="p-1.5 rounded hover:bg-red-50 transition-colors text-tortoise/50 hover:text-red-600 disabled:opacity-50"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-tortoise/40">
        {filtered.length} produit{filtered.length !== 1 ? "s" : ""} affiché{filtered.length !== 1 ? "s" : ""}
        {filtered.length !== products.length && ` sur ${products.length}`}
      </p>
    </div>
  );
}
