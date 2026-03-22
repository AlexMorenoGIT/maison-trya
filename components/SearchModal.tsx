"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface SearchResult {
  slug: string;
  name: string;
  price: number;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const search = useCallback(async (term: string) => {
    if (term.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("slug, name, price")
        .ilike("name", `%${term}%`)
        .limit(8);
      setResults(data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-tortoise/90 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Fermer la recherche"
            className="absolute top-6 right-8 text-cream/70 hover:text-cream transition-colors"
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

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="w-full max-w-2xl mt-[20vh] px-8"
          >
            {/* Search input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-transparent border-0 border-b border-cream/30 pb-4 text-2xl md:text-3xl text-cream placeholder-cream/40 outline-none tracking-[0.05em] font-bold uppercase"
            />

            {/* Results */}
            <div className="mt-8 space-y-1">
              {loading && (
                <p className="text-cream/50 text-sm uppercase tracking-[0.1em]">
                  Recherche...
                </p>
              )}

              {!loading && query.length >= 2 && results.length === 0 && (
                <p className="text-cream/50 text-sm uppercase tracking-[0.1em]">
                  Aucun r&eacute;sultat
                </p>
              )}

              {results.map((product) => (
                <Link
                  key={product.slug}
                  href={`/produit/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between py-3 border-b border-cream/10 text-cream hover:text-gold transition-colors duration-300 group"
                >
                  <span className="text-sm uppercase tracking-[0.1em]">
                    {product.name}
                  </span>
                  <span className="text-sm text-cream/60 group-hover:text-gold/80 transition-colors duration-300">
                    {product.price}&nbsp;&euro;
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
