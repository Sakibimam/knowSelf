"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useId, useState } from "react";
import type { InterpretationsData, TraitLevel } from "@/lib/interpretations";
import { TRAIT_KEYS, traitTint, type TraitKey } from "@/lib/trait-order";

const easeOut = [0.22, 1, 0.36, 1] as const;

function containerVariants(reduce: boolean): Variants {
  return {
    hidden: { opacity: reduce ? 1 : 0 },
    show: {
      opacity: 1,
      transition: reduce
        ? { duration: 0 }
        : { staggerChildren: 0.07, delayChildren: 0.06 },
    },
  };
}

function itemVariants(reduce: boolean): Variants {
  return {
    hidden: reduce
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduce
        ? { duration: 0 }
        : { duration: 0.55, ease: easeOut },
    },
  };
}

const pillStagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const pillItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
};

const LEVELS: TraitLevel[] = ["low", "typical", "high"];

const LEVEL_LABEL: Record<TraitLevel, string> = {
  low: "Low",
  typical: "Mid",
  high: "High",
};

const VALUE_POINTS = [
  {
    title: "Five traits",
    body: "Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism. These are the Big Five traits in simple words.",
  },
  {
    title: "What you get",
    body: "Each trait gets a level (low, middle, or high) plus short notes on strengths, risks, and when context matters.",
  },
  {
    title: "Saved in this browser",
    body: "Your quiz answers stay on this device until you refresh. There is no account. Another device will not see your results.",
  },
] as const;

type Props = {
  data: InterpretationsData;
};

