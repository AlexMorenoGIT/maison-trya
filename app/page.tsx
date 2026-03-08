"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { featuredProducts } from "@/lib/data/products";

export default function Home() {
  return (
    <>
      <Header />

      {/* ── Section 1: Hero ──────────────────────────────────────────────── */}
      <section className="h-screen w-full relative overflow-hidden bg-tortoise">
        {/* Animated grain texture */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none hero-grain" />

        {/* Centered content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
          <img
            src="/logos/logo-bloc-cream.svg"
            alt="Maison trya."
            className="w-[120px]"
          />

          <div className="h-12" />

          <h1 className="font-bold uppercase tracking-[0.3em] text-cream text-2xl md:text-4xl text-center">
            ENTRE FÉROCITÉ ET VULNÉRABILITÉ
          </h1>

          <div className="h-12" />

          <a
            href="#collection"
            className="uppercase tracking-[0.2em] text-sm border border-cream/50 px-8 py-3 text-cream hover:bg-cream hover:text-tortoise transition-all duration-300"
          >
            DÉCOUVRIR LA COLLECTION
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg
            width="20"
            height="30"
            viewBox="0 0 20 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-cream"
          >
            <path
              d="M10 2 L10 22 M4 16 L10 22 L16 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* ── Section 2: Manifeste "L'Instinct" ────────────────────────────── */}
      <section className="bg-cream py-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left side: Text */}
          <div className="lg:col-span-7">
            <span className="font-bold uppercase tracking-[0.3em] text-xs text-rubber">
              L&apos;INSTINCT
            </span>

            <h2 className="font-bold uppercase text-3xl md:text-5xl leading-tight text-tortoise mt-4">
              LA VÉRITÉ SAUVAGE QUI SURVIT QUAND TOUT S&apos;ÉCROULE
            </h2>

            <p className="mt-8 text-lg text-tortoise/80 leading-relaxed">
              Maison trya. est née d&apos;un point de bascule. Ce moment où le
              carcan vole en éclats, où la femme refuse de tenir le coup pour
              enfin se reconquérir. Nous créons pour celles qui naviguent entre
              leur douceur et leur férocité, sans jamais se trahir.
            </p>

            <a
              href="/a-propos"
              className="inline-block mt-8 font-bold uppercase text-sm tracking-[0.15em] text-tortoise underline underline-offset-8"
            >
              DÉCOUVRIR L&apos;UNIVERS →
            </a>
          </div>

          {/* Right side: Image */}
          <div className="lg:col-span-5">
            <ImagePlaceholder aspect="portrait" seed={42} className="h-full" />
          </div>
        </div>
      </section>

      {/* ── Section 3: Sélection Produits ─────────────────────────────────── */}
      <section id="collection" className="bg-cream py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-bold uppercase tracking-[0.3em] text-center text-3xl text-tortoise mb-16">
            LA COLLECTION
          </h2>

          {/* Asymmetric grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Row 1 */}
            {featuredProducts[0] && (
              <div className="lg:col-span-7">
                <ProductCard product={featuredProducts[0]} />
              </div>
            )}
            {featuredProducts[1] && (
              <div className="lg:col-span-5 lg:mt-16">
                <ProductCard product={featuredProducts[1]} />
              </div>
            )}

            {/* Row 2 */}
            {featuredProducts[2] && (
              <div className="lg:col-span-5">
                <ProductCard product={featuredProducts[2]} />
              </div>
            )}
            {featuredProducts[3] && (
              <div className="lg:col-span-7 lg:mt-16">
                <ProductCard product={featuredProducts[3]} />
              </div>
            )}

            {/* Row 3 */}
            {featuredProducts[4] && (
              <div className="lg:col-span-7">
                <ProductCard product={featuredProducts[4]} />
              </div>
            )}
            {featuredProducts[5] && (
              <div className="lg:col-span-5 lg:mt-16">
                <ProductCard product={featuredProducts[5]} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Section 4: Editorial Quote ────────────────────────────────────── */}
      <section className="w-full h-[70vh] relative">
        {/* Background image */}
        <div className="absolute inset-0">
          <ImagePlaceholder aspect="wide" seed={99} overlay className="!aspect-auto h-full" />
        </div>

        {/* Centered quote */}
        <div className="relative z-10 flex items-center justify-center h-full px-8">
          <p className="font-bold uppercase text-2xl md:text-4xl lg:text-5xl text-cream tracking-[0.15em] text-center max-w-4xl leading-relaxed">
            NOUS NE VENDONS PAS DE LA PARURE, MAIS UNE MÉTAMORPHOSE.
          </p>
        </div>

        {/* Bottom right logo */}
        <img
          src="/logos/logo-horizontal-cream.svg"
          alt="Maison trya."
          className="absolute bottom-8 right-8 w-[100px] z-10"
        />
      </section>

      {/* ── Section 5: Les 4 Valeurs ──────────────────────────────────────── */}
      <section className="bg-tortoise py-24 px-8">
        <h2 className="font-bold uppercase tracking-[0.3em] text-cream text-center text-3xl mb-16">
          NOS VALEURS
        </h2>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "L'INSTINCT",
              description:
                "La vérité sauvage qui survit quand tout s'écroule.",
            },
            {
              name: "L'ÉVEIL",
              description:
                "Le passage brutal de l'inertie à l'action. Montrer les crocs.",
            },
            {
              name: "LA DUALITÉ",
              description:
                "L'équilibre souverain entre la douceur intérieure et la griffe extérieure.",
            },
            {
              name: "LA SOUVERAINETÉ",
              description:
                "Le droit absolu de régner sur son propre territoire.",
            },
          ].map((value) => (
            <div key={value.name} className="border-t border-cream/20 pt-8">
              <h3 className="font-bold uppercase text-cream tracking-[0.15em] text-lg">
                {value.name}
              </h3>
              <p className="text-cream/70 text-sm mt-4 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
