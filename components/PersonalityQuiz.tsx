"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PsychometricTransparencyPanel } from "@/components/PsychometricTransparencyPanel";
import type { InterpretationsData, TraitBand } from "@/lib/interpretations";
import { identityFromResults } from "@/lib/identity-archetype";
import type { QuizPack, QuizResult } from "@/lib/quiz-types";
import {
  buildQuizResults,
  firstUnansweredIndex,
  isQuizComplete,
  sanitizeQuizAnswers,
} from "@/lib/score-quiz";
import { TRAIT_KEYS, traitTint, type TraitKey } from "@/lib/trait-order";

const easeOut = [0.22, 1, 0.36, 1] as const;
const STORAGE_KEY = "trait-quiz-answers-v1";

type Phase = "intro" | "quiz" | "results";

type Props = {
  pack: QuizPack;
  interpretations: InterpretationsData;
};

function progressPhrase(index: number, total: number): string {
  const i = index + 1;
  const t = total;
  if (i <= 2) return "Just getting started.";
  if (i / t < 0.35) return "Keep going.";
  if (i / t < 0.52) return "About halfway.";
  if (i / t < 0.78) return "More than halfway.";
  if (i < t) return "Almost done.";
  return "";
}

function levelWord(level: QuizResult["level"]): string {
  if (level === "low") return "Lower on this trait";
  if (level === "high") return "Higher on this trait";
  return "Middle on this trait";
}

function levelAdverb(level: QuizResult["level"]): string {
  if (level === "high") return "strongly";
  if (level === "low") return "lightly";
  return "moderately";
}

