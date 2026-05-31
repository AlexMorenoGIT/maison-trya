"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import EditableText from "@/components/EditableText";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useCart } from "@/lib/cart-context";
import { SPOTIFY_PLAYLISTS, SIZE_GUIDE, whatsappLink } from "@/lib/constants";
import type { Product } from "@/lib/types";

function formatPrice(price: number): string {
  return price.toLocaleString("fr-FR") + " €";
}

const COLLECTION_LABEL: Record<string, string> = {
  vulnerabilite: "Vulnérabilité",
  eveil: "Éveil",
  ferocite: "Férocité",
};

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
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
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

  const playlistId = SPOTIFY_PLAYLISTS[product.collection];
  const playlistUrl = playlistId
    ? `https://open.spotify.com/playlist/${playlistId}`
    : null;
  const qrCodeUrl = playlistUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(playlistUrl)}&size=240x240&margin=4&color=432918&bgcolor=F5F0E1`
    : null;

  const collectionLabel = COLLECTION_LABEL[product.collection] || "";

  const productWaLink = whatsappLink(
    `Bonjour, j'ai une question sur la pièce "${product.name}" (réf : ${product.slug}).`
  );
  const sizeGuideWaLink = whatsappLink(
    `Bonjour, j'aurais besoin de conseils sur la taille pour la pièce "${product.name}".`
  );

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
              <div className="flex items-baseline justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.15em]">
                  TAILLE
                </p>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs text-tortoise/60 underline underline-offset-2 hover:text-tortoise transition-colors"
                >
                  Guide des tailles
                </button>
              </div>
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
            {added ? "AJOUTÉ ✓" : "AJOUTER AU PANIER"}
          </button>

          {/* Composition */}
          <div className="mt-12 pt-8 border-t border-tortoise/10">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-tortoise/60 mb-2">
              COMPOSITION
            </p>
            <EditableText
              settingKey={`product_composition_${product.slug}`}
              fallback="À compléter par le studio. Cliquez ici en mode admin pour saisir la composition (matières, entretien)."
              as="p"
              className="text-sm leading-relaxed text-tortoise/80"
              multiline
            />
          </div>

          {/* Spotify playlist QR code */}
          {qrCodeUrl && playlistUrl && (
            <div className="mt-12 pt-8 border-t border-tortoise/10">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-tortoise/60">
                L&apos;AMBIANCE DE LA PIÈCE
              </p>
              <p className="mt-2 text-sm text-tortoise/70">
                Scanne pour écouter la playlist {collectionLabel} sur Spotify.
              </p>
              <div className="mt-6 flex items-start gap-6">
                <a
                  href={playlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 block bg-cream p-3 border border-tortoise/10 hover:border-tortoise/30 transition-colors"
                  aria-label={`Ouvrir la playlist ${collectionLabel} sur Spotify`}
                >
                  <img
                    src={qrCodeUrl}
                    alt={`QR code playlist ${collectionLabel}`}
                    width={120}
                    height={120}
                    className="block"
                  />
                </a>
                <div className="flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-[0.15em] text-tortoise">
                    Playlist {collectionLabel}
                  </p>
                  <a
                    href={playlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-tortoise/60 underline underline-offset-2 hover:text-tortoise transition-colors"
                  >
                    Ouvrir sur Spotify ↗
                  </a>
                </div>
              </div>
            </div>
          )}
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

      {/* WhatsApp concierge floating button */}
      {productWaLink && (
        <a
          href={productWaLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Conciergerie WhatsApp"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <WhatsAppIcon size={28} />
        </a>
      )}

      {/* Size guide modal */}
      <AnimatePresence>
        {sizeGuideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSizeGuideOpen(false)}
            className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-cream w-full max-w-lg p-8 md:p-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-rubber">
                    GUIDE DES TAILLES
                  </p>
                  <h2 className="mt-2 text-2xl font-bold uppercase tracking-[0.1em] text-tortoise">
                    Du 34 au 42
                  </h2>
                </div>
                <button
                  onClick={() => setSizeGuideOpen(false)}
                  aria-label="Fermer"
                  className="text-tortoise/60 hover:text-tortoise transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <p className="text-sm text-tortoise/70 mb-6 leading-relaxed">
                Toutes les mesures sont indiquées en centimètres et correspondent aux mensurations du corps, non du vêtement.
              </p>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-tortoise/20">
                    <th className="text-left py-3 text-xs font-bold uppercase tracking-[0.1em] text-tortoise/60">
                      Taille
                    </th>
                    <th className="text-right py-3 text-xs font-bold uppercase tracking-[0.1em] text-tortoise/60">
                      Poitrine
                    </th>
                    <th className="text-right py-3 text-xs font-bold uppercase tracking-[0.1em] text-tortoise/60">
                      Taille
                    </th>
                    <th className="text-right py-3 text-xs font-bold uppercase tracking-[0.1em] text-tortoise/60">
                      Hanches
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_GUIDE.map((row) => (
                    <tr key={row.size} className="border-b border-tortoise/10">
                      <td className="py-3 font-bold text-tortoise">{row.size}</td>
                      <td className="py-3 text-right text-tortoise/80">{row.bust}</td>
                      <td className="py-3 text-right text-tortoise/80">{row.waist}</td>
                      <td className="py-3 text-right text-tortoise/80">{row.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 pt-6 border-t border-tortoise/10">
                <p className="text-xs text-tortoise/60 italic leading-relaxed mb-4">
                  Une hésitation sur la taille ? Notre conciergerie est à ta disposition.
                </p>
                {sizeGuideWaLink ? (
                  <a
                    href={sizeGuideWaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#25D366] text-white px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#1ebe57] transition-colors"
                  >
                    <WhatsAppIcon size={18} />
                    Demander conseil sur WhatsApp
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-3 bg-tortoise/10 text-tortoise/50 px-5 py-3 text-xs font-bold uppercase tracking-[0.15em]">
                    <WhatsAppIcon size={18} />
                    Conciergerie à configurer
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
