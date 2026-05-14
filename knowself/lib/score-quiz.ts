import { TRAIT_KEYS, type TraitKey } from "@/lib/trait-order";
import type { QuizItem, QuizResult, TraitLevelBand } from "@/lib/quiz-types";

/** Editorial cutoffs on the keyed 1–5 mean for routing narrative bands. */
export const QUIZ_BAND_CUTOFFS = {
  /** Means strictly below this use the "low" copy bucket. */
  lowBelow: 2.5,
  /** Means strictly above this use the "high" copy bucket. */
  highAbove: 3.5,
} as const;

/** Normalize a stored or UI value to a Likert score, or `undefined` if invalid. */
export function coerceScaleAnswer(
  raw: unknown,
  min: number,
  max: number,
): number | undefined {
  const n =
    typeof raw === "string"
      ? Number(raw)
      : typeof raw === "number"
        ? raw
        : NaN;
  if (!Number.isFinite(n)) return undefined;
  const v = Math.round(n);
  if (v < min || v > max) return undefined;
  return v;
}

/** True when every pack item has a valid numeric answer on the scale (by item id, not key count). */
export function isQuizComplete(
  items: QuizItem[],
  answers: Record<string, unknown>,
  scaleMin: number,
  scaleMax: number,
): boolean {
  for (const item of items) {
    if (coerceScaleAnswer(answers[item.id], scaleMin, scaleMax) === undefined) {
      return false;
    }
  }
  return true;
}

/** Keep only valid item → score pairs for the active pack (drops stray keys). */
export function sanitizeQuizAnswers(
  items: QuizItem[],
  raw: Record<string, unknown> | null | undefined,
  scaleMin: number,
  scaleMax: number,
): Record<string, number> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, number> = {};
  for (const item of items) {
    const v = coerceScaleAnswer(raw[item.id], scaleMin, scaleMax);
    if (v !== undefined) out[item.id] = v;
  }
  return out;
}

function keyedScore(
  value: number,
  reverseKeyed: boolean,
  min: number,
  max: number,
): number {
  if (reverseKeyed) return min + max - value;
  return value;
}

export function meanTraitScores(
  items: QuizItem[],
  answers: Record<string, unknown>,
  min: number,
  max: number,
): Record<TraitKey, number> {
  const sums: Record<TraitKey, number> = {
    O: 0,
    C: 0,
    E: 0,
    A: 0,
    N: 0,
  };
  const counts: Record<TraitKey, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 };

  for (const item of items) {
    const raw = coerceScaleAnswer(answers[item.id], min, max);
    if (raw === undefined) continue;
    const s = keyedScore(raw, item.reverseKeyed, min, max);
    sums[item.trait] += s;
    counts[item.trait] += 1;
  }

  const out = {} as Record<TraitKey, number>;
  for (const k of TRAIT_KEYS) {
    out[k] = counts[k] ? sums[k] / counts[k] : min;
  }
  return out;
}

export function levelFromMean(mean: number): TraitLevelBand {
  if (mean < QUIZ_BAND_CUTOFFS.lowBelow) return "low";
  if (mean > QUIZ_BAND_CUTOFFS.highAbove) return "high";
  return "typical";
}

/** Maps a scale mean to 0–100 for UI only (endpoints = min/max). Not a normed percentile. */
export function meanToPercentIndex(
  mean: number,
  min: number,
  max: number,
): number {
  if (max <= min) return 0;
  const t = (mean - min) / (max - min);
  return Math.round(Math.min(100, Math.max(0, t * 100)));
}

export function buildQuizResults(
  items: QuizItem[],
  answers: Record<string, unknown>,
  min: number,
  max: number,
): QuizResult[] {
  const means = meanTraitScores(items, answers, min, max);
  return TRAIT_KEYS.map((trait) => {
    const mean = Math.round(means[trait] * 100) / 100;
    return {
      trait,
      mean,
      percentIndex: meanToPercentIndex(means[trait], min, max),
      level: levelFromMean(means[trait]),
    };
  });
}
