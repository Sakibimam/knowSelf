import { darkTriadIdentityFromResults } from "@/lib/dark-triad-identity";
import {
  DARK_TRAIT_KEYS,
  darkTraitShortLabel,
  darkTraitTint,
} from "@/lib/dark-triad-order";
import { identityFromResults } from "@/lib/identity-archetype";
import type { QuizResult } from "@/lib/quiz-types";
import { TRAIT_KEYS, traitTint } from "@/lib/trait-order";

export type QuizVariant = "big-five" | "dark-triad";

export type QuizIdentity = {
  eyebrow: string;
  label: string;
  lines: string[];
};

export type QuizAssessmentConfig = {
  storageKey: string;
  traitKeys: readonly string[];
  traitTint: Record<string, string>;
  traitAxisLabels?: Record<string, string>;
  getIdentity: (results: QuizResult[]) => QuizIdentity;
  introExtra?: string;
  introConsentLabel?: string;
  groundRules?: string[];
  spectrumTitle: string;
  spectrumHint: string;
  shapeTitle: string;
  shapeHint: string;
  detailsTitle: string;
  detailsHint: string;
  radarNote: string;
};

export const BIG_FIVE_QUIZ_CONFIG: QuizAssessmentConfig = {
  storageKey: "trait-quiz-answers-v1",
  traitKeys: TRAIT_KEYS,
  traitTint,
  getIdentity: identityFromResults,
  groundRules: [
    "Think about the last few weeks, not your ideal self.",
    "If every answer sounds flattering, slow down and be more honest.",
    "A low score is not an insult. It just means a different pattern.",
  ],
  spectrumTitle: "Your five trait scores",
  spectrumHint:
    "Each bar uses the same scale so you can compare traits. This is not a ranking against other people.",
  shapeTitle: "Your shape at a glance",
  shapeHint:
    "This is the same data as the bars, shown as one profile so your overall pattern is easier to see.",
  detailsTitle: "Read more about each trait",
  detailsHint:
    "Open a trait to see a longer summary, strengths, and possible downsides.",
  radarNote:
    "O, C, E, A, N axes. A larger shape means a stronger score on that trait, not a better person.",
};

export const DARK_TRIAD_QUIZ_CONFIG: QuizAssessmentConfig = {
  storageKey: "trait-dark-triad-answers-v1",
  traitKeys: DARK_TRAIT_KEYS,
  traitTint: darkTraitTint,
  traitAxisLabels: darkTraitShortLabel,
  getIdentity: darkTriadIdentityFromResults,
  introExtra:
    "These questions touch manipulation, empathy, and status-seeking. Answer honestly. Do not use results to label or harm anyone.",
  introConsentLabel:
    "I understand this is informational only, not a diagnosis, and I will not use it for hiring or screening.",
  groundRules: [
    "Answer for how you usually act, not how you want to sound.",
    "High scores are tendencies, not proof you are a bad person.",
    "Low scores do not mean you are always kind or honest in every situation.",
  ],
  spectrumTitle: "Your three trait scores",
  spectrumHint:
    "Each bar uses the same 1–5 scale. This is not compared to other people.",
  shapeTitle: "Your profile at a glance",
  shapeHint: "Same data as the bars, shown as a simple three-point profile.",
  detailsTitle: "Read more about each trait",
  detailsHint:
    "Open a trait for a longer summary. Skip anything that does not fit you.",
  radarNote:
    "Mach, Psych, Narc axes. Larger area means stronger agreement on that trait in this quiz.",
};
