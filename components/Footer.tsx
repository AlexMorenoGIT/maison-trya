"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-tortoise text-cream">
      {/* Top: Logo */}
      <div className="flex justify-center pt-16 pb-12">
        <img
          src="/logos/logo-bloc-cream.svg"
          alt="Maison trya."
          className="h-[80px]"
        />
      </div>

      {/* Middle: 3 columns */}
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">
        {/* Col 1: Brand */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] mb-4">
            Maison trya.
          </h3>
          <p className="text-sm leading-relaxed opacity-80">
            Entre férocité et vulnérabilité. Une maison de mode qui célèbre
            l&apos;audace féminine à travers des pièces intemporelles, confectionnées
            avec un savoir-faire d&apos;exception.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] mb-4">
            Navigation
          </h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/"
                className="text-sm uppercase tracking-[0.1em] hover:underline underline-offset-4 transition-all"
              >
                Collections
              </Link>
            </li>
            <li>
              <Link
                href="/a-propos"
                className="text-sm uppercase tracking-[0.1em] hover:underline underline-offset-4 transition-all"
              >
                L&apos;Univers
              </Link>
            </li>
            <li>
              <Link
                href="/a-propos"
                className="text-sm uppercase tracking-[0.1em] hover:underline underline-offset-4 transition-all"
              >
                À Propos
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Newsletter */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] mb-4">
            Newsletter
          </h3>
          <p className="text-sm mb-4 opacity-80">
            Inscrivez-vous pour recevoir nos dernières nouvelles.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-3"
          >
            <input
              type="email"
              placeholder="Votre email"
              className="bg-transparent border border-cream px-4 py-2 text-sm text-cream placeholder:text-cream/50 outline-none focus:border-gold transition-colors"
            />
            <button
              type="submit"
              className="bg-cream text-tortoise px-4 py-2 text-sm font-bold uppercase tracking-[0.15em] hover:bg-cream/90 transition-colors"
            >
              S&apos;inscrire
            </button>
          </form>
        </div>
      </div>

      {/* Bottom: Copyright */}
      <div className="border-t border-cream/20 mx-6">
        <p className="text-center text-xs uppercase tracking-[0.1em] py-6 opacity-60">
          &copy; 2026 Maison trya. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
