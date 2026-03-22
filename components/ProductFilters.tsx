"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { COLLECTIONS, CATEGORIES, type CategoryValue } from "@/lib/constants";

export default function ProductFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCollection = searchParams.get("collection") || "";
  const activeCategory = (searchParams.get("category") || "") as CategoryValue | "";
  const activeSubcategory = searchParams.get("subcategory") || "";
  const activeSort = searchParams.get("sort") || "nouveautes";

  const hasFilters = activeCollection || activeCategory || activeSubcategory || activeSort !== "nouveautes";

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    router.push(`/catalogue?${params.toString()}`, { scroll: false });
  }

  function toggleParam(key: string, value: string) {
    const current = searchParams.get(key);
    if (current === value) {
      updateParams({ [key]: null, ...(key === "category" ? { subcategory: null } : {}) });
    } else {
      updateParams({ [key]: value, ...(key === "category" ? { subcategory: null } : {}) });
    }
  }

  function resetFilters() {
    router.push("/catalogue", { scroll: false });
  }

  const categoryKeys = Object.keys(CATEGORIES) as CategoryValue[];
  const subcategories = activeCategory && activeCategory in CATEGORIES
    ? CATEGORIES[activeCategory as CategoryValue].subcategories
    : [];

  return (
    <div className="space-y-6">
      {/* Collections */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-tortoise/50 mb-3">
          COLLECTIONS
        </p>
        <div className="flex flex-wrap gap-2">
          {COLLECTIONS.map((col) => (
            <button
              key={col.value}
              onClick={() => toggleParam("collection", col.value)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] border transition-all duration-300 ${
                activeCollection === col.value
                  ? "bg-gold text-white border-gold"
                  : "border-tortoise/20 text-tortoise/70 hover:border-tortoise/40 hover:text-tortoise"
              }`}
            >
              {col.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-tortoise/50 mb-3">
          CATÉGORIES
        </p>
        <div className="flex flex-wrap gap-2">
          {categoryKeys.map((key) => (
            <button
              key={key}
              onClick={() => toggleParam("category", key)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] border transition-all duration-300 ${
                activeCategory === key
                  ? "bg-gold text-white border-gold"
                  : "border-tortoise/20 text-tortoise/70 hover:border-tortoise/40 hover:text-tortoise"
              }`}
            >
              {CATEGORIES[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-tortoise/50 mb-3">
            SOUS-CATÉGORIES
          </p>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <button
                key={sub.value}
                onClick={() => toggleParam("subcategory", sub.value)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] border transition-all duration-300 ${
                  activeSubcategory === sub.value
                    ? "bg-gold text-white border-gold"
                    : "border-tortoise/20 text-tortoise/70 hover:border-tortoise/40 hover:text-tortoise"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sort + Reset row */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-[0.12em] text-tortoise/50">
            TRIER PAR
          </label>
          <select
            value={activeSort}
            onChange={(e) => updateParams({ sort: e.target.value === "nouveautes" ? null : e.target.value })}
            className="text-xs uppercase tracking-[0.08em] text-tortoise bg-transparent border border-tortoise/20 px-3 py-2 focus:outline-none focus:border-tortoise/40"
          >
            <option value="nouveautes">Nouveautés</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
          </select>
        </div>

        {hasFilters && (
          <button
            onClick={resetFilters}
            className="text-xs uppercase tracking-[0.1em] text-tortoise/50 underline underline-offset-4 hover:text-tortoise transition-colors"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>
    </div>
  );
}
