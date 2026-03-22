"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";

interface MegaMenuProps {
  onClose: () => void;
}

export default function MegaMenu({ onClose }: MegaMenuProps) {
  const categoryKeys = Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="absolute top-full left-0 right-0 bg-cream border-t border-tortoise/10 shadow-sm z-40"
      onMouseLeave={onClose}
    >
      <div className="mx-auto max-w-5xl px-8 py-10">
        <div className="grid grid-cols-3 gap-12">
          {categoryKeys.map((key) => {
            const category = CATEGORIES[key];
            return (
              <div key={key}>
                <Link
                  href={`/catalogue?category=${key}`}
                  className="text-xs font-bold uppercase tracking-[0.2em] text-tortoise mb-5 block hover:text-gold transition-colors duration-300"
                >
                  {category.label}
                </Link>
                <ul className="space-y-3">
                  {category.subcategories.map((sub) => (
                    <li key={sub.value}>
                      <Link
                        href={`/catalogue?category=${key}&subcategory=${sub.value}`}
                        className="text-sm text-tortoise/70 hover:text-tortoise transition-colors duration-300 tracking-[0.05em]"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* View all link */}
        <div className="mt-8 pt-6 border-t border-tortoise/10">
          <Link
            href="/catalogue"
            className="text-xs font-bold uppercase tracking-[0.2em] text-tortoise/50 hover:text-tortoise transition-colors duration-300"
          >
            Voir tout le catalogue
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
