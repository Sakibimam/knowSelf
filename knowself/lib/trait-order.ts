/** OCEAN display order */
export const TRAIT_KEYS = ["O", "C", "E", "A", "N"] as const;

export type TraitKey = (typeof TRAIT_KEYS)[number];

/** Tints that read softly on light and dark backgrounds */
export const traitTint: Record<TraitKey, string> = {
  O: "color-mix(in oklab, #6b4d9a 20%, transparent)",
  C: "color-mix(in oklab, #2563eb 18%, transparent)",
  E: "color-mix(in oklab, #b45309 18%, transparent)",
  A: "color-mix(in oklab, #be185d 16%, transparent)",
  N: "color-mix(in oklab, #475569 20%, transparent)",
};
