"use client";

import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import EditableImage from "@/components/EditableImage";
import EditableText from "@/components/EditableText";
import type { Product } from "@/lib/types";

interface HomeContentProps {
  featuredProducts: Product[];
}

export default function HomeContent({ featuredProducts }: HomeContentProps) {
  return (
    <>
      {/* -- Section 2: Manifeste "L'Instinct" ------------------------------- */}
      <section className="bg-cream py-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left side: Text */}
          <div className="lg:col-span-7">
            <FadeIn>
              <EditableText
                settingKey="home_manifeste_label"
                fallback="L'INSTINCT"
                as="span"
                className="font-bold uppercase tracking-[0.3em] text-xs text-rubber"
              />

              <EditableText
                settingKey="home_manifeste_title"
                fallback="LA VERITE SAUVAGE QUI SURVIT QUAND TOUT S'ECROULE"
                as="h2"
                className="font-bold uppercase text-3xl md:text-5xl leading-tight text-tortoise mt-4"
              />
            </FadeIn>

            <FadeIn delay={0.2}>
              <EditableText
                settingKey="home_manifeste_text"
                fallback="Maison trya. est nee d'un point de bascule. Ce moment ou le carcan vole en eclats, ou la femme refuse de tenir le coup pour enfin se reconquerir. Nous creons pour celles qui naviguent entre leur douceur et leur ferocite, sans jamais se trahir."
                as="p"
                className="mt-8 text-lg text-tortoise/80 leading-relaxed"
                multiline
              />

              <a
                href="/a-propos"
                className="inline-block mt-8 font-bold uppercase text-sm tracking-[0.15em] text-tortoise underline underline-offset-8"
              >
                DECOUVRIR L&apos;UNIVERS &rarr;
              </a>
            </FadeIn>
          </div>

          {/* Right side: Image */}
          <FadeIn className="lg:col-span-5" delay={0.3} direction="right">
            <EditableImage
              settingKey="home_manifeste_image"
              fallbackSrc="https://picsum.photos/seed/maison-trya-manifeste/600/800"
              alt="Maison trya manifeste"
              imgClassName="w-full aspect-[3/4] object-cover"
            />
          </FadeIn>
        </div>
      </section>

      {/* -- Section 3: Selection Produits ------------------------------------ */}
      <section id="collection" className="bg-cream py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <EditableText
              settingKey="home_collection_title"
              fallback="LA COLLECTION"
              as="h2"
              className="font-bold uppercase tracking-[0.3em] text-center text-3xl text-tortoise mb-16"
            />
          </FadeIn>

          {/* Asymmetric grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {featuredProducts[0] && (
              <FadeIn className="md:col-span-1 lg:col-span-7" delay={0}>
                <ProductCard product={featuredProducts[0]} />
              </FadeIn>
            )}
            {featuredProducts[1] && (
              <FadeIn className="md:col-span-1 lg:col-span-5 lg:mt-16" delay={0.1}>
                <ProductCard product={featuredProducts[1]} />
              </FadeIn>
            )}
            {featuredProducts[2] && (
              <FadeIn className="md:col-span-1 lg:col-span-5" delay={0.2}>
                <ProductCard product={featuredProducts[2]} />
              </FadeIn>
            )}
            {featuredProducts[3] && (
              <FadeIn className="md:col-span-1 lg:col-span-7 lg:mt-16" delay={0.3}>
                <ProductCard product={featuredProducts[3]} />
              </FadeIn>
            )}
            {featuredProducts[4] && (
              <FadeIn className="md:col-span-1 lg:col-span-7" delay={0.4}>
                <ProductCard product={featuredProducts[4]} />
              </FadeIn>
            )}
            {featuredProducts[5] && (
              <FadeIn className="md:col-span-1 lg:col-span-5 lg:mt-16" delay={0.5}>
                <ProductCard product={featuredProducts[5]} />
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {/* -- Section 4: Editorial Quote --------------------------------------- */}
      <section className="w-full h-[70vh] relative overflow-hidden">
        {/* Background image */}
        <EditableImage
          settingKey="home_editorial_image"
          fallbackSrc="https://picsum.photos/seed/maison-trya-editorial/1600/900"
          alt="Editorial"
          className="absolute inset-0"
          imgClassName="w-full h-full object-cover brightness-50"
        />

        {/* Centered quote */}
        <div className="relative z-10 flex items-center justify-center h-full px-8">
          <FadeIn direction="none">
            <EditableText
              settingKey="home_editorial_quote"
              fallback="NOUS NE VENDONS PAS DE LA PARURE, MAIS UNE METAMORPHOSE."
              as="p"
              className="font-bold uppercase text-2xl md:text-4xl lg:text-5xl text-cream tracking-[0.15em] text-center max-w-4xl leading-relaxed"
            />
          </FadeIn>
        </div>

        {/* Bottom right logo */}
        <img
          src="/logos/logo-horizontal-cream.svg"
          alt="Maison trya."
          className="absolute bottom-8 right-8 w-[100px] z-10"
        />
      </section>

      {/* -- Section 5: Les 4 Valeurs ----------------------------------------- */}
      <section className="bg-tortoise py-24 px-8">
        <FadeIn>
          <EditableText
            settingKey="home_values_title"
            fallback="NOS VALEURS"
            as="h2"
            className="font-bold uppercase tracking-[0.3em] text-cream text-center text-3xl mb-16"
          />
        </FadeIn>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { key: "instinct", name: "L'INSTINCT", desc: "La verite sauvage qui survit quand tout s'ecroule." },
            { key: "eveil", name: "L'EVEIL", desc: "Le passage brutal de l'inertie a l'action. Montrer les crocs." },
            { key: "dualite", name: "LA DUALITE", desc: "L'equilibre souverain entre la douceur interieure et la griffe exterieure." },
            { key: "souverainete", name: "LA SOUVERAINETE", desc: "Le droit absolu de regner sur son propre territoire." },
          ].map((value, index) => (
            <FadeIn key={value.key} delay={index * 0.1}>
              <div className="border-t border-cream/20 pt-8">
                <EditableText
                  settingKey={`home_value_${value.key}_name`}
                  fallback={value.name}
                  as="h3"
                  className="font-bold uppercase text-cream tracking-[0.15em] text-lg"
                />
                <EditableText
                  settingKey={`home_value_${value.key}_desc`}
                  fallback={value.desc}
                  as="p"
                  className="text-cream/70 text-sm mt-4 leading-relaxed"
                  multiline
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
