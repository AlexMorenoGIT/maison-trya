import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";

export default function APropos() {
  return (
    <>
      <Header />

      {/* Section 1: Hero */}
      <section className="relative w-full h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <ImagePlaceholder aspect="wide" seed={200} overlay className="!h-full" />
        </div>
        {/* Centered content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="font-bold uppercase text-3xl md:text-5xl lg:text-6xl text-cream tracking-[0.2em] text-center">
            L&apos;UNIVERS MAISON TRYA.
          </h1>
        </div>
        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent z-10" />
      </section>

      {/* Section 2: Vision */}
      <section className="bg-cream py-32">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="font-bold uppercase tracking-[0.3em] text-xs text-rubber">
            NOTRE VISION
          </p>
          <h2 className="mt-8 font-bold uppercase text-2xl md:text-3xl text-tortoise leading-tight">
            PERMETTRE &Agrave; CHAQUE FEMME D&apos;&Eacute;COUTER ET DE MONTRER SA NATURE PROFONDE
          </h2>
          <div className="w-16 border-t border-tortoise/30 mx-auto my-12" />
          <p className="text-lg text-tortoise/75 leading-relaxed">
            La soci&eacute;t&eacute; enferme les femmes dans des trajectoires pr&eacute;-trac&eacute;es — mariage, carri&egrave;re, conformit&eacute; — cr&eacute;ant une ali&eacute;nation silencieuse. Le point de bascule est le moment o&ugrave; le carcan vole en &eacute;clats.
          </p>
          <p className="text-lg text-tortoise/75 leading-relaxed mt-6">
            Plut&ocirc;t que de &laquo;&nbsp;tenir le coup&nbsp;&raquo;, nous voyons dans ce vide l&apos;opportunit&eacute; de s&apos;affranchir enfin. Maison trya. offre les outils de la reconqu&ecirc;te&nbsp;: l&apos;abri, l&apos;&eacute;veil, le cri.
          </p>
          <p className="text-lg text-tortoise/75 leading-relaxed mt-6">
            Permettre &agrave; chaque femme de naviguer entre sa douceur et sa f&eacute;rocit&eacute;, pour ne plus jamais se trahir.
          </p>
        </div>
      </section>

      {/* Section 3: Les 4 Valeurs */}
      <section className="bg-cloud py-32 px-8">
        <h2 className="font-bold uppercase tracking-[0.3em] text-center text-tortoise mb-16">
          NOS VALEURS
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Valeur 1: L'Instinct */}
          <div className="relative min-h-[400px] overflow-hidden">
            <div className="absolute inset-0">
              <ImagePlaceholder aspect="landscape" seed={10} overlay className="!h-full" />
            </div>
            <div className="absolute bottom-0 left-0 p-10 z-10">
              <h3 className="font-bold uppercase text-cream text-2xl tracking-[0.15em]">
                L&apos;INSTINCT
              </h3>
              <p className="text-cream/80 text-base mt-4 leading-relaxed">
                La v&eacute;rit&eacute; sauvage qui survit quand tout s&apos;&eacute;croule. Cette part animale qui refuse de se conformer, qui sait avant de comprendre.
              </p>
            </div>
          </div>

          {/* Valeur 2: L'Éveil */}
          <div className="relative min-h-[400px] overflow-hidden">
            <div className="absolute inset-0">
              <ImagePlaceholder aspect="landscape" seed={20} overlay className="!h-full" />
            </div>
            <div className="absolute bottom-0 left-0 p-10 z-10">
              <h3 className="font-bold uppercase text-cream text-2xl tracking-[0.15em]">
                L&apos;&Eacute;VEIL
              </h3>
              <p className="text-cream/80 text-base mt-4 leading-relaxed">
                Le passage brutal de l&apos;inertie &agrave; l&apos;action. Le moment o&ugrave; l&apos;on d&eacute;cide de montrer les crocs plut&ocirc;t que de subir en silence.
              </p>
            </div>
          </div>

          {/* Valeur 3: La Dualité */}
          <div className="relative min-h-[400px] overflow-hidden">
            <div className="absolute inset-0">
              <ImagePlaceholder aspect="landscape" seed={30} overlay className="!h-full" />
            </div>
            <div className="absolute bottom-0 left-0 p-10 z-10">
              <h3 className="font-bold uppercase text-cream text-2xl tracking-[0.15em]">
                LA DUALIT&Eacute;
              </h3>
              <p className="text-cream/80 text-base mt-4 leading-relaxed">
                L&apos;&eacute;quilibre souverain entre la douceur int&eacute;rieure et la griffe ext&eacute;rieure. Porter sa vuln&eacute;rabilit&eacute; comme une force.
              </p>
            </div>
          </div>

          {/* Valeur 4: La Souveraineté */}
          <div className="relative min-h-[400px] overflow-hidden">
            <div className="absolute inset-0">
              <ImagePlaceholder aspect="landscape" seed={40} overlay className="!h-full" />
            </div>
            <div className="absolute bottom-0 left-0 p-10 z-10">
              <h3 className="font-bold uppercase text-cream text-2xl tracking-[0.15em]">
                LA SOUVERAINET&Eacute;
              </h3>
              <p className="text-cream/80 text-base mt-4 leading-relaxed">
                Le droit absolu de r&eacute;gner sur son propre territoire. La fin n&apos;appartient qu&apos;&agrave; elle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: La Fondatrice */}
      <section className="bg-cream py-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <ImagePlaceholder aspect="portrait" seed={300} />
          </div>
          <div className="lg:col-span-7 lg:pl-16 flex flex-col justify-center">
            <p className="font-bold uppercase tracking-[0.3em] text-xs text-rubber">
              LA FONDATRICE
            </p>
            <h2 className="mt-4 font-bold uppercase text-2xl md:text-3xl text-tortoise leading-tight">
              UNE VISION N&Eacute;E D&apos;UN POINT DE BASCULE
            </h2>
            <p className="mt-8 text-lg text-tortoise/75 leading-relaxed italic">
              Son histoire est celle d&apos;une m&eacute;tamorphose. D&apos;un refus. D&apos;une renaissance. Bient&ocirc;t, elle vous la racontera.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Big Idea */}
      <section className="w-full min-h-[60vh] bg-tortoise flex items-center justify-center flex-col px-8">
        <h2 className="font-bold uppercase text-3xl md:text-5xl lg:text-6xl text-cream tracking-[0.2em] text-center">
          ENTRE F&Eacute;ROCIT&Eacute; ET VULN&Eacute;RABILIT&Eacute;
        </h2>
        <div className="mt-12">
          <img
            src="/logos/logo-horizontal-cream.svg"
            alt="Maison trya."
            className="w-[150px]"
          />
        </div>
      </section>

      <Footer />
    </>
  );
}
