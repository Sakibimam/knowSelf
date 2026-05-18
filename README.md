# KnowSelf

A Big Five personality product with two layers: a **browser app** for taking a short quiz and reading plain-language results, and a **psychometric toolkit** underneath for item banks, scoring, pilot analysis, and measurement specs.

> **Not clinical.** KnowSelf is for self-reflection and education. It is not a diagnostic instrument and does not replace professional assessment.

**Live repo:** [github.com/Sakibimam/knowSelf](https://github.com/Sakibimam/knowSelf)

---

## What you get

| Layer | What it does |
|-------|----------------|
| **`knowself/`** | Next.js app — 25-item quiz, trait dashboard, identity archetype copy, psychometric transparency panel |
| **Root (`data/`, `src/`, `scripts/`)** | Full 75-item bank (60-item production form + reserves), norms, scoring engine, pilot pruning pipeline, measurement docs |

The app uses a **short form** (`knowself/data/quiz-items.v1.json`, 5 items × 5 traits). The repo also ships the **full item bank** and scoring stack for extending to the 60-item production form when you run a pilot.

---

## Quick start (app)

```bash
cd knowself
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Home** — trait results landing (reads saved quiz output from `localStorage`)
- **`/quiz`** — interactive Big Five questionnaire with progress, validation, and results

Production build:

```bash
cd knowself
npm run build
npm start
```

### Deploy on Vercel

**Recommended:** Project Settings → General → **Root Directory** → `knowself` → Save → Redeploy.

That runs `next build` where `app/` actually lives. Root `vercel.json` is a fallback (`cd knowself && npm run build`) if you keep Root Directory as `.`.

If a deploy still fails with “Couldn't find any `pages` or `app` directory”:

1. Clear any **Build Command** override in Vercel (should not be `next build` at repo root).
2. Set Root Directory to `knowself`, or rely on root `vercel-build` (`cd knowself && npm install && npm run build`).
3. Redeploy after pulling latest `main`.

---

## App architecture

```
knowself/
├── app/
│   ├── page.tsx          # Trait results home
│   └── quiz/             # Quiz route
├── components/
│   ├── PersonalityQuiz.tsx
│   ├── TraitHome.tsx
│   └── trait-home/       # Results UI (charts, copy, archetype)
├── lib/
│   ├── score-quiz.ts     # Client-side scoring
│   ├── identity-archetype.ts
│   └── trait-order.ts
└── data/
    ├── quiz-items.v1.json
    └── trait-interpretations.v1.json
```

**Scoring (app):** Likert responses → reverse-key where needed → trait means → percentile-style index vs. embedded norms → optional validity flags → archetype label from dominant traits.

**Persistence:** Results are stored in the browser (`localStorage`). No account or server required for the default flow.

**Stack:** Next.js 16 · React 19 · Tailwind CSS 4 · Motion

---

## Psychometric toolkit (root)

### Run the scoring demo

```bash
node scripts/score_demo.js
```

Uses `src/scoring.js` (percentiles, CI bands, validity flags) and `src/report.js` (five-trait report + synthesis).

### Run pilot analysis

Requires a responses CSV (see `docs/pilot-protocol.md`):

```bash
python scripts/pilot_psychometrics.py --responses data/pilot/responses.csv
```

### Key files

| Path | Purpose |
|------|---------|
| `docs/measurement-framework.md` | Big Five model, reverse-key map, scoring outputs, quality thresholds |
| `docs/consent-privacy.md` | Consent, privacy, and deletion requirements |
| `docs/pilot-protocol.md` | Pilot study design and pruning rules |
| `data/item-bank.v1.json` | 75-item bank (60 active + 15 reserve) |
| `data/scoring-config.v1.json` | Scoring parameters |
| `data/norms.v1.json` | Norm means/SDs for percentile transform |
| `data/trait-interpretations.v1.json` | User-facing trait copy (shared with app data) |

### Measurement highlights (v1)

- **Traits:** Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism (O, C, E, A, N)
- **Scale:** 1–5 Likert (strongly disagree → strongly agree)
- **Reverse-keying:** Documented per item in the measurement framework
- **Invalid protocol rules:** Fast completion, long-string responding, opposite-pair inconsistency, failed attention checks → low-confidence flag

Details: [`docs/measurement-framework.md`](docs/measurement-framework.md)

---

## Project structure

```
.
├── knowself/              # Next.js web app
├── data/                  # Item bank, norms, scoring config, interpretations
├── docs/                  # Measurement, privacy, pilot specs
├── src/                   # scoring.js, report.js
└── scripts/               # score_demo.js, pilot_psychometrics.py
```

---

## Roadmap-friendly extensions

- Wire the app to the **60-item production form** from `data/item-bank.v1.json`
- Replace placeholder norms after a real pilot (`scripts/pilot_psychometrics.py`)
- Add server-side persistence with the consent model in `docs/consent-privacy.md`
- Deploy `knowself/` to Vercel (or any Node host)

---

## License

Private / all rights reserved unless you add a license file.
