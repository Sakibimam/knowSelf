/** Dirty Dozen display order: Machiavellianism, Psychopathy, Narcissism */
export const DARK_TRAIT_KEYS = ["MAC", "PSY", "NAR"] as const;

export type DarkTraitKey = (typeof DARK_TRAIT_KEYS)[number];

export const darkTraitTint: Record<DarkTraitKey, string> = {
  MAC: "color-mix(in oklab, #7c3aed 18%, transparent)",
  PSY: "color-mix(in oklab, #991b1b 16%, transparent)",
  NAR: "color-mix(in oklab, #c2410c 18%, transparent)",
};

export const darkTraitShortLabel: Record<DarkTraitKey, string> = {
  MAC: "Mach",
  PSY: "Psych",
  NAR: "Narc",
};
