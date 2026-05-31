export const COLLECTIONS = [
  { value: "vulnerabilite", label: "Vulnérabilité" },
  { value: "eveil", label: "Éveil" },
  { value: "ferocite", label: "Férocité" },
] as const;

export const CATEGORIES = {
  "pret-a-porter": {
    label: "Prêt à porter",
    subcategories: [
      { value: "robes", label: "Robes" },
      { value: "vestes", label: "Vestes" },
      { value: "tops", label: "Top" },
      { value: "jupes-shorts", label: "Jupes & Shorts" },
      { value: "pantalons", label: "Pantalons" },
    ],
  },
  lingerie: {
    label: "Lingerie",
    subcategories: [
      { value: "hauts", label: "Hauts" },
      { value: "bas", label: "Bas" },
      { value: "jartieres", label: "Jartières" },
    ],
  },
  accessoires: {
    label: "Accessoires",
    subcategories: [
      { value: "sacs", label: "Sacs" },
      { value: "ceintures", label: "Ceinture" },
      { value: "bijoux", label: "Bijoux" },
      { value: "autres", label: "Autres" },
    ],
  },
} as const;

export type CollectionValue = (typeof COLLECTIONS)[number]["value"];
export type CategoryValue = keyof typeof CATEGORIES;

// Spotify playlist IDs per collection (used for QR codes on product pages)
export const SPOTIFY_PLAYLISTS: Record<CollectionValue, string> = {
  vulnerabilite: "4XrDDtfVVVPz5oWFyfW9z0",
  eveil: "13f5PQd9sgBqDtJ3SxkJ6h",
  ferocite: "",
};

// WhatsApp concierge number (international format, no +, e.g. "33612345678")
// Leave empty to hide WhatsApp links across the site.
export const WHATSAPP_NUMBER = "";

export function whatsappLink(message?: string): string | null {
  if (!WHATSAPP_NUMBER) return null;
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Size guide (FR), measurements in cm
export const SIZE_GUIDE: { size: string; bust: string; waist: string; hips: string }[] = [
  { size: "34", bust: "80",  waist: "62",  hips: "86" },
  { size: "36", bust: "84",  waist: "66",  hips: "90" },
  { size: "38", bust: "88",  waist: "70",  hips: "94" },
  { size: "40", bust: "92",  waist: "74",  hips: "98" },
  { size: "42", bust: "96",  waist: "78",  hips: "102" },
];
