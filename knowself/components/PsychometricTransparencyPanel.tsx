import { QUIZ_BAND_CUTOFFS } from "@/lib/score-quiz";

type Props = {
  scaleMin: number;
  scaleMax: number;
  itemsPerTrait: number;
};

export function PsychometricTransparencyPanel({
  scaleMin,
  scaleMax,
  itemsPerTrait,
}: Props) {
  const range = scaleMax - scaleMin;
  const { lowBelow, highAbove } = QUIZ_BAND_CUTOFFS;

  return (
    <section
      className="rounded-2xl bg-elevated/50 p-5 shadow-[var(--shadow-sm)] sm:rounded-3xl sm:p-6"
      aria-labelledby="psychometric-transparency-heading"
    >
      <h2
        id="psychometric-transparency-heading"
        className="font-display text-base font-medium tracking-tight text-foreground sm:text-lg"
      >
        How this was built
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Five traits, five questions each, answered in your browser. No scores are
        sent to us in this version.
      </p>

      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
        <li className="flex gap-2">
          <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
          <span>
            Reverse-worded items are flipped on the {scaleMin}–{scaleMax} scale,
            then averaged per trait.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
          <span>
            The percent bar is a straight line from low to high on that scale —{" "}
            <em className="text-foreground not-italic">not</em> “compared with
            everyone else.”
          </span>
        </li>
        <li className="flex gap-2">
          <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
          <span>
            Copy buckets use simple cutoffs: mean &lt; {lowBelow}, between{" "}
            {lowBelow}–{highAbove}, or &gt; {highAbove}. Editorial, not clinical.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
          <span>
            Short quizzes wobble with mood and sleep. Weirdly perfect profiles
            deserve side-eye.
          </span>
        </li>
      </ul>

      <details className="group mt-5 rounded-2xl bg-background/50 p-4 sm:p-5">
        <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="underline decoration-border underline-offset-2 group-open:no-underline">
            Technical notes
          </span>
          <span className="ml-2 font-normal text-subtle">formulas</span>
        </summary>
        <div className="mt-3 space-y-2 border-t border-border/80 pt-3 text-xs leading-relaxed text-subtle">
          <p>
            Keyed value{" "}
            <code className="rounded bg-elevated px-1 font-mono text-foreground">
              k = reverse ? ({scaleMin} + {scaleMax} − r) : r
            </code>
            ; domain mean μ from {itemsPerTrait} items; display{" "}
            <code className="rounded bg-elevated px-1 font-mono text-foreground">
              round(100·(μ−{scaleMin})/{range})
            </code>{" "}
            clamped 0–100.
          </p>
        </div>
      </details>
    </section>
  );
}
