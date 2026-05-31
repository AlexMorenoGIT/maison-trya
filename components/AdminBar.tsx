"use client";

import { useAdmin } from "@/lib/admin-context";

export default function AdminBar() {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-rubber text-cream text-xs px-4 py-1.5 flex items-center justify-between gap-4">
      <span className="font-bold uppercase tracking-[0.2em]">
        Mode admin
      </span>
      <div className="flex items-center gap-4">
        <a
          href="/admin"
          className="uppercase tracking-[0.15em] hover:text-gold transition-colors"
        >
          Tableau de bord
        </a>
        <a
          href="/logout"
          className="uppercase tracking-[0.15em] hover:text-gold transition-colors"
        >
          Déconnexion
        </a>
      </div>
    </div>
  );
}
