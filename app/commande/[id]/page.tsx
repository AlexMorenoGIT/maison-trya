"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface OrderData {
  id: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  customer_name: string;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export default function CommandePage() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("last-order");
      if (raw) {
        setOrder(JSON.parse(raw));
        localStorage.removeItem("last-order");
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <>
        <Header forceDark />
        <main className="min-h-screen bg-cream" />
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header forceDark />
        <main className="min-h-screen bg-cream flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.15em] text-tortoise/60 mb-8">
              Commande introuvable
            </p>
            <Link
              href="/"
              className="inline-block bg-tortoise text-cream px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-dark transition-colors duration-300"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header forceDark />

      <main className="min-h-screen bg-cream flex items-center justify-center px-6 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-md mx-auto text-center"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 rounded-full border-2 border-gold flex items-center justify-center mb-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D3AC58"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl font-bold uppercase tracking-[0.25em] text-tortoise mb-4"
          >
            Commande confirmée
          </motion.h1>

          {/* Order number */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-tortoise/50 uppercase tracking-[0.15em] mb-2"
          >
            Numéro de commande
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-sm font-bold tracking-[0.2em] text-tortoise mb-10"
          >
            #{order.id.substring(0, 8).toUpperCase()}
          </motion.p>

          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-tortoise/70 tracking-[0.03em] mb-10"
          >
            Merci {order.customer_name}, votre commande a bien été enregistrée.
          </motion.p>

          {/* Items summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="border-t border-b border-tortoise/10 py-6 mb-6"
          >
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2"
              >
                <span className="text-sm text-tortoise/70 tracking-[0.03em] text-left">
                  {item.name} x{item.quantity}
                </span>
                <span className="text-sm text-tortoise tracking-[0.03em]">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Total */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-between items-center mb-12"
          >
            <span className="text-sm font-bold uppercase tracking-[0.15em] text-tortoise">
              Total
            </span>
            <span className="text-lg font-bold tracking-[0.05em] text-tortoise">
              {formatPrice(order.total)}
            </span>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Link
              href="/catalogue"
              className="inline-block w-full bg-tortoise text-cream py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-dark transition-colors duration-300"
            >
              Continuer les achats
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </>
  );
}
