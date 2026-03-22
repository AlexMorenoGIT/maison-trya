"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

function formatPrice(price: number): string {
  return price.toLocaleString("fr-FR") + " \u20AC";
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const totalImages = product.images.length;

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? totalImages - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === totalImages - 1 ? 0 : prev + 1
    );
  };

  const currentImage = product.images[currentImageIndex];
  const hasRealImage = currentImage && currentImage.startsWith("http");
  const displayImage = hasRealImage
    ? currentImage
    : `https://picsum.photos/seed/${product.slug}-${currentImageIndex}/800/1000`;

  function handleAddToCart() {
    addItem({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      color: product.colors[selectedColor]?.name || "",
      size: product.sizes[selectedSize] || "",
      image: product.images[0] || "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <main className="bg-cloud text-tortoise">
      {/* Split layout */}
      <div className="lg:flex">
        {/* Left: Image Carousel */}
        <div className="relative lg:w-[55%] lg:h-screen lg:sticky lg:top-0">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {/* Navigation arrows */}
          {totalImages > 1 && (
            <>
              <button
                onClick={prevImage}
                aria-label="Image précédente"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/40 backdrop-blur-sm text-tortoise hover:bg-white/60 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                aria-label="Image suivante"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/40 backdrop-blur-sm text-tortoise hover:bg-white/60 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Dots indicator */}
          {totalImages > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`Image ${index + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex
                      ? "bg-tortoise"
                      : "bg-tortoise/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <FadeIn direction="right" className="lg:w-[45%] lg:py-32 py-16 px-8 lg:px-16">
          {/* Breadcrumb */}
          <p className="text-xs text-tortoise/50 uppercase tracking-[0.1em]">
            <Link href="/" className="hover:text-tortoise/80 transition-colors">
              ACCUEIL
            </Link>
            {" / "}
            <Link href="/catalogue" className="hover:text-tortoise/80 transition-colors">
              CATALOGUE
            </Link>
            {" / "}
            <span>{product.name}</span>
          </p>

          {/* Product name */}
          <h1 className="mt-8 text-3xl md:text-4xl font-bold uppercase tracking-[0.15em]">
            {product.name}
          </h1>

          {/* Price */}
          <p className="mt-4 text-xl">{formatPrice(product.price)}</p>

          {/* Color selector */}
          {product.colors.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.15em]">
                COULEUR
              </p>
              <div className="mt-3 flex gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(index)}
                    aria-label={color.name}
                    className={`w-6 h-6 rounded-full transition-all ${
                      index === selectedColor
                        ? "ring-2 ring-offset-2 ring-tortoise"
                        : ""
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs">
                {product.colors[selectedColor].name}
              </p>
            </div>
          )}

          {/* Size selector */}
          {product.sizes.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.15em]">
                TAILLE
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(index)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] border transition-all ${
                      index === selectedSize
                        ? "border-tortoise ring-1 ring-tortoise text-tortoise"
                        : "border-tortoise/20 text-tortoise/60 hover:border-tortoise/40"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="mt-8 text-base leading-relaxed text-tortoise/80">
            {product.description}
          </p>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`mt-12 w-full py-4 font-bold uppercase tracking-[0.2em] text-sm transition-all duration-300 ${
              added
                ? "bg-gold text-white"
                : "bg-tortoise text-cream hover:bg-tortoise/90"
            }`}
          >
            {added ? "AJOUTÉ \u2713" : "AJOUTER AU PANIER"}
          </button>

          {/* Guide des tailles */}
          <p className="mt-4 text-center">
            <button className="text-xs text-tortoise/50 underline uppercase tracking-[0.1em] hover:text-tortoise/80 transition-colors">
              GUIDE DES TAILLES
            </button>
          </p>
        </FadeIn>
      </div>

      {/* Related products section */}
      <section className="bg-cream">
        <div className="max-w-7xl mx-auto py-24 px-8">
          <div className="border-t border-tortoise/10" />
          <FadeIn>
            <h2 className="py-16 text-center text-xl font-bold uppercase tracking-[0.2em]">
              VOUS AIMEREZ AUSSI
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p, index) => (
              <FadeIn key={p.id} delay={index * 0.1}>
                <ProductCard product={p} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
