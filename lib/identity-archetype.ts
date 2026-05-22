import type { QuizResult } from "@/lib/quiz-types";
import type { TraitKey } from "@/lib/trait-order";

const LABELS: Record<
  TraitKey,
  { low: string; typical: string; high: string }
> = {
  O: {
    low: "Lower openness",
    typical: "Middle openness",
    high: "Higher openness",
  },
  C: {
    low: "Lower conscientiousness",
    typical: "Middle conscientiousness",
    high: "Higher conscientiousness",
  },
  E: {
    low: "Lower extraversion",
    typical: "Middle extraversion",
    high: "Higher extraversion",
  },
  A: {
    low: "Lower agreeableness",
    typical: "Middle agreeableness",
    high: "Higher agreeableness",
  },
  N: {
    low: "Lower neuroticism",
    typical: "Middle neuroticism",
    high: "Higher neuroticism",
  },
};

function deviation(r: QuizResult): number {
  return Math.abs(r.percentIndex - 50);
}

function traitName(k: TraitKey): string {
  switch (k) {
    case "O":
      return "Openness";
    case "C":
      return "Conscientiousness";
    case "E":
      return "Extraversion";
    case "A":
      return "Agreeableness";
    case "N":
      return "Neuroticism";
    default:
      return k;
  }
}

function howYouShowed(top: QuizResult): string {
  if (top.level === "high") {
    return "you agreed strongly with many items in this area";
  }
  if (top.level === "low") {
    return "you disagreed more often with items in this area";
  }
  return "your answers were mixed in this area";
}

export function identityFromResults(results: QuizResult[]): {
  eyebrow: string;
  label: string;
  lines: string[];
} {
  const sorted = [...results].sort((a, b) => deviation(b) - deviation(a));
  const top = sorted[0]!;
  const second = sorted[1]!;
  const d1 = deviation(top);
  const d2 = deviation(second);

  if (d1 < 11 && d2 < 11) {
    return {
      eyebrow: "No single trait stood out",
      label: "Balanced pattern",
      lines: [
        "Your answers did not lean hard toward any one trait.",
        "That can mean you are fairly balanced right now, or that your answers were cautious.",
        "Use the bars below. Notice what feels true and what you disagree with.",
      ],
    };
  }

  const label = LABELS[top.trait as TraitKey][top.level];
  const topName = traitName(top.trait as TraitKey);
  const secondName = traitName(second.trait as TraitKey);
  const body = howYouShowed(top);

  const line1 = `Your strongest pattern here was ${topName}: ${body}.`;
  const line2 =
    d2 >= 14
      ? `${secondName} was second. It still affects how the full picture reads.`
      : "Your other traits still matter. This one was just the clearest in this quiz.";

  const line3 =
    "If a line feels very accurate, think about what it points to in your daily life. If it feels wrong, trust that too. One quiz does not define you.";

  return {
    eyebrow: "Your main pattern",
    label,
    lines: [line1, line2, line3],
  };
}
