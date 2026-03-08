"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface HeaderProps {
  forceDark?: boolean;
}

export default function Header({ forceDark = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isDark = forceDark || scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isDark
            ? "bg-cream/95 backdrop-blur-sm"
            : "bg-transparent"
        }`}
      >
        {/* Top section: Logo centered, hamburger on left for mobile */}
        <div className="relative flex items-center justify-center py-4">
          {/* Hamburger - mobile only */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className={`absolute left-6 md:hidden transition-colors duration-300 ${
              isDark ? "text-tortoise" : "text-cream"
            }`}
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
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Link href="/">
            <img
              src={isDark ? "/logos/logo-bloc.svg" : "/logos/logo-bloc-cream.svg"}
              alt="Maison trya."
              className="h-[50px] md:h-[60px] transition-opacity duration-300"
            />
          </Link>
        </div>

        {/* Bottom section: Nav centered with icons on the right - hidden on mobile */}
        <div className="relative hidden md:flex items-center justify-center pb-3">
          <nav className="flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                isDark ? "text-tortoise" : "text-cream"
              }`}
            >
              Collections
            </Link>
            <Link
              href="/a-propos"
              className={`text-sm font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                isDark ? "text-tortoise" : "text-cream"
              }`}
            >
              L&apos;Univers
            </Link>
            <Link
              href="/a-propos"
              className={`text-sm font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                isDark ? "text-tortoise" : "text-cream"
              }`}
            >
              &Agrave; Propos
            </Link>
          </nav>

          {/* Icons on the right */}
          <div className="absolute right-6 flex items-center gap-4">
            {/* Search icon */}
            <button
              aria-label="Rechercher"
              className={`transition-colors duration-300 ${
                isDark ? "text-tortoise" : "text-cream"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            {/* Cart icon */}
            <button
              aria-label="Panier"
              className={`transition-colors duration-300 ${
                isDark ? "text-tortoise" : "text-cream"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile icons - right side */}
        <div className="absolute top-4 right-6 flex items-center gap-4 md:hidden">
          <button
            aria-label="Rechercher"
            className={`transition-colors duration-300 ${
              isDark ? "text-tortoise" : "text-cream"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button
            aria-label="Panier"
            className={`transition-colors duration-300 ${
              isDark ? "text-tortoise" : "text-cream"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </button>
        </div>
      </header>

      {/* Full-screen mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-tortoise z-[60] flex flex-col items-center justify-center"
          >
            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu"
              className="absolute top-6 right-6 text-cream"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
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

            {/* Logo */}
            <img
              src="/logos/logo-bloc-cream.svg"
              alt="Maison trya."
              className="h-[60px] mb-16"
            />

            {/* Nav links */}
            <nav className="flex flex-col items-center gap-8">
              {[
                { href: "/", label: "Collections" },
                { href: "/a-propos", label: "L'Univers" },
                { href: "/a-propos", label: "\u00C0 Propos" },
              ].map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-2xl font-bold uppercase tracking-[0.3em] text-cream hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
