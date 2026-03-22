"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images?.[0];
  const hasRealImage = firstImage && firstImage.startsWith("http");
  const placeholderImage = `https://picsum.photos/seed/${product.slug}/600/800`;

  const formattedPrice = `${product.price.toLocaleString("fr-FR")} \u20AC`;

  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      {/* Image area */}
      <div className="overflow-hidden">
        <div className="transition-transform duration-500 group-hover:scale-105">
          <img
            src={hasRealImage ? firstImage : placeholderImage}
            alt={product.name}
            className="w-full aspect-[3/4] object-cover"
          />
        </div>
      </div>

      {/* Product info */}
      <h3 className="mt-4 text-sm font-bold uppercase tracking-[0.1em]">
        {product.name}
      </h3>
      <p className="mt-1 text-sm">
        {formattedPrice}
      </p>

      {/* Color swatches */}
      {product.colors.length > 0 && (
        <div className="mt-2 flex gap-2">
          {product.colors.map((color) => (
            <span
              key={color.name}
              className="block h-3 w-3 rounded-full border border-tortoise/20"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      )}
    </Link>
  );
}
