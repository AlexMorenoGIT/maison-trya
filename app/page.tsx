import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import HomeHero from "./HomeHero";

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .limit(6);

  const featuredProducts: Product[] = data || [];

  return (
    <>
      <Header />

      {/* -- Section 1: Hero ------------------------------------------------- */}
      <HomeHero />

      {/* -- Section 2: Manifeste "L'Instinct" ------------------------------- */}
      <section className="bg-cream py-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left side: Text */}
          <div className="lg:col-span-7">
            <FadeIn>
              <span className="font-bold uppercase tracking-[0.3em] text-xs text-rubber">
                L&apos;INSTINCT
              </span>

              <h2 className="font-bold uppercase text-3xl md:text-5xl leading-tight text-tortoise mt-4">
                LA VERITE SAUVAGE QUI SURVIT QUAND TOUT S&apos;ECROULE
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="mt-8 text-lg text-tortoise/80 leading-relaxed">
                Maison trya. est nee d&apos;un point de bascule. Ce moment ou le
                carcan vole en eclats, ou la femme refuse de tenir le coup pour
                enfin se reconquerir. Nous creons pour celles qui naviguent entre
                leur douceur et leur ferocite, sans jamais se trahir.
              </p>

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
            <img
              src="https://picsum.photos/seed/maison-trya-manifeste/600/800"
              alt="Maison trya manifeste"
              className="w-full aspect-[3/4] object-cover"
            />
          </FadeIn>
        </div>
      </section>

      {/* -- Section 3: Selection Produits ------------------------------------ */}
      <section id="collection" className="bg-cream py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="font-bold uppercase tracking-[0.3em] text-center text-3xl text-tortoise mb-16">
              LA COLLECTION
            </h2>
          </FadeIn>

          {/* Asymmetric grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Row 1 */}
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

            {/* Row 2 */}
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

            {/* Row 3 */}
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
      <section className="w-full h-[70vh] relative">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/seed/maison-trya-editorial/1600/900"
            alt="Editorial"
            className="w-full h-full object-cover brightness-50"
          />
        </div>

        {/* Centered quote */}
        <div className="relative z-10 flex items-center justify-center h-full px-8">
          <FadeIn direction="none">
            <p className="font-bold uppercase text-2xl md:text-4xl lg:text-5xl text-cream tracking-[0.15em] text-center max-w-4xl leading-relaxed">
              NOUS NE VENDONS PAS DE LA PARURE, MAIS UNE METAMORPHOSE.
            </p>
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
          <h2 className="font-bold uppercase tracking-[0.3em] text-cream text-center text-3xl mb-16">
            NOS VALEURS
          </h2>
        </FadeIn>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "L'INSTINCT",
              description:
                "La verite sauvage qui survit quand tout s'ecroule.",
            },
            {
              name: "L'EVEIL",
              description:
                "Le passage brutal de l'inertie a l'action. Montrer les crocs.",
            },
            {
              name: "LA DUALITE",
              description:
                "L'equilibre souverain entre la douceur interieure et la griffe exterieure.",
            },
            {
              name: "LA SOUVERAINETE",
              description:
                "Le droit absolu de regner sur son propre territoire.",
            },
          ].map((value, index) => (
            <FadeIn key={value.name} delay={index * 0.1}>
              <div className="border-t border-cream/20 pt-8">
                <h3 className="font-bold uppercase text-cream tracking-[0.15em] text-lg">
                  {value.name}
                </h3>
                <p className="text-cream/70 text-sm mt-4 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
