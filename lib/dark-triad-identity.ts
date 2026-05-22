import type { QuizResult } from "@/lib/quiz-types";
import type { DarkTraitKey } from "@/lib/dark-triad-order";

const LABELS: Record<
  DarkTraitKey,
  { low: string; typical: string; high: string }
> = {
  MAC: {
    low: "Lower Machiavellianism",
    typical: "Middle Machiavellianism",
    high: "Higher Machiavellianism",
  },
  PSY: {
    low: "Lower psychopathy traits",
    typical: "Middle psychopathy traits",
    high: "Higher psychopathy traits",
  },
  NAR: {
    low: "Lower narcissism",
    typical: "Middle narcissism",
    high: "Higher narcissism",
  },
};

function traitName(k: DarkTraitKey): string {
  switch (k) {
    case "MAC":
      return "Machiavellianism";
    case "PSY":
      return "psychopathy traits";
    case "NAR":
      return "narcissism";
    default:
      return k;
  }
}

function deviation(r: QuizResult): number {
  return Math.abs(r.percentIndex - 50);
}

export function darkTriadIdentityFromResults(results: QuizResult[]): {
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
      eyebrow: "No trait stood out strongly",
      label: "Balanced pattern",
      lines: [
        "Your answers did not lean hard toward any one Dark Triad trait.",
        "That can mean a more even pattern right now, or cautious answering.",
        "Read each trait below. Disagreeing with a line is useful data too.",
      ],
    };
  }

  const label = LABELS[top.trait as DarkTraitKey][top.level];
  const topName = traitName(top.trait as DarkTraitKey);
  const secondName = traitName(second.trait as DarkTraitKey);

  const line1 =
    top.level === "high"
      ? `Your strongest pattern was higher ${topName}: you agreed with many items in that area.`
      : top.level === "low"
        ? `Your strongest pattern was lower ${topName}: you disagreed with many items in that area.`
        : `Your strongest pattern was middle ${topName}: your answers were mixed in that area.`;

  const line2 =
    d2 >= 14
      ? `${secondName} was second. It still shapes how the full picture reads.`
      : "The other two traits still matter. This one was just the clearest here.";

  const line3 =
    "These scores describe tendencies, not who you are forever. Do not use them to judge yourself or others.";

  return {
    eyebrow: "Strongest pattern in this quiz",
    label,
    lines: [line1, line2, line3],
  };
}
