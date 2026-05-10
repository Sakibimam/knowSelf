# Pilot Psychometrics Protocol

## Objective
Use pilot responses (n=200-400) to prune from 75 items to a stable 60-item form.

## Data requirements
- Response CSV with one row per participant.
- Columns named by item ID (`O01..N15`).
- Values must be integers 1-5.
- Optional demographic columns allowed.

## Analysis steps
1. Reverse-score using the item bank metadata.
2. Compute per-item corrected item-total correlations.
3. For each trait, keep top 12 items by corrected item-total correlation.
4. Compute Cronbach alpha per trait on selected items.
5. Run factor-structure sanity check:
   - first principal component variance ratio
   - first five components variance ratio
6. Mark traits failing quality gates for item rewrite.

## Commands
```bash
python scripts/pilot_psychometrics.py --responses data/pilot/responses.csv
```

## Pass criteria (v1)
- alpha for each trait >= 0.75
- at least 12 viable items per trait with item-total correlation >= 0.25
- first five component ratio substantially larger than first component ratio

## Required follow-up before production
- Conduct formal EFA/CFA and invariance checks in dedicated psychometric tooling.
- Run test-retest study (2-4 weeks; target r >= 0.70).