export function TraitHomeBody({ data }: Props) {
  const reduceMotion = useReducedMotion();
  const c = containerVariants(!!reduceMotion);
  const i = itemVariants(!!reduceMotion);
  const reduce = !!reduceMotion;

  return (
    <>
      <AmbientBackdrop reduced={reduce} />
      <main
        id="main-content"
        tabIndex={-1}
        className="outline-none focus:outline-none"
      >
        <section
          className="relative mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-10 lg:pt-16"
          aria-labelledby="hero-heading"
        >
          <div className="grid items-start gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_min(22rem,36vw)] lg:items-center lg:gap-14 xl:gap-16">
            <motion.div
              className="min-w-0"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: easeOut }}
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-subtle">
                Big Five · self-report
              </p>
              <h1
                id="hero-heading"
                className="font-display max-w-[20ch] text-[clamp(1.85rem,1rem+3.8vw,3rem)] font-medium leading-[1.08] tracking-tight text-balance sm:max-w-[24ch]"
              >
                A short quiz about how you usually think and act
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted sm:mt-6 sm:text-lg">
                Twenty-five questions on five personality traits. Some answers
                may feel obvious. Some may feel uncomfortable. Both are useful.
              </p>

              <div className="mt-9 flex w-full min-w-0 flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-stretch">
                <Link
                  href="/quiz"
                  className="inline-flex min-h-12 w-full flex-1 items-center justify-center rounded-2xl bg-accent px-6 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition-[transform,box-shadow,opacity] hover:shadow-[var(--shadow-md)] active:scale-[0.99] dark:text-stone-950 sm:w-auto sm:min-w-44 sm:flex-none touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
                >
                  Big Five quiz
                </Link>
                <Link
                  href="/quiz/dark-triad"
                  className="inline-flex min-h-12 w-full flex-1 items-center justify-center rounded-2xl bg-elevated/80 px-6 text-sm font-medium text-foreground shadow-[var(--shadow-sm)] backdrop-blur-sm transition-[transform,box-shadow] hover:shadow-[var(--shadow-md)] active:scale-[0.99] sm:w-auto sm:min-w-44 sm:flex-none touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
                >
                  Dirty Dozen (12)
                </Link>
                <a
                  href="#dimensions"
                  className="inline-flex min-h-12 w-full flex-1 items-center justify-center rounded-2xl border border-border/80 bg-background/40 px-6 text-sm font-medium text-muted shadow-[var(--shadow-sm)] transition-[transform,box-shadow] hover:text-foreground hover:shadow-[var(--shadow-md)] active:scale-[0.99] sm:w-auto sm:flex-none touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
                >
                  Read traits first
                </a>
              </div>
              <p className="mt-4 max-w-xl text-xs leading-relaxed text-subtle sm:text-sm">
                No login. This tab only, refresh clears the quiz trail.
              </p>

              <aside
                className="mt-6 max-w-xl rounded-2xl bg-elevated/50 p-4 text-left shadow-[var(--shadow-sm)] sm:p-5"
                aria-label="Answering tips"
              >
                <p className="text-sm font-medium text-foreground">
                  Answer for a normal week
                </p>
                <p className="mt-1.5 text-sm leading-snug text-muted">
                  Pick what is mostly true for you, not what sounds best.
                </p>
              </aside>
            </motion.div>

            <OceanPreview data={data} reduce={reduce} />
          </div>
        </section>

        <motion.section
          className="border-y border-border/50 bg-elevated/35 py-14 backdrop-blur-md sm:py-20"
          aria-labelledby="value-points-heading"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
            <h2 id="value-points-heading" className="sr-only">
              What Trait includes
            </h2>
            <ul className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 lg:gap-8">
              {VALUE_POINTS.map((item) => (
                <li key={item.title} className="list-none">
                  <article className="h-full rounded-2xl bg-background/60 p-5 shadow-[var(--shadow-sm)] sm:p-6">
                    <h3 className="font-display text-sm font-medium leading-snug text-foreground sm:text-base">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted sm:mt-2.5">
                      {item.body}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        <motion.section
          className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
          aria-labelledby="disclaimer-heading"
          variants={c}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={i}
            className="relative overflow-hidden rounded-2xl bg-elevated/70 p-5 shadow-[var(--shadow-sm)] sm:p-7 md:p-8"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-40 blur-3xl bg-accent-soft"
              aria-hidden
            />
            <h2
              id="disclaimer-heading"
              className="font-display relative text-lg font-medium text-foreground"
            >
              Before you start
            </h2>
            <p className="relative mt-3 text-sm leading-relaxed text-muted sm:text-base">
              {data.globalDisclaimer}
            </p>
            <p className="relative mt-3 text-sm leading-relaxed text-subtle">
              {data.confidenceNote}
            </p>
          </motion.div>
        </motion.section>

        <section
          id="dimensions"
          className="scroll-mt-[max(5.5rem,calc(env(safe-area-inset-top)+3.5rem))] px-4 pb-20 pt-2 sm:px-6 sm:pb-24 lg:px-10 lg:pb-28"
          aria-labelledby="dimensions-heading"
        >
          <div className="mx-auto max-w-2xl text-center lg:max-w-3xl">
            <h2
              id="dimensions-heading"
              className="font-display mt-1 text-[clamp(1.25rem,0.95rem+1.5vw,1.75rem)] font-medium tracking-tight text-foreground sm:text-2xl"
            >
              The five traits
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted sm:max-w-xl sm:text-base">
              Tap low, middle, or high to see different notes for the same trait.
              These are patterns, not fixed labels.
            </p>
          </div>
          <motion.ul
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3.5 sm:mt-10 sm:gap-4 md:max-w-3xl lg:mt-12"
            variants={c}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            role="list"
          >
            {TRAIT_KEYS.map((key) => (
              <TraitCard
                key={key}
                traitKey={key}
                trait={data.traits[key]}
                variants={i}
                reduced={reduce}
              />
            ))}
          </motion.ul>
        </section>
      </main>
    </>
  );
}

function OceanPreview({
  data,
  reduce,
}: {
  data: InterpretationsData;
  reduce: boolean;
}) {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
      initial={reduce ? false : { opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.08, ease: easeOut }}
      aria-hidden
    >
      <div className="rounded-2xl bg-elevated/65 p-4 shadow-[var(--shadow-md)] backdrop-blur-md dark:bg-elevated/45 sm:rounded-3xl sm:p-6">
        <p className="text-center text-xs font-medium text-subtle sm:text-sm">
          OCEAN
        </p>
        {reduce ? (
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:flex sm:flex-col sm:gap-2.5">
            {TRAIT_KEYS.map((key, idx) => (
              <li
                key={key}
                className={
                  idx === TRAIT_KEYS.length - 1 ? "col-span-2 sm:col-span-1" : ""
                }
              >
                <OceanPreviewRow traitKey={key} name={data.traits[key].name} />
              </li>
            ))}
          </ul>
        ) : (
          <motion.ul
            className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:flex sm:flex-col sm:gap-2.5"
            variants={pillStagger}
            initial="hidden"
            animate="show"
          >
            {TRAIT_KEYS.map((key, idx) => (
              <motion.li
                key={key}
                variants={pillItem}
                className={`list-none ${idx === TRAIT_KEYS.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
              >
                <OceanPreviewRow traitKey={key} name={data.traits[key].name} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.div>
  );
}

function OceanPreviewRow({
  traitKey,
  name,
}: {
  traitKey: TraitKey;
  name: string;
}) {
  const tint = traitTint[traitKey];
  return (
    <div
      className="flex min-h-11 items-center gap-2 rounded-xl bg-background/30 px-2.5 py-2 shadow-[var(--shadow-sm)] sm:min-h-0 sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3"
      style={{
        background: `linear-gradient(105deg, ${tint}, transparent 72%)`,
      }}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background/80 font-display text-xs font-semibold tabular-nums text-foreground ring-1 ring-border/80 dark:bg-background/40 sm:size-10 sm:rounded-xl sm:text-sm">
        {traitKey}
      </span>
      <span className="min-w-0 flex-1 text-left text-xs font-medium leading-snug text-foreground sm:text-sm">
        {name}
      </span>
    </div>
  );
}

function AmbientBackdrop({ reduced }: { reduced: boolean }) {
  if (reduced) {
    return (
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, var(--glow-1), transparent 55%), radial-gradient(90% 60% at 100% 40%, var(--glow-2), transparent 50%)",
        }}
      />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -left-1/4 top-0 size-[min(70vw,520px)] rounded-full opacity-60 blur-3xl bg-[var(--glow-1)]"
        animate={{ x: [0, 24, 0], y: [0, 12, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="absolute -right-1/4 top-1/3 size-[min(60vw,440px)] rounded-full opacity-50 blur-3xl bg-[var(--glow-2)]"
        animate={{ x: [0, -20, 0], y: [0, 18, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_0%,transparent_40%,var(--bg)_85%)]"
        aria-hidden
      />
    </div>
  );
}

type CardProps = {
  traitKey: TraitKey;
  trait: InterpretationsData["traits"][string];
  variants: Variants;
  reduced: boolean;
};

function TraitCard({ traitKey, trait, variants, reduced }: CardProps) {
  const [level, setLevel] = useState<TraitLevel>("typical");
  const tint = traitTint[traitKey];
  const panelId = useId();
  const headingId = `${panelId}-title`;

  return (
    <motion.li variants={variants} layout={!reduced} className="list-none">
      <article
        className="overflow-hidden rounded-2xl bg-elevated/75 shadow-[var(--shadow-sm)] backdrop-blur-md transition-shadow duration-300 hover:shadow-[var(--shadow-md)] dark:bg-elevated/55"
        style={
          {
            ["--trait-tint" as string]: tint,
          } as React.CSSProperties
        }
        aria-labelledby={headingId}
      >
        <div
          className="border-b border-border/60 px-4 py-4 sm:px-5 sm:py-5"
          style={{
            background: `linear-gradient(135deg, var(--trait-tint), transparent 65%)`,
          }}
        >
          <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-2">
            <h3
              id={headingId}
              className="font-display text-base font-medium tracking-tight sm:text-lg"
            >
              {trait.name}
            </h3>
            <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-subtle">
              OCEAN
            </span>
          </div>
          <p
            className="mt-2 text-sm leading-relaxed text-muted sm:text-base"
            aria-live="polite"
            aria-atomic="true"
          >
            {trait[level].summary}
          </p>

          <div
            className="mt-4 flex flex-wrap gap-2"
            role="group"
            aria-label={`${trait.name} level`}
          >
            {LEVELS.map((l) => {
              const active = level === l;
              return (
                <button
                  key={l}
                  type="button"
                  aria-pressed={active}
                  aria-controls={panelId}
                  onClick={() => setLevel(l)}
                  className={`min-h-10 touch-manipulation rounded-full px-4 py-2 text-xs font-medium transition-colors sm:min-h-9 sm:px-3.5 sm:py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)] ${
                    active
                      ? "bg-accent text-white shadow-sm dark:text-stone-950"
                      : "bg-background/60 text-muted hover:text-foreground dark:bg-background/20"
                  }`}
                >
                  {LEVEL_LABEL[l]}
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          id={panelId}
          layout={!reduced}
          className="px-4 py-4 sm:px-5 sm:py-5"
          role="region"
          aria-label={`${trait.name} details`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={level}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: easeOut }}
              className="space-y-4 text-sm"
            >
              <BandList title="What often helps" items={trait[level].strengths} />
              <BandList title="What can cause problems" items={trait[level].blindSpots} />
              <p className="border-t border-border pt-3 text-xs leading-relaxed text-subtle">
                {trait[level].contextCaveat}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </article>
    </motion.li>
  );
}

function BandList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
        {title}
      </p>
      <ul className="space-y-1.5">
        {items.map((text) => (
          <li
            key={text}
            className="flex gap-2 text-muted before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-accent before:content-['']"
          >
            <span className="leading-relaxed">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