export function PersonalityQuiz({ pack, interpretations }: Props) {
  const reduce = !!useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(index);
  indexRef.current = index;

  const total = pack.items.length;
  const itemsPerTrait = TRAIT_KEYS.length
    ? Math.round(total / TRAIT_KEYS.length)
    : 5;
  const item = pack.items[index];
  const answeredHere = item
    ? answers[item.id] !== undefined &&
      typeof answers[item.id] === "number" &&
      Number.isFinite(answers[item.id]!)
    : false;

  const scaleMin = pack.scale.min;
  const scaleMax = pack.scale.max;

  const quizComplete = useMemo(
    () =>
      isQuizComplete(
        pack.items,
        answers as Record<string, unknown>,
        scaleMin,
        scaleMax,
      ),
    [answers, pack.items, scaleMin, scaleMax],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        answers?: Record<string, unknown>;
        index?: number;
      };
      const ans = parsed.answers;
      if (!ans || typeof ans !== "object") return;

      const cleaned = sanitizeQuizAnswers(
        pack.items,
        ans,
        scaleMin,
        scaleMax,
      );
      if (Object.keys(cleaned).length === 0) return;

      setAnswers(cleaned);
      const i = typeof parsed.index === "number" ? parsed.index : 0;
      setIndex(Math.min(Math.max(i, 0), total - 1));

      if (isQuizComplete(pack.items, cleaned, scaleMin, scaleMax)) {
        setPhase("results");
        sessionStorage.removeItem(STORAGE_KEY);
      } else {
        setPhase("quiz");
      }
    } catch {
      /* ignore */
    }
  }, [pack.items, scaleMin, scaleMax, total]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (phase !== "quiz") return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, index }),
      );
    } catch {
      /* ignore */
    }
  }, [answers, index, phase]);

  useEffect(() => {
    if (phase !== "quiz") return;
    if (!quizComplete) return;
    setPhase("results");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [phase, quizComplete]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const pickAnswer = useCallback(
    (value: number) => {
      if (!item) return;
      const id = item.id;
      const cur = indexRef.current;
      const isLast = cur >= total - 1;

      setAnswers((prev) => {
        const next = { ...prev, [id]: value };
        if (
          isLast &&
          isQuizComplete(pack.items, next, scaleMin, scaleMax)
        ) {
          setPhase("results");
          try {
            sessionStorage.removeItem(STORAGE_KEY);
          } catch {
            /* ignore */
          }
        }
        return next;
      });
      if (advanceTimer.current) clearTimeout(advanceTimer.current);

      if (isLast) {
        return;
      }

      advanceTimer.current = setTimeout(() => {
        setIndex((i) => Math.min(i + 1, total - 1));
      }, reduce ? 0 : 340);
    },
    [item, pack.items, reduce, scaleMin, scaleMax, total],
  );

  const restart = useCallback(() => {
    setAnswers({});
    setIndex(0);
    setPhase("intro");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const goToResults = useCallback(() => {
    if (
      !isQuizComplete(
        pack.items,
        answers as Record<string, unknown>,
        scaleMin,
        scaleMax,
      )
    ) {
      const missing = firstUnansweredIndex(
        pack.items,
        answers as Record<string, unknown>,
        scaleMin,
        scaleMax,
      );
      if (missing >= 0) setIndex(missing);
      return;
    }
    setPhase("results");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [answers, pack.items, scaleMin, scaleMax]);

  const results = useMemo(() => {
    if (!quizComplete) return null;
    return buildQuizResults(pack.items, answers, scaleMin, scaleMax);
  }, [quizComplete, pack.items, answers, scaleMin, scaleMax]);

  const identity = useMemo(
    () => (results ? identityFromResults(results) : null),
    [results],
  );
  const rankedResults = useMemo(
    () =>
      results
        ? [...results].sort(
            (a, b) => Math.abs(b.percentIndex - 50) - Math.abs(a.percentIndex - 50),
          )
        : [],
    [results],
  );

  const shellWide = phase === "results";
  const mainMax = shellWide ? "max-w-2xl lg:max-w-3xl" : "max-w-lg";

  return (
    <div className="relative min-h-full overflow-x-hidden text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 sm:px-6">
        <div
          className={`mx-auto flex items-center justify-between gap-3 ${mainMax}`}
        >
          <Link
            href="/"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
          >
            ← Home
          </Link>
          {phase === "quiz" && (
            <p className="text-right text-xs text-subtle tabular-nums">
              {index + 1} / {total}
            </p>
          )}
          {phase === "results" && (
            <span className="text-xs text-subtle">Your results</span>
          )}
        </div>
        {phase === "quiz" && (
          <>
            <p
              className={`mx-auto mt-2 text-center text-sm text-muted ${mainMax}`}
            >
              {progressPhrase(index, total)}
            </p>
            <div
              className={`mx-auto mt-3 h-1 overflow-hidden rounded-full bg-border/90 ${mainMax}`}
              role="progressbar"
              aria-valuenow={index + 1}
              aria-valuemin={1}
              aria-valuemax={total}
              aria-label="Quiz progress"
            >
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={false}
                animate={{ width: `${((index + 1) / total) * 100}%` }}
                transition={{ duration: reduce ? 0 : 0.38, ease: easeOut }}
              />
            </div>
          </>
        )}
      </header>

      <main
        className={`mx-auto px-4 pb-28 pt-10 sm:px-6 sm:pt-12 ${mainMax} ${phase === "quiz" ? "flex min-h-[calc(100dvh-8rem)] flex-col" : ""}`}
      >
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: easeOut }}
              className="text-center"
            >
              <p className="text-xs font-medium tracking-wide text-subtle">
                ~3 minutes · private to this tab
              </p>
              <h1 className="font-display mx-auto mt-4 max-w-md text-2xl font-medium leading-snug tracking-tight text-balance sm:text-3xl">
                {pack.title}
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                {pack.subtitle}
              </p>
              <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-muted">
                Answer honestly. This quiz only knows what you click today. It
                does not know your full life story.
              </p>

              <details className="mx-auto mt-8 max-w-md rounded-2xl bg-elevated/50 p-4 text-left shadow-[var(--shadow-sm)] sm:p-5">
                <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                  Tips before you start
                </summary>
                <ul className="mt-3 space-y-2 border-t border-border/80 pt-3 text-sm leading-snug text-muted">
                  <li>Think about the last few weeks, not your ideal self.</li>
                  <li>If every answer sounds flattering, slow down and be more honest.</li>
                  <li>A low score is not an insult. It just means a different pattern.</li>
                </ul>
              </details>

              <button
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.removeItem(STORAGE_KEY);
                  } catch {
                    /* ignore */
                  }
                  setAnswers({});
                  setIndex(0);
                  setPhase("quiz");
                }}
                className="mt-10 inline-flex min-h-12 w-full max-w-xs items-center justify-center rounded-2xl bg-accent px-6 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition-[transform,opacity,box-shadow] hover:shadow-[var(--shadow-md)] active:scale-[0.99] dark:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
              >
                Start quiz
              </button>
            </motion.div>
          )}

          {phase === "quiz" && item && (
            <motion.div
              key={item.id}
              initial={reduce ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -16 }}
              transition={{ duration: 0.32, ease: easeOut }}
              className="flex flex-1 flex-col justify-center"
            >
              <fieldset className="border-0 p-0">
                <legend className="font-display mx-auto block max-w-[26rem] text-center text-xl font-medium leading-snug text-balance sm:text-2xl">
                  {item.text}
                </legend>
                <p className="mx-auto mt-4 max-w-sm text-center text-xs leading-relaxed text-subtle sm:text-sm">
                  Pick the first answer that fits your usual week.
                </p>
                <div
                  className="mx-auto mt-10 flex w-full max-w-md flex-col gap-2.5"
                  role="group"
                  aria-label="Your answer"
                >
                  {pack.scale.options.map((opt) => {
                    const selected = answers[item.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => pickAnswer(opt.value)}
                        aria-pressed={selected}
                        className={`flex min-h-[3.25rem] w-full items-center justify-center rounded-2xl px-4 text-sm font-medium transition-[transform,box-shadow,background-color,border-color,color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)] active:scale-[0.99] ${
                          selected
                            ? "bg-accent-soft text-foreground shadow-[var(--shadow-sm)] ring-2 ring-accent/35 ring-offset-2 ring-offset-background"
                            : "bg-elevated/70 text-muted shadow-[var(--shadow-sm)] hover:text-foreground hover:shadow-[var(--shadow-md)] dark:bg-elevated/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mx-auto mt-12 flex w-full max-w-md items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={index === 0}
                  className="min-h-11 rounded-2xl px-4 text-sm font-medium text-muted transition-colors hover:bg-elevated/80 hover:text-foreground disabled:pointer-events-none disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
                >
                  Back
                </button>
                {answeredHere && index === total - 1 ? (
                  <button
                    type="button"
                    onClick={goToResults}
                    className="min-h-11 rounded-2xl bg-accent px-5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition-[transform,box-shadow] hover:shadow-[var(--shadow-md)] active:scale-[0.99] dark:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
                  >
                    {quizComplete ? "See results" : "Go to missing answers"}
                  </button>
                ) : (
                  <span className="text-xs text-subtle">Pick one to continue</span>
                )}
              </div>
            </motion.div>
          )}

          {phase === "results" && !results && (
            <motion.div
              key="results-incomplete"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-md text-center"
            >
              <p className="font-display text-lg font-medium text-foreground">
                Results are not ready
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                You need an answer on every question. This can happen after a
                refresh or if saved data was incomplete.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPhase("quiz");
                  setIndex(Math.max(0, total - 1));
                }}
                className="mt-8 min-h-12 w-full rounded-2xl bg-accent px-6 text-sm font-semibold text-white shadow-[var(--shadow-sm)] dark:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
              >
                Back to last question
              </button>
            </motion.div>
          )}

          {phase === "results" && results && identity && (
            <motion.div
              key="results"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: easeOut }}
              className="text-center sm:text-left"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-subtle">
                {identity.eyebrow}
              </p>
              <h1 className="font-display mt-2 text-2xl font-medium tracking-tight text-balance sm:text-3xl">
                {identity.label}
              </h1>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-snug text-subtle sm:mx-0">
                A short label from this quiz. It is not a diagnosis.
              </p>
              <div className="mx-auto mt-5 max-w-2xl space-y-3.5 text-sm leading-relaxed text-muted sm:mx-0 sm:text-base">
                {identity.lines.map((line, i) => (
                  <p key={i} className="text-pretty">
                    {line}
                  </p>
                ))}
              </div>

              <section
                className="mt-10 rounded-2xl bg-elevated/50 p-5 text-left shadow-[var(--shadow-sm)] sm:rounded-3xl sm:p-6"
                aria-labelledby="results-spectrum-heading"
              >
                <h2
                  id="results-spectrum-heading"
                  className="font-display text-base font-medium text-foreground sm:text-lg"
                >
                  Your five trait scores
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-subtle sm:text-sm sm:text-muted">
                  Each bar uses the same scale so you can compare traits. This is
                  not a ranking against other people.
                </p>
                <ul className="mt-5 flex flex-col gap-5">
                  {results.map((r) => (
                    <li key={r.trait} className="list-none">
                      <SnapshotRow
                        name={interpretations.traits[r.trait].name}
                        traitKey={r.trait}
                        percent={r.percentIndex}
                        level={r.level}
                        reduce={reduce}
                      />
                    </li>
                  ))}
                </ul>
              </section>

              <section
                className="mt-8 rounded-2xl bg-elevated/45 p-5 text-left shadow-[var(--shadow-sm)] sm:rounded-3xl sm:p-6"
                aria-labelledby="results-shape-heading"
              >
                <h2
                  id="results-shape-heading"
                  className="font-display text-base font-medium text-foreground sm:text-lg"
                >
                  Your shape at a glance
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-subtle sm:text-sm sm:text-muted">
                  This is the same data as the bars, shown as one profile so your overall
                  pattern is easier to see.
                </p>
                <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
                  <TraitRadar
                    results={results}
                    names={interpretations.traits as Record<string, { name: string }>}
                  />
                  <ol className="space-y-3">
                    {rankedResults.slice(0, 3).map((r, idx) => (
                      <li key={r.trait} className="list-none rounded-2xl bg-background/45 p-3.5">
                        <p className="text-xs text-subtle">Rank {idx + 1}</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {interpretations.traits[r.trait].name}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          You answered {levelAdverb(r.level)} toward this trait in this pass
                          ({r.percentIndex}%).
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              <h2 className="font-display mt-12 text-lg font-medium text-foreground sm:text-xl">
                Read more about each trait
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-center text-sm leading-relaxed text-muted sm:mx-0 sm:text-left">
                Open a trait to see a longer summary, strengths, and possible
                downsides.
              </p>
              <ul className="mt-6 flex flex-col gap-3 text-left sm:gap-4">
                {results.map((r) => (
                  <TraitResultFold
                    key={r.trait}
                    traitName={interpretations.traits[r.trait].name}
                    traitKey={r.trait}
                    band={interpretations.traits[r.trait][r.level]}
                    percentIndex={r.percentIndex}
                    levelLabel={levelWord(r.level)}
                    reduce={reduce}
                  />
                ))}
              </ul>

              <div className="mt-10">
                <p className="mb-3 text-center text-xs leading-relaxed text-subtle sm:text-left">
                  Optional: how the scores are calculated.
                </p>
                <PsychometricTransparencyPanel
                  scaleMin={pack.scale.min}
                  scaleMax={pack.scale.max}
                  itemsPerTrait={itemsPerTrait}
                />
              </div>

              <div className="mt-8 rounded-2xl bg-background/35 px-4 py-3 sm:px-5">
                <p className="text-center text-xs leading-relaxed text-subtle sm:text-left">
                  <span className="text-muted">Remember: </span>
                  {interpretations.globalDisclaimer}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={restart}
                  className="min-h-12 rounded-2xl border border-border/80 bg-background/40 px-6 text-sm font-medium text-foreground shadow-[var(--shadow-sm)] transition-[transform,box-shadow] hover:shadow-[var(--shadow-md)] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
                >
                  Take quiz again
                </button>
                <Link
                  href="/"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-accent px-6 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition-[transform,box-shadow] hover:shadow-[var(--shadow-md)] active:scale-[0.99] dark:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
                >
                  Back to home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function SnapshotRow({
  name,
  traitKey,
  percent,
  level,
  reduce,
}: {
  name: string;
  traitKey: TraitKey;
  percent: number;
  level: QuizResult["level"];
  reduce: boolean;
}) {
  const tint = traitTint[traitKey];
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2 gap-y-1">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{name}</p>
          <p className="text-xs text-subtle">{levelWord(level)}</p>
        </div>
        <p className="font-display text-lg font-semibold tabular-nums text-foreground">
          {percent}
          <span className="text-sm font-medium text-muted">%</span>
        </p>
      </div>
      <div className="mt-2.5">
        <TraitStrengthBar percent={percent} reduce={reduce} tint={tint} />
      </div>
    </div>
  );
}

function TraitRadar({
  results,
  names,
}: {
  results: QuizResult[];
  names: Record<string, { name: string }>;
}) {
  const size = 280;
  const center = size / 2;
  const maxRadius = 98;
  const steps = 4;

  const pointsFor = (scale: number): string =>
    TRAIT_KEYS.map((trait, i) => {
      const angle = (-Math.PI / 2) + (i * 2 * Math.PI) / TRAIT_KEYS.length;
      const r = maxRadius * scale;
      const x = center + Math.cos(angle) * r;
      const y = center + Math.sin(angle) * r;
      return `${x},${y}`;
    }).join(" ");

  const resultByTrait = new Map(results.map((r) => [r.trait, r]));
  const dataPoints = TRAIT_KEYS.map((trait, i) => {
    const angle = (-Math.PI / 2) + (i * 2 * Math.PI) / TRAIT_KEYS.length;
    const score = (resultByTrait.get(trait)?.percentIndex ?? 0) / 100;
    const r = maxRadius * score;
    return {
      trait,
      name: names[trait]?.name ?? trait,
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r,
      lx: center + Math.cos(angle) * (maxRadius + 18),
      ly: center + Math.sin(angle) * (maxRadius + 18),
    };
  });

  return (
    <div className="mx-auto w-full max-w-[20rem]">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full"
        role="img"
        aria-label="Radar chart of your Big Five profile"
      >
        {Array.from({ length: steps }).map((_, i) => {
          const scale = (i + 1) / steps;
          return (
            <polygon
              key={scale}
              points={pointsFor(scale)}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
            />
          );
        })}
        {TRAIT_KEYS.map((trait, i) => {
          const angle = (-Math.PI / 2) + (i * 2 * Math.PI) / TRAIT_KEYS.length;
          const x = center + Math.cos(angle) * maxRadius;
          const y = center + Math.sin(angle) * maxRadius;
          return (
            <line
              key={trait}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="var(--border)"
              strokeWidth="1"
            />
          );
        })}
        <polygon
          points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="var(--accent-soft)"
          stroke="var(--accent)"
          strokeWidth="2"
        />
        {dataPoints.map((p) => (
          <circle
            key={p.trait}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill="var(--accent)"
          />
        ))}
        {dataPoints.map((p) => (
          <text
            key={`${p.trait}-label`}
            x={p.lx}
            y={p.ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="var(--fg-subtle)"
          >
            {p.trait}
          </text>
        ))}
      </svg>
      <p className="mt-2 text-center text-xs text-subtle">
        O, C, E, A, N axes. A larger shape means a stronger score on that trait,
        not a better person.
      </p>
    </div>
  );
}

function TraitStrengthBar({
  percent,
  reduce,
  tint,
}: {
  percent: number;
  reduce: boolean;
  tint?: string;
}) {
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-border/90"
      role="presentation"
      aria-hidden
    >
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: tint ?? "var(--accent)" }}
        initial={reduce ? false : { width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: reduce ? 0 : 0.75, ease: easeOut }}
      />
    </div>
  );
}

function TraitResultFold({
  traitName,
  traitKey,
  band,
  percentIndex,
  levelLabel,
  reduce,
}: {
  traitName: string;
  traitKey: TraitKey;
  band: TraitBand;
  percentIndex: number;
  levelLabel: string;
  reduce: boolean;
}) {
  const tint = traitTint[traitKey];

  return (
    <li className="list-none">
      <details className="group rounded-2xl bg-elevated/55 shadow-[var(--shadow-sm)] open:bg-elevated/70 open:shadow-[var(--shadow-md)] dark:bg-elevated/40 dark:open:bg-elevated/55">
        <summary className="cursor-pointer list-none rounded-2xl p-5 marker:content-none [&::-webkit-details-marker]:hidden sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-medium text-foreground">
                {traitName}
              </h3>
              <p className="mt-0.5 text-xs text-subtle">{levelLabel}</p>
            </div>
            <p className="font-display text-2xl font-semibold tabular-nums text-foreground">
              {percentIndex}
              <span className="text-sm font-medium text-muted">%</span>
            </p>
          </div>
          <div className="mt-4">
            <TraitStrengthBar percent={percentIndex} reduce={reduce} tint={tint} />
          </div>
          <p className="mt-3 text-xs text-subtle">
            <span className="text-accent" aria-hidden>
              ·{" "}
            </span>
            Tap to read more
          </p>
        </summary>
        <div className="border-t border-border/60 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
          <p className="text-sm leading-relaxed text-muted">{band.summary}</p>
          <FoldList title="What often helps" items={band.strengths} />
          <FoldList title="What can cause problems" items={band.blindSpots} />
          <p className="mt-4 text-xs leading-relaxed text-subtle">
            {band.contextCaveat}
          </p>
        </div>
      </details>
    </li>
  );
}

function FoldList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((text) => (
          <li
            key={text}
            className="flex gap-2 text-sm text-muted before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-accent/80 before:content-['']"
          >
            <span className="leading-relaxed">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
