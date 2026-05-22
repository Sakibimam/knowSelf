# KnowSelf

A personality app with **Big Five** and **Dark Triad (Dirty Dozen)** quizzes, plus a **psychometric toolkit** (item banks, scoring, pilot analysis).

> **Not clinical.** KnowSelf is for self-reflection and education. It is not a diagnostic instrument and does not replace professional assessment.

**Repo:** [github.com/Sakibimam/knowSelf](https://github.com/Sakibimam/knowSelf)

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **`/`** — Big Five results home (`localStorage`)
- **`/quiz`** — 25-item Big Five quiz (5 items × 5 traits)
- **`/quiz/dark-triad`** — Dirty Dozen (12 items: Machiavellianism, psychopathy traits, narcissism)

```bash
npm run build
npm start
```

### Deploy on Vercel

Import the repo and deploy with defaults (**Root Directory:** `.`, **Framework:** Next.js). The `app/` directory lives at the repository root — no monorepo subdirectory config needed.

If you previously set **Root Directory** to `knowself`, clear it (set to `.`) and redeploy.

---

## Project structure

```
.
├── app/                    # Next.js routes
├── components/             # Quiz + results UI
├── lib/                    # Client scoring, archetypes
├── quiz-data/              # Short-form items + trait copy
├── psychometric-data/      # Full item bank, norms, scoring config
├── docs/                   # Measurement, privacy, pilot specs
├── src/                    # scoring.js, report.js
└── scripts/                # score_demo.js, pilot_psychometrics.py
```

---

## Psychometric toolkit

```bash
node scripts/score_demo.js
```

```bash
python scripts/pilot_psychometrics.py --responses psychometric-data/pilot/responses.csv
```

| Path | Purpose |
|------|---------|
| `docs/measurement-framework.md` | Model, reverse-key map, quality thresholds |
| `psychometric-data/item-bank.v1.json` | 75-item bank (60 active + 15 reserve) |
| `psychometric-data/norms.v1.json` | Norm means/SDs |
| `quiz-data/quiz-items.v1.json` | Big Five short-form items |
| `quiz-data/trait-interpretations.v1.json` | Big Five trait copy |
| `quiz-data/dark-triad-items.v1.json` | Dirty Dozen items (Jonason & Webster, 2010) |
| `quiz-data/dark-triad-interpretations.v1.json` | Dark Triad trait copy |
| `docs/dark-triad-measurement.md` | Dirty Dozen scoring and use rules |

---

## Stack

Next.js 16 · React 19 · Tailwind CSS 4 · Motion

---

## License

Private / all rights reserved unless you add a license file.
