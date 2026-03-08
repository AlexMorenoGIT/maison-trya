"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import ImagePlaceholder from "./ImagePlaceholder";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const seed = parseInt(product.id.replace(/\D/g, "") || "0", 10);

  const formattedPrice = `${product.price.toLocaleString("fr-FR")} \u20AC`;

  return (
    <Link href={`/produit/${product.id}`} className="group block">
      {/* Image area */}
      <div className="overflow-hidden">
        <div className="transition-transform duration-500 group-hover:scale-105">
          <ImagePlaceholder aspect="portrait" seed={seed} />
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
