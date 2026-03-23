"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/supabase/admin";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

type Tab = "connexion" | "inscription";

export default function ConnexionClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("connexion");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    if (isAdminEmail(data.user?.email ?? undefined)) {
      router.push("/admin");
    } else {
      router.push("/");
    }
    router.refresh();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError("Erreur lors de la création du compte. Veuillez réessayer.");
      return;
    }

    setSuccess("Compte créé avec succès. Vérifiez votre email pour confirmer votre inscription.");
  };

  const inputClass =
    "w-full bg-transparent border-b border-tortoise/30 py-3 text-tortoise placeholder:text-tortoise/40 outline-none focus:border-gold transition-colors duration-300 text-sm tracking-[0.05em]";

  const labelClass =
    "block text-[11px] font-bold uppercase tracking-[0.2em] text-tortoise/60 mb-2";

  return (
    <>
      <Header forceDark />

      <main className="min-h-screen bg-cream flex items-center justify-center px-6 pt-32 pb-20">
        <FadeIn direction="up">
          <div className="w-full max-w-md mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-12">
              <img
                src="/logos/logo-bloc.svg"
                alt="Maison trya."
                className="h-[80px]"
              />
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-10 mb-12">
              {(["connexion", "inscription"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setError("");
                    setSuccess("");
                  }}
                  className="relative pb-2 group"
                >
                  <span
                    className={`text-sm font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                      tab === t ? "text-tortoise" : "text-tortoise/40 hover:text-tortoise/60"
                    }`}
                  >
                    {t === "connexion" ? "Connexion" : "Inscription"}
                  </span>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold"
                    initial={false}
                    animate={{ scaleX: tab === t ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ originX: 0.5 }}
                  />
                </button>
              ))}
            </div>

            {/* Error / Success */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-center text-sm text-rubber mb-6 tracking-[0.03em]"
                >
                  {error}
                </motion.p>
              )}
              {success && (
                <motion.p
                  key="success"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-center text-sm text-gold-dark mb-6 tracking-[0.03em]"
                >
                  {success}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {tab === "connexion" ? (
                <motion.form
                  key="connexion"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  onSubmit={handleLogin}
                  className="space-y-8"
                >
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className={inputClass}
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Mot de passe</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className={inputClass}
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-tortoise text-cream py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {loading ? "Connexion..." : "Se connecter"}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="inscription"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  onSubmit={handleSignup}
                  className="space-y-8"
                >
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className={inputClass}
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Mot de passe</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className={inputClass}
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Confirmer le mot de passe</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className={inputClass}
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-tortoise text-cream py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {loading ? "Création..." : "Créer un compte"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>
      </main>

      <Footer />
    </>
  );
}
