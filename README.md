# Trait

Scientifically grounded Big Five personality assessment starter pack:

- `docs/measurement-framework.md`: measurement and reverse-keying spec.
- `data/item-bank.v1.json`: 75-item bank (60 active + 15 reserve).
- `scripts/pilot_psychometrics.py`: pilot pruning/reliability analysis pipeline.
- `src/scoring.js`: scoring engine (percentiles, CI bands, validity flags).
- `src/report.js`: final report builder (5-trait percentages + synthesis narrative).
- `data/trait-interpretations.v1.json`: user-facing trait report content.
- `docs/consent-privacy.md`: consent, privacy, and deletion requirements.

## Quick checks

Run scoring demo:
```bash
node scripts/score_demo.js
```

Run pilot analysis (requires CSV responses):
```bash
python scripts/pilot_psychometrics.py --responses data/pilot/responses.csv
```
