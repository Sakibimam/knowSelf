import type { QuizResult } from "@/lib/quiz-types";
import type { TraitKey } from "@/lib/trait-order";

const LABELS: Record<
  TraitKey,
  { low: string; typical: string; high: string }
> = {
  O: {
    low: "The Grounded Eye",
    typical: "The Curious Middle",
    high: "The Wide Lens",
  },
  C: {
    low: "The Improviser",
    typical: "The Flexible Hand",
    high: "The Finish Line",
  },
  E: {
    low: "The Inward Current",
    typical: "The Situational Flame",
    high: "The Outward Spark",
  },
  A: {
    low: "The Clear Edge",
    typical: "The Negotiated Heart",
    high: "The Soft Landing",
  },
  N: {
    low: "The Steady Voltage",
    typical: "The Moving Weather",
    high: "The High-Alert Mind",
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

/** Second-person read on how the strongest trait showed up in the clicks. */
function howYouShowed(top: QuizResult): string {
  if (top.level === "high") {
    return "you kept lending that cluster real heat — the same kind of item kept getting a strong yes";
  }
  if (top.level === "low") {
    return "you kept sliding past that cluster — not allergic to it, just not where you wanted to camp";
  }
  return "you lived in the gray there — enough shape to notice, not enough to turn it into a caricature";
}

/**
 * Editorial mirror: small label + lines that sound like recognition, not a report.
 */
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
      eyebrow: "Nothing leaned hard — that's information too",
      label: "The Quiet Blend",
      lines: [
        "Your answers didn't pick a fight with any one trait; the graph stayed polite.",
        "That can mean you're genuinely even-keel this month, or that you're still deciding how honest you want to be, or that life is just… middle-volume right now.",
        "Use the bars below like a reflection: notice what you nod at, and what you want to argue with — the argument is often the useful part.",
      ],
    };
  }

  const label = LABELS[top.trait][top.level];
  const topName = traitName(top.trait);
  const secondName = traitName(second.trait);
  const body = howYouShowed(top);

  const line1 = `${topName} is where your pattern kept returning on this pass: ${body}.`;
  const line2 =
    d2 >= 14
      ? `${secondName} is doing quieter work behind it — not the loudest line, but it's tinting how the rest reads for you.`
      : "The other traits still shape the full picture; this one just had the clearest voice in this particular pass.";

  const line3 =
    "When a line feels too accurate, slow down and ask what it's pointing at. When it misses, that mismatch is yours to trust — no score owns you.";

  return {
    eyebrow: "What your answers kept insisting on",
    label,
    lines: [line1, line2, line3],
  };
}
