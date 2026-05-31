"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

type CollectionKey = "vulnerabilite" | "eveil" | "ferocite";

const QUESTIONS: { q: string; answers: string[] }[] = [
  {
    q: "Comment tu te sens en ce moment dans ta vie ?",
    answers: [
      "Je traverse quelque chose de difficile.",
      "Je suis dans une période de changement.",
      "Je me sens bien.",
    ],
  },
  {
    q: "De quoi as-tu besoin en ce moment ?",
    answers: [
      "De me poser et de me retrouver.",
      "De trouver mon équilibre.",
      "D'aller de l'avant et de m'affirmer.",
    ],
  },
  {
    q: "Comment tu t'habilles au quotidien ?",
    answers: [
      "Des pièces confortables et simples. Je veux me sentir bien dans mon corps.",
      "Un mix entre confort et style. J'aime les pièces qui ont du caractère sans être trop.",
      "Des pièces qui se remarquent. Le style c'est une façon de prendre l'espace.",
    ],
  },
  {
    q: "Qu'est-ce que tu attends d'un vêtement avant tout ?",
    answers: [
      "Qu'il me mette à l'aise et me protège.",
      "Qu'il me ressemble et reflète qui je suis en train de devenir.",
      "Qu'il me donne confiance et s'impose.",
    ],
  },
  {
    q: "Ce week-end, tu préfères...",
    answers: [
      "Un moment calme, seule ou avec des proches. Quelque chose de doux et ressourçant.",
      "Une sortie qui sort de l'ordinaire : expo, concert, découverte.",
      "Un festival, une soirée, un endroit où l'énergie est forte.",
    ],
  },
  {
    q: "Quelle playlist tu mettrais ce soir ?",
    answers: [
      "Sade, Lana Del Rey, Coldplay. Quelque chose de doux et apaisant.",
      "The Duke Spirit, The Kills, The Cure. Entre deux ambiances.",
      "Nirvana, Rolling Stones, Oasis. Du brut, du vivant, du rock.",
    ],
  },
];

const COLLECTION_BY_INDEX: CollectionKey[] = [
  "vulnerabilite",
  "eveil",
  "ferocite",
];

const RESULTS: Record<
  CollectionKey,
  { name: string; text: string; href: string }
> = {
  vulnerabilite: {
    name: "Vulnérabilité",
    text: "Tu traverses une période où tu as besoin de douceur et de protection. Les pièces Vulnérabilité sont faites pour toi, ce sont des matières qui enveloppent, des coupes fluides, des détails nacrés qui révèlent sans exposer. Un vestiaire qui te permet de te reconstruire à ton rythme.",
    href: "/catalogue?collection=vulnerabilite",
  },
  eveil: {
    name: "Éveil",
    text: "Tu es en transition. Tu cherches ton équilibre entre douceur et affirmation. Les pièces Éveil jouent exactement sur cette dualité, entre matières brutes et délicates, entre coupes structurées et libres. Des pièces pour accompagner ta transformation.",
    href: "/catalogue?collection=eveil",
  },
  ferocite: {
    name: "Férocité",
    text: "Tu sais qui tu es et tu veux que ça se voie. Les pièces Férocité sont faites pour toi : cuir brut, clous dorés, franges et motifs animaliers. Des pièces qui s'imposent et affichent ta liberté sans te demander de te justifier.",
    href: "/catalogue?collection=ferocite",
  },
};

function pickWinner(answers: (number | null)[]): CollectionKey {
  const counts: Record<CollectionKey, number> = {
    vulnerabilite: 0,
    eveil: 0,
    ferocite: 0,
  };
  for (const a of answers) {
    if (a !== null) counts[COLLECTION_BY_INDEX[a]]++;
  }
  // Tiebreak order: eveil > ferocite > vulnerabilite (favor transformation)
  const order: CollectionKey[] = ["eveil", "ferocite", "vulnerabilite"];
  let best: CollectionKey = "eveil";
  let bestCount = -1;
  for (const key of order) {
    if (counts[key] > bestCount) {
      best = key;
      bestCount = counts[key];
    }
  }
  return best;
}

export default function QuizClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null)
  );
  const [finished, setFinished] = useState(false);

  const total = QUESTIONS.length;
  const progress = ((step + (finished ? 1 : 0)) / total) * 100;

  const handleAnswer = (answerIndex: number) => {
    const next = [...answers];
    next[step] = answerIndex;
    setAnswers(next);
    setTimeout(() => {
      if (step < total - 1) {
        setStep(step + 1);
      } else {
        setFinished(true);
      }
    }, 250);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleRestart = () => {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setStep(0);
    setFinished(false);
  };

  if (finished) {
    const winner = pickWinner(answers);
    const result = RESULTS[winner];
    return (
      <section className="min-h-screen bg-cream pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bold uppercase tracking-[0.3em] text-xs text-rubber"
          >
            TON MIROIR D&apos;INSTINCT
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 font-bold uppercase text-5xl md:text-7xl text-tortoise tracking-[0.1em]"
          >
            {result.name}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-16 border-t border-tortoise/30 mx-auto my-10"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-tortoise/80 leading-relaxed max-w-2xl mx-auto"
          >
            {result.text}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex flex-col items-center gap-6"
          >
            <Link
              href={result.href}
              className="uppercase tracking-[0.2em] text-sm bg-tortoise text-cream px-10 py-4 hover:bg-rubber transition-colors duration-300"
            >
              Découvrir la collection {result.name}
            </Link>
            <button
              onClick={handleRestart}
              className="uppercase tracking-[0.15em] text-xs text-tortoise/60 hover:text-tortoise underline underline-offset-4 transition-colors"
            >
              Refaire le quiz
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  const current = QUESTIONS[step];

  return (
    <section className="min-h-screen bg-cream pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-bold uppercase tracking-[0.3em] text-xs text-rubber">
            QUIZ — MIROIR D&apos;INSTINCT
          </p>
          <p className="mt-4 text-sm text-tortoise/60 tracking-[0.1em]">
            Question {step + 1} / {total}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-px bg-tortoise/10 mb-16 relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-tortoise"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h2 className="font-bold uppercase text-2xl md:text-3xl text-tortoise leading-tight text-center mb-12">
              {current.q}
            </h2>

            <div className="flex flex-col gap-4">
              {current.answers.map((answer, i) => {
                const selected = answers[step] === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`group text-left px-8 py-6 border transition-all duration-300 ${
                      selected
                        ? "border-tortoise bg-tortoise text-cream"
                        : "border-tortoise/20 bg-cream text-tortoise hover:border-tortoise hover:bg-tortoise/5"
                    }`}
                  >
                    <span className="text-base md:text-lg leading-relaxed">
                      {answer}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Back button */}
        {step > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={handleBack}
              className="uppercase tracking-[0.15em] text-xs text-tortoise/60 hover:text-tortoise underline underline-offset-4 transition-colors"
            >
              ← Question précédente
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
