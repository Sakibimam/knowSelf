import type { TraitKey } from "@/lib/trait-order";

export type QuizScaleOption = {
  value: 1 | 2 | 3 | 4 | 5;
  label: string;
};

export type QuizItem = {
  id: string;
  trait: TraitKey;
  reverseKeyed: boolean;
  text: string;
};

export type QuizPack = {
  title: string;
  subtitle: string;
  scale: {
    min: number;
    max: number;
    options: QuizScaleOption[];
  };
  items: QuizItem[];
};

export type TraitLevelBand = "low" | "typical" | "high";

export type QuizResult = {
  trait: TraitKey;
  /** Mean keyed response on the Likert scale (after reverse scoring). */
  mean: number;
  /** 0–100 display index: linear map of `mean` across the scale range (not a population percentile). */
  percentIndex: number;
  level: TraitLevelBand;
};
