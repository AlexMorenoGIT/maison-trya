"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import FadeIn from "@/components/FadeIn";
import {
  getProductById,
  getRelatedProducts,
  products,
} from "@/lib/data/products";

function formatPrice(price: number): string {
  return price.toLocaleString("fr-FR") + " \u20AC";
}

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const product = getProductById(id);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);

  if (!product) {
    return (
      <>
        <Header forceDark />
        <main className="flex min-h-screen flex-col items-center justify-center bg-cream text-tortoise">
          <h1 className="text-2xl font-bold uppercase tracking-[0.2em]">
            PRODUIT NON TROUV&Eacute;
          </h1>
          <Link
            href="/"
            className="mt-8 text-sm uppercase tracking-[0.15em] underline underline-offset-4 text-tortoise/60 hover:text-tortoise transition-colors"
          >
            Retour &agrave; l&apos;accueil
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const baseSeed = parseInt(product.id.replace(/\D/g, "") || "0", 10);
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

  // Get related products; fill up to 4 if not enough in same category
  let related = getRelatedProducts(product.id, 4);
  if (related.length < 4) {
    const remaining = products.filter(
      (p) => p.id !== product.id && !related.find((r) => r.id === p.id)
    );
    related = [...related, ...remaining.slice(0, 4 - related.length)];
  }

  return (
    <>
      <Header forceDark />

      <main className="bg-cloud text-tortoise">
        {/* Split layout */}
        <div className="lg:flex">
          {/* Left: Image Carousel */}
          <div className="relative lg:w-[55%] lg:h-screen lg:sticky lg:top-0">
            <ImagePlaceholder
              aspect="portrait"
              seed={baseSeed + currentImageIndex}
              className="h-full"
            />

            {/* Navigation arrows */}
            {totalImages > 1 && (
              <>
                <button
                  onClick={prevImage}
                  aria-label="Image pr&eacute;c&eacute;dente"
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
              <Link href="/" className="hover:text-tortoise/80 transition-colors">
                COLLECTIONS
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

            {/* Description */}
            <p className="mt-8 text-base leading-relaxed text-tortoise/80">
              {product.description}
            </p>

            {/* Add to cart */}
            <button className="mt-12 w-full bg-tortoise text-cream py-4 font-bold uppercase tracking-[0.2em] text-sm hover:bg-dark transition-colors">
              AJOUTER AU PANIER
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
              {related.map((p, index) => (
                <FadeIn key={p.id} delay={index * 0.1}>
                  <ProductCard product={p} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
