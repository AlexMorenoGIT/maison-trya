"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface HeaderProps {
  forceDark?: boolean;
}

export default function Header({ forceDark = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = forceDark || scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark
          ? "bg-cream/95 backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      {/* Top section: Logo centered */}
      <div className="flex items-center justify-center py-4">
        <Link href="/">
          <img
            src={isDark ? "/logos/logo-bloc.svg" : "/logos/logo-bloc-cream.svg"}
            alt="Maison trya."
            className="h-[60px] transition-opacity duration-300"
          />
        </Link>
      </div>

      {/* Bottom section: Nav centered with icons on the right */}
      <div className="relative flex items-center justify-center pb-3">
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
            À Propos
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
    </header>
  );
}
