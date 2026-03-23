"use client";

import FadeIn from "@/components/FadeIn";
import EditableImage from "@/components/EditableImage";
import EditableText from "@/components/EditableText";

const VALUES = [
  {
    key: "instinct",
    name: "L'INSTINCT",
    seed: "trya-instinct",
    desc: "La vérité sauvage qui survit quand tout s'écroule. Cette part animale qui refuse de se conformer, qui sait avant de comprendre.",
  },
  {
    key: "eveil",
    name: "L'ÉVEIL",
    seed: "trya-eveil",
    desc: "Le passage brutal de l'inertie à l'action. Le moment où l'on décide de montrer les crocs plutôt que de subir en silence.",
  },
  {
    key: "dualite",
    name: "LA DUALITÉ",
    seed: "trya-dualite",
    desc: "L'équilibre souverain entre la douceur intérieure et la griffe extérieure. Porter sa vulnérabilité comme une force.",
  },
  {
    key: "souverainete",
    name: "LA SOUVERAINETÉ",
    seed: "trya-souverainete",
    desc: "Le droit absolu de régner sur son propre territoire. La fin n'appartient qu'à elle.",
  },
];

export default function AProposContent() {
  return (
    <>
      {/* Section 1: Hero */}
      <section className="relative w-full h-[80vh] overflow-hidden">
        <EditableImage
          settingKey="about_hero_image"
          fallbackSrc="https://picsum.photos/seed/trya-univers/1600/900"
          alt="L'univers Maison trya"
          className="absolute inset-0"
          imgClassName="w-full h-full object-cover brightness-50"
        />
        <div className="relative z-10 flex items-center justify-center h-full">
          <FadeIn direction="none">
            <EditableText
              settingKey="about_hero_title"
              fallback="L'UNIVERS MAISON TRYA."
              as="h1"
              className="font-bold uppercase text-3xl md:text-5xl lg:text-6xl text-cream tracking-[0.2em] text-center"
            />
          </FadeIn>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent z-10" />
      </section>

      {/* Section 2: Vision */}
      <section className="bg-cream py-32">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <FadeIn>
            <EditableText
              settingKey="about_vision_label"
              fallback="NOTRE VISION"
              as="p"
              className="font-bold uppercase tracking-[0.3em] text-xs text-rubber"
            />
            <EditableText
              settingKey="about_vision_title"
              fallback="PERMETTRE À CHAQUE FEMME D'ÉCOUTER ET DE MONTRER SA NATURE PROFONDE"
              as="h2"
              className="mt-8 font-bold uppercase text-2xl md:text-3xl text-tortoise leading-tight"
            />
          </FadeIn>
          <div className="w-16 border-t border-tortoise/30 mx-auto my-12" />
          <FadeIn delay={0.2}>
            <EditableText
              settingKey="about_vision_p1"
              fallback="La société enferme les femmes dans des trajectoires pré-tracées — mariage, carrière, conformité — créant une aliénation silencieuse. Le point de bascule est le moment où le carcan vole en éclats."
              as="p"
              className="text-lg text-tortoise/75 leading-relaxed"
              multiline
            />
          </FadeIn>
          <FadeIn delay={0.3}>
            <EditableText
              settingKey="about_vision_p2"
              fallback="Plutôt que de « tenir le coup », nous voyons dans ce vide l'opportunité de s'affranchir enfin. Maison trya. offre les outils de la reconquête : l'abri, l'éveil, le cri."
              as="p"
              className="text-lg text-tortoise/75 leading-relaxed mt-6"
              multiline
            />
          </FadeIn>
          <FadeIn delay={0.4}>
            <EditableText
              settingKey="about_vision_p3"
              fallback="Permettre à chaque femme de naviguer entre sa douceur et sa férocité, pour ne plus jamais se trahir."
              as="p"
              className="text-lg text-tortoise/75 leading-relaxed mt-6"
              multiline
            />
          </FadeIn>
        </div>
      </section>

      {/* Section 3: Les 4 Valeurs */}
      <section className="bg-cloud py-32 px-8">
        <FadeIn>
          <EditableText
            settingKey="about_values_title"
            fallback="NOS VALEURS"
            as="h2"
            className="font-bold uppercase tracking-[0.3em] text-center text-tortoise mb-16"
          />
        </FadeIn>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {VALUES.map((value, index) => (
            <FadeIn key={value.key} delay={index * 0.1}>
              <div className="relative min-h-[400px] overflow-hidden">
                <EditableImage
                  settingKey={`about_value_image_${value.key}`}
                  fallbackSrc={`https://picsum.photos/seed/${value.seed}/800/500`}
                  alt={value.name}
                  className="absolute inset-0"
                  imgClassName="w-full h-full object-cover brightness-[0.4]"
                />
                <div className="absolute bottom-0 left-0 p-10 z-10">
                  <EditableText
                    settingKey={`about_value_name_${value.key}`}
                    fallback={value.name}
                    as="h3"
                    className="font-bold uppercase text-cream text-2xl tracking-[0.15em]"
                  />
                  <EditableText
                    settingKey={`about_value_desc_${value.key}`}
                    fallback={value.desc}
                    as="p"
                    className="text-cream/80 text-base mt-4 leading-relaxed"
                    multiline
                  />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Section 4: La Fondatrice */}
      <section className="bg-cream py-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <FadeIn className="lg:col-span-5" direction="left">
            <EditableImage
              settingKey="about_founder_image"
              fallbackSrc="https://picsum.photos/seed/trya-fondatrice/600/800"
              alt="La fondatrice"
              imgClassName="w-full aspect-[3/4] object-cover"
            />
          </FadeIn>
          <FadeIn className="lg:col-span-7 lg:pl-16 flex flex-col justify-center" direction="right" delay={0.2}>
            <EditableText
              settingKey="about_founder_label"
              fallback="LA FONDATRICE"
              as="p"
              className="font-bold uppercase tracking-[0.3em] text-xs text-rubber"
            />
            <EditableText
              settingKey="about_founder_title"
              fallback="UNE VISION NÉE D'UN POINT DE BASCULE"
              as="h2"
              className="mt-4 font-bold uppercase text-2xl md:text-3xl text-tortoise leading-tight"
            />
            <EditableText
              settingKey="about_founder_text"
              fallback="Son histoire est celle d'une métamorphose. D'un refus. D'une renaissance. Bientôt, elle vous la racontera."
              as="p"
              className="mt-8 text-lg text-tortoise/75 leading-relaxed italic"
              multiline
            />
          </FadeIn>
        </div>
      </section>

      {/* Section 5: Big Idea */}
      <section className="w-full min-h-[60vh] bg-tortoise flex items-center justify-center flex-col px-8">
        <FadeIn direction="none">
          <EditableText
            settingKey="about_bigidea_text"
            fallback="ENTRE FÉROCITÉ ET VULNÉRABILITÉ"
            as="h2"
            className="font-bold uppercase text-3xl md:text-5xl lg:text-6xl text-cream tracking-[0.2em] text-center"
          />
          <div className="mt-12 flex justify-center">
            <img
              src="/logos/logo-horizontal-cream.svg"
              alt="Maison trya."
              className="w-[150px]"
            />
          </div>
        </FadeIn>
      </section>
    </>
  );
}
