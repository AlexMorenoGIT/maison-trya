"use client";

import { motion } from "framer-motion";

export default function HomeHero() {
  return (
    <section className="h-screen w-full relative overflow-hidden bg-tortoise">
      {/* Animated grain texture */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none hero-grain" />

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src="/logos/logo-bloc-cream.svg"
          alt="Maison trya."
          className="w-[120px]"
        />

        <div className="h-12" />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="font-bold uppercase tracking-[0.3em] text-cream text-2xl md:text-4xl text-center"
        >
          ENTRE FEROCITE ET VULNERABILITE
        </motion.h1>

        <div className="h-12" />

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          href="/catalogue"
          className="uppercase tracking-[0.2em] text-sm border border-cream/50 px-8 py-3 text-cream hover:bg-cream hover:text-tortoise transition-all duration-300"
        >
          DECOUVRIR LA COLLECTION
        </motion.a>
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
  );
}
