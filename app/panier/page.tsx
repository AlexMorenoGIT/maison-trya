"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import ImagePlaceholder from "@/components/ImagePlaceholder";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export default function PanierPage() {
  const cart = useCart();
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_address: customerAddress,
          items: cart.items,
          total: cart.total,
          status: "confirmed",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      localStorage.setItem(
        "last-order",
        JSON.stringify({
          id: order.id,
          items: cart.items,
          total: cart.total,
          customer_name: customerName,
        })
      );

      cart.clearCart();
      router.push(`/commande/${order.id}`);
    } catch {
      setError("Erreur lors de la commande. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-transparent border-b border-tortoise/30 py-3 text-tortoise placeholder:text-tortoise/40 outline-none focus:border-gold transition-colors duration-300 text-sm tracking-[0.05em]";

  const labelClass =
    "block text-[11px] font-bold uppercase tracking-[0.2em] text-tortoise/60 mb-2";

  return (
    <>
      <Header forceDark />

      <main className="min-h-screen bg-cream pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn direction="up">
            <h1 className="text-center text-2xl md:text-3xl font-bold uppercase tracking-[0.25em] text-tortoise mb-12">
              Votre Panier
            </h1>
          </FadeIn>

          {cart.items.length === 0 ? (
            <FadeIn direction="up" delay={0.1}>
              <div className="text-center py-20">
                <p className="text-sm uppercase tracking-[0.15em] text-tortoise/60 mb-8">
                  Votre panier est vide
                </p>
                <Link
                  href="/catalogue"
                  className="inline-block bg-tortoise text-cream px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-dark transition-colors duration-300"
                >
                  Découvrir le catalogue
                </Link>
              </div>
            </FadeIn>
          ) : (
            <>
              {/* Cart items */}
              <AnimatePresence mode="wait">
                {!showCheckout ? (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-0">
                      {cart.items.map((item, index) => (
                        <FadeIn key={`${item.product_id}-${item.color}-${item.size}`} delay={index * 0.05}>
                          <div className="flex items-center gap-4 md:gap-6 py-6 border-b border-tortoise/10">
                            {/* Image */}
                            <div className="w-20 h-24 md:w-24 md:h-32 flex-shrink-0 overflow-hidden">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImagePlaceholder
                                  aspect="portrait"
                                  seed={item.name.charCodeAt(0)}
                                  className="!w-full !h-full"
                                />
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/produit/${item.slug || item.product_id}`}
                                className="text-sm font-bold uppercase tracking-[0.12em] text-tortoise hover:text-gold transition-colors duration-300 line-clamp-1"
                              >
                                {item.name}
                              </Link>
                              <p className="text-xs text-tortoise/50 uppercase tracking-[0.1em] mt-1">
                                {item.color} — {item.size}
                              </p>
                              <p className="text-sm text-tortoise mt-1 md:hidden">
                                {formatPrice(item.price)}
                              </p>

                              {/* Quantity controls (mobile: inline) */}
                              <div className="flex items-center gap-3 mt-3">
                                <button
                                  onClick={() =>
                                    cart.updateItemQuantity(
                                      item.product_id,
                                      item.color,
                                      item.size,
                                      item.quantity - 1
                                    )
                                  }
                                  className="w-7 h-7 flex items-center justify-center border border-tortoise/20 text-tortoise/60 hover:border-tortoise hover:text-tortoise transition-colors text-sm"
                                >
                                  &minus;
                                </button>
                                <span className="text-sm font-bold tracking-[0.1em] text-tortoise w-6 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    cart.updateItemQuantity(
                                      item.product_id,
                                      item.color,
                                      item.size,
                                      item.quantity + 1
                                    )
                                  }
                                  className="w-7 h-7 flex items-center justify-center border border-tortoise/20 text-tortoise/60 hover:border-tortoise hover:text-tortoise transition-colors text-sm"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Price & Remove (desktop) */}
                            <div className="hidden md:flex items-center gap-8">
                              <span className="text-sm tracking-[0.05em] text-tortoise w-24 text-right">
                                {formatPrice(item.price)}
                              </span>
                              <span className="text-sm font-bold tracking-[0.05em] text-tortoise w-24 text-right">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() =>
                                cart.removeItem(item.product_id, item.color, item.size)
                              }
                              aria-label="Retirer"
                              className="flex-shrink-0 text-tortoise/30 hover:text-rubber transition-colors duration-300"
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
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                        </FadeIn>
                      ))}
                    </div>

                    {/* Summary */}
                    <FadeIn direction="up" delay={0.2}>
                      <div className="mt-10 flex flex-col items-end">
                        <div className="w-full md:w-80">
                          <div className="flex justify-between items-center py-4 border-b border-tortoise/10">
                            <span className="text-sm uppercase tracking-[0.15em] text-tortoise/60">
                              Sous-total
                            </span>
                            <span className="text-lg font-bold tracking-[0.05em] text-tortoise">
                              {formatPrice(cart.total)}
                            </span>
                          </div>
                          <p className="text-xs text-tortoise/40 tracking-[0.05em] mt-3 mb-6">
                            Frais de livraison calculés à l&apos;étape suivante
                          </p>
                          <button
                            onClick={() => setShowCheckout(true)}
                            className="w-full bg-tortoise text-cream py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-dark transition-colors duration-300"
                          >
                            Passer commande
                          </button>
                        </div>
                      </div>
                    </FadeIn>
                  </motion.div>
                ) : (
                  /* Checkout form */
                  <motion.div
                    key="checkout"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="flex items-center gap-2 text-sm uppercase tracking-[0.12em] text-tortoise/50 hover:text-tortoise transition-colors duration-300 mb-8"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      Retour au panier
                    </button>

                    <div className="max-w-lg mx-auto">
                      <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-tortoise mb-10 text-center">
                        Finaliser la commande
                      </h2>

                      {/* Order summary */}
                      <div className="mb-10 pb-8 border-b border-tortoise/10">
                        {cart.items.map((item) => (
                          <div
                            key={`${item.product_id}-${item.color}-${item.size}`}
                            className="flex justify-between items-center py-2"
                          >
                            <span className="text-sm text-tortoise/70 tracking-[0.03em]">
                              {item.name} x{item.quantity}
                            </span>
                            <span className="text-sm text-tortoise tracking-[0.03em]">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-4 mt-4 border-t border-tortoise/10">
                          <span className="text-sm font-bold uppercase tracking-[0.15em] text-tortoise">
                            Total
                          </span>
                          <span className="text-lg font-bold tracking-[0.05em] text-tortoise">
                            {formatPrice(cart.total)}
                          </span>
                        </div>
                      </div>

                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center text-sm text-rubber mb-6 tracking-[0.03em]"
                        >
                          {error}
                        </motion.p>
                      )}

                      <form onSubmit={handleCheckout} className="space-y-8">
                        <div>
                          <label className={labelClass}>Nom complet</label>
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                            className={inputClass}
                            placeholder="Marie Dupont"
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Email</label>
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            required
                            className={inputClass}
                            placeholder="votre@email.com"
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Adresse</label>
                          <input
                            type="text"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            required
                            className={inputClass}
                            placeholder="12 Rue de la Paix, 75002 Paris"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-tortoise text-cream py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                          {loading ? "Traitement..." : "Confirmer la commande"}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
