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
