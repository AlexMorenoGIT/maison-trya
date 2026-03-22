"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { COLLECTIONS, CATEGORIES } from "@/lib/constants";
import CartIcon from "./CartIcon";
import MegaMenu from "./MegaMenu";
import SearchModal from "./SearchModal";

interface HeaderProps {
  forceDark?: boolean;
}

export default function Header({ forceDark = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const collectionsTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
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
  const textClass = isDark ? "text-tortoise" : "text-cream";
  const linkClass = `text-sm font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${textClass}`;

  // Mega-menu hover handlers with delay
  const openMegaMenu = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setMegaMenuOpen(true);
    setCollectionsOpen(false);
  };
  const closeMegaMenu = () => {
    megaMenuTimeout.current = setTimeout(() => setMegaMenuOpen(false), 100);
  };

  // Collections dropdown hover handlers
  const openCollections = () => {
    if (collectionsTimeout.current) clearTimeout(collectionsTimeout.current);
    setCollectionsOpen(true);
    setMegaMenuOpen(false);
  };
  const closeCollections = () => {
    collectionsTimeout.current = setTimeout(() => setCollectionsOpen(false), 100);
  };

  const categoryKeys = Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isDark ? "bg-cream/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        {/* Desktop header — single horizontal bar */}
        <div className="hidden md:flex items-center justify-between px-8 lg:px-12 py-5">
          {/* Left: Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src={isDark ? "/logos/logo-horizontal.svg" : "/logos/logo-horizontal-cream.svg"}
              alt="Maison trya."
              className="h-[28px] lg:h-[32px] transition-opacity duration-300"
            />
          </Link>

          {/* Center: Nav */}
          <nav className="flex items-center gap-8 lg:gap-10">
            {/* Catalogue with mega-menu */}
            <div
              className="relative"
              onMouseEnter={openMegaMenu}
              onMouseLeave={closeMegaMenu}
            >
              <Link href="/catalogue" className={linkClass}>
                Catalogue
              </Link>
            </div>

            {/* Collections with dropdown */}
            <div
              className="relative"
              onMouseEnter={openCollections}
              onMouseLeave={closeCollections}
            >
              <span className={`${linkClass} cursor-default`}>
                Collections
              </span>

              <AnimatePresence>
                {collectionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-cream border border-tortoise/10 shadow-sm py-4 px-6 min-w-[180px]"
                    onMouseEnter={openCollections}
                    onMouseLeave={closeCollections}
                  >
                    {COLLECTIONS.map((col) => (
                      <Link
                        key={col.value}
                        href={`/catalogue?collection=${col.value}`}
                        className="block py-2 text-sm text-tortoise/70 hover:text-tortoise tracking-[0.08em] transition-colors duration-300"
                      >
                        {col.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/a-propos" className={linkClass}>
              L&apos;Univers
            </Link>

            <Link href="/a-propos" className={linkClass}>
              &Agrave; Propos
            </Link>
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher"
              className={`transition-colors duration-300 ${textClass}`}
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

            {/* Account */}
            <Link
              href="/connexion"
              aria-label="Mon compte"
              className={`transition-colors duration-300 ${textClass}`}
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
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              href="/panier"
              aria-label="Panier"
              className={`transition-colors duration-300 ${textClass}`}
            >
              <CartIcon />
            </Link>
          </div>
        </div>

        {/* Mega-menu (rendered inside header for positioning) */}
        <AnimatePresence>
          {megaMenuOpen && (
            <div
              onMouseEnter={openMegaMenu}
              onMouseLeave={closeMegaMenu}
            >
              <MegaMenu onClose={() => setMegaMenuOpen(false)} />
            </div>
          )}
        </AnimatePresence>

        {/* Mobile header */}
        <div className="flex md:hidden items-center justify-between px-6 py-4">
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className={`transition-colors duration-300 ${textClass}`}
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

          {/* Logo center */}
          <Link href="/">
            <img
              src={isDark ? "/logos/logo-horizontal.svg" : "/logos/logo-horizontal-cream.svg"}
              alt="Maison trya."
              className="h-[24px] transition-opacity duration-300"
            />
          </Link>

          {/* Icons right */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher"
              className={`transition-colors duration-300 ${textClass}`}
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
            <Link
              href="/panier"
              aria-label="Panier"
              className={`transition-colors duration-300 ${textClass}`}
            >
              <CartIcon />
            </Link>
          </div>
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
            className="fixed inset-0 bg-tortoise z-[60] flex flex-col overflow-y-auto"
          >
            {/* Top bar: close button */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="w-6" />
              <img
                src="/logos/logo-horizontal-cream.svg"
                alt="Maison trya."
                className="h-[24px]"
              />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
                className="text-cream"
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
            </div>

            {/* Nav */}
            <nav className="flex flex-col px-8 pt-8 pb-16 gap-2">
              {/* Catalogue accordion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <button
                  onClick={() =>
                    setMobileAccordion(
                      mobileAccordion === "catalogue" ? null : "catalogue"
                    )
                  }
                  className="flex items-center justify-between w-full py-3 text-xl font-bold uppercase tracking-[0.2em] text-cream"
                >
                  <span>Catalogue</span>
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
                    className={`transition-transform duration-300 ${
                      mobileAccordion === "catalogue" ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <AnimatePresence>
                  {mobileAccordion === "catalogue" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pb-4 space-y-4">
                        {categoryKeys.map((key) => {
                          const cat = CATEGORIES[key];
                          return (
                            <div key={key}>
                              <Link
                                href={`/catalogue?category=${key}`}
                                onClick={() => setMenuOpen(false)}
                                className="block text-sm font-bold uppercase tracking-[0.15em] text-gold mb-2"
                              >
                                {cat.label}
                              </Link>
                              <ul className="space-y-1 pl-2">
                                {cat.subcategories.map((sub) => (
                                  <li key={sub.value}>
                                    <Link
                                      href={`/catalogue?category=${key}&subcategory=${sub.value}`}
                                      onClick={() => setMenuOpen(false)}
                                      className="block text-sm text-cream/70 hover:text-cream py-1 tracking-[0.05em] transition-colors"
                                    >
                                      {sub.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                        <Link
                          href="/catalogue"
                          onClick={() => setMenuOpen(false)}
                          className="block text-xs uppercase tracking-[0.15em] text-cream/50 hover:text-cream pt-2 transition-colors"
                        >
                          Voir tout
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Collections accordion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <button
                  onClick={() =>
                    setMobileAccordion(
                      mobileAccordion === "collections" ? null : "collections"
                    )
                  }
                  className="flex items-center justify-between w-full py-3 text-xl font-bold uppercase tracking-[0.2em] text-cream"
                >
                  <span>Collections</span>
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
                    className={`transition-transform duration-300 ${
                      mobileAccordion === "collections" ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <AnimatePresence>
                  {mobileAccordion === "collections" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pb-4 space-y-1">
                        {COLLECTIONS.map((col) => (
                          <Link
                            key={col.value}
                            href={`/catalogue?collection=${col.value}`}
                            onClick={() => setMenuOpen(false)}
                            className="block text-sm text-cream/70 hover:text-cream py-2 tracking-[0.08em] transition-colors"
                          >
                            {col.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Simple links */}
              {[
                { href: "/a-propos", label: "L'Univers" },
                { href: "/a-propos", label: "\u00C0 Propos" },
                { href: "/connexion", label: "Mon Compte" },
              ].map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 text-xl font-bold uppercase tracking-[0.2em] text-cream hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
