"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { COLLECTIONS, CATEGORIES } from "@/lib/constants";
import type { Product } from "@/lib/types";
import type { CategoryValue } from "@/lib/constants";

interface ProductFormProps {
  product?: Product;
}

interface ColorEntry {
  name: string;
  hex: string;
}

interface ImageEntry {
  url: string;
  file?: File;
  preview?: string;
}

function generateSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

const categoryKeys = Object.keys(CATEGORIES) as CategoryValue[];

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [collection, setCollection] = useState(product?.collection ?? "");
  const [category, setCategory] = useState<string>(product?.category ?? "");
  const [subcategory, setSubcategory] = useState(product?.subcategory ?? "");
  const [colors, setColors] = useState<ColorEntry[]>(
    product?.colors?.length ? product.colors : [{ name: "", hex: "#000000" }]
  );
  const [sizesInput, setSizesInput] = useState(product?.sizes?.join(", ") ?? "");
  const [images, setImages] = useState<ImageEntry[]>(
    product?.images?.map((url) => ({ url })) ?? []
  );
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset subcategory when category changes
  useEffect(() => {
    if (!isEdit || category !== product?.category) {
      setSubcategory("");
    }
  }, [category]);

  const subcategories = category
    ? CATEGORIES[category as CategoryValue]?.subcategories ?? []
    : [];

  // Color management
  const addColor = () => setColors([...colors, { name: "", hex: "#000000" }]);
  const removeColor = (i: number) => setColors(colors.filter((_, idx) => idx !== i));
  const updateColor = (i: number, field: keyof ColorEntry, value: string) => {
    const next = [...colors];
    next[i] = { ...next[i], [field]: value };
    setColors(next);
  };

  // Image management
  const addImage = () => setImages([...images, { url: "" }]);
  const removeImage = (i: number) => {
    const entry = images[i];
    if (entry.preview) URL.revokeObjectURL(entry.preview);
    setImages(images.filter((_, idx) => idx !== i));
  };
  const moveImage = (i: number, dir: -1 | 1) => {
    const next = [...images];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setImages(next);
  };
  const handleImageUrl = (i: number, url: string) => {
    const next = [...images];
    next[i] = { url };
    setImages(next);
  };
  const handleImageFile = (i: number, file: File | null) => {
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Format non supporté. Utilisez JPEG, PNG ou WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Fichier trop volumineux. Maximum 5 Mo.");
      return;
    }
    const next = [...images];
    if (next[i]?.preview) URL.revokeObjectURL(next[i].preview!);
    next[i] = { url: "", file, preview: URL.createObjectURL(file) };
    setImages(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length > 200) {
      setError("Le nom doit contenir entre 1 et 200 caractères.");
      return;
    }
    if (description.length > 5000) {
      setError("La description ne doit pas dépasser 5000 caractères.");
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0 || numPrice >= 100000) {
      setError("Le prix doit être entre 0.01 et 99 999 €.");
      return;
    }
    if (!collection) {
      setError("Veuillez sélectionner une collection.");
      return;
    }
    if (!category) {
      setError("Veuillez sélectionner une catégorie.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();

      // Upload files first
      const finalImageUrls: string[] = [];
      for (const img of images) {
        if (img.file) {
          const ext = img.file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { data, error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(fileName, img.file);
          if (uploadError) throw new Error("Erreur upload image : " + uploadError.message);
          const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(data.path);
          finalImageUrls.push(urlData.publicUrl);
        } else if (img.url) {
          finalImageUrls.push(img.url);
        }
      }

      const slug = generateSlug(name);
      const sizes = sizesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const validColors = colors.filter((c) => c.name.trim());

      const productData = {
        name,
        slug,
        description,
        price: parseFloat(price),
        collection,
        category,
        subcategory,
        colors: validColors,
        sizes,
        images: finalImageUrls,
        is_featured: isFeatured,
      };

      if (isEdit) {
        const { error: updateError } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);
        if (updateError) throw new Error(updateError.message);
      } else {
        const { error: insertError } = await supabase
          .from("products")
          .insert(productData);
        if (insertError) throw new Error(insertError.message);
      }

      router.push("/admin/produits");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-10">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Section: Informations */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-tortoise/40 mb-4 pb-2 border-b border-tortoise/10">
          Informations
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-tortoise mb-1.5">
              Nom du produit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-tortoise/20 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              placeholder="Ex: Robe Vulnérabilité"
            />
            {name && (
              <p className="mt-1 text-xs text-tortoise/40">
                Slug : {generateSlug(name)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-tortoise mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-tortoise/20 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-vertical"
              placeholder="Description du produit..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-tortoise mb-1.5">
                Prix (EUR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-3 border border-tortoise/20 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-tortoise mb-1.5">
                Tailles
              </label>
              <input
                type="text"
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
                className="w-full px-4 py-3 border border-tortoise/20 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                placeholder="XS, S, M, L, XL"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFeatured(!isFeatured)}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                isFeatured ? "bg-gold" : "bg-tortoise/20"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isFeatured ? "translate-x-4" : ""
                }`}
              />
            </button>
            <label className="text-sm text-tortoise">Produit vedette</label>
          </div>
        </div>
      </section>

      {/* Section: Classification */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-tortoise/40 mb-4 pb-2 border-b border-tortoise/10">
          Classification
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-tortoise mb-1.5">
              Collection
            </label>
            <select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              className="w-full px-4 py-3 border border-tortoise/20 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
            >
              <option value="">-- Choisir --</option>
              {COLLECTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-tortoise mb-1.5">
              Catégorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-tortoise/20 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
            >
              <option value="">-- Choisir --</option>
              {categoryKeys.map((key) => (
                <option key={key} value={key}>{CATEGORIES[key].label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-tortoise mb-1.5">
              Sous-catégorie
            </label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              disabled={!category}
              className="w-full px-4 py-3 border border-tortoise/20 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold disabled:opacity-50"
            >
              <option value="">-- Choisir --</option>
              {subcategories.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Section: Couleurs */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-tortoise/40 mb-4 pb-2 border-b border-tortoise/10">
          Couleurs
        </h2>
        <div className="space-y-3">
          {colors.map((color, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={color.name}
                onChange={(e) => updateColor(i, "name", e.target.value)}
                placeholder="Nom de la couleur"
                className="flex-1 px-4 py-2.5 border border-tortoise/20 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
              <input
                type="color"
                value={color.hex}
                onChange={(e) => updateColor(i, "hex", e.target.value)}
                className="w-10 h-10 rounded border border-tortoise/20 cursor-pointer"
              />
              {colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColor(i)}
                  className="p-2 text-tortoise/30 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addColor}
            className="text-sm text-gold hover:text-rubber transition-colors font-medium"
          >
            + Ajouter une couleur
          </button>
        </div>
      </section>

      {/* Section: Médias */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-tortoise/40 mb-4 pb-2 border-b border-tortoise/10">
          Médias
        </h2>
        <div className="space-y-4">
          {images.map((img, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white border border-tortoise/10 rounded-lg">
              {/* Preview */}
              <div className="w-16 h-16 shrink-0 rounded bg-cloud overflow-hidden">
                {(img.preview || img.url) ? (
                  <Image
                    src={img.preview || img.url}
                    alt=""
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-tortoise/20">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={img.file ? img.file.name : img.url}
                  onChange={(e) => handleImageUrl(i, e.target.value)}
                  disabled={!!img.file}
                  placeholder="URL de l'image"
                  className="w-full px-3 py-2 border border-tortoise/20 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:bg-cloud disabled:text-tortoise/50"
                />
                <label className="inline-flex items-center gap-1.5 text-xs text-gold cursor-pointer hover:text-rubber transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleImageFile(i, e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                  Ou uploader un fichier
                </label>
              </div>

              {/* Reorder & remove */}
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveImage(i, -1)}
                  disabled={i === 0}
                  className="p-1 text-tortoise/30 hover:text-tortoise disabled:opacity-20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(i, 1)}
                  disabled={i === images.length - 1}
                  className="p-1 text-tortoise/30 hover:text-tortoise disabled:opacity-20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="p-1 text-tortoise/30 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addImage}
            className="text-sm text-gold hover:text-rubber transition-colors font-medium"
          >
            + Ajouter une image
          </button>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-tortoise/10">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-tortoise text-cream text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-rubber transition-colors disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer le produit"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/produits")}
          className="px-6 py-3 text-sm text-tortoise/60 hover:text-tortoise transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
