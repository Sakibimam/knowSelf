# Big Five Measurement Framework (v1)

## Core model
- Construct: Big Five traits (O, C, E, A, N).
- Format: self-report Likert items (1-5).
- Scale anchors:
  - 1 = Strongly disagree
  - 2 = Disagree
  - 3 = Neutral
  - 4 = Agree
  - 5 = Strongly agree
- Active production form: 60 items (12 per trait).
- Pilot bank: 75 items (15 per trait); 3 reserve items per trait for replacement after psychometric pruning.

## Facet blueprint
- Openness: imagination, curiosity, aesthetics.
- Conscientiousness: orderliness, self-discipline, reliability.
- Extraversion: sociability, assertiveness, activity level.
- Agreeableness: empathy, cooperation, trust/forgiveness.
- Neuroticism: stress reactivity, worry, emotional volatility.

## Item ID scheme
- `O01..O15`, `C01..C15`, `E01..E15`, `A01..A15`, `N01..N15`.
- Active 60-item form uses `01..12` for each trait.
- Reserve items are `13..15`.

## Reverse-key map (active 60-item form)
- Openness reverse-keyed: `O03`, `O06`, `O08`, `O11`, `O12`
- Conscientiousness reverse-keyed: `C02`, `C05`, `C08`, `C10`, `C12`
- Extraversion reverse-keyed: `E02`, `E04`, `E07`, `E10`, `E12`
- Agreeableness reverse-keyed: `A03`, `A05`, `A08`, `A10`, `A12`
- Neuroticism reverse-keyed (emotional stability direction items): `N02`, `N04`, `N07`, `N10`, `N12`

Reverse-scoring rule:
- `reversed = 6 - raw` for all reverse-keyed items.

## Scoring outputs
- Trait raw score: mean of keyed responses for that trait.
- Trait z-score: `(raw - normMean) / normSd`.
- Trait percentile: standard normal CDF of z-score * 100.
- Optional confidence band:
  - `SEM = traitSd * sqrt(1 - reliability)`
  - `CI_raw = raw +/- 1.96 * SEM`
  - map CI bounds to percentiles with same norm transform.

## Quality thresholds
- Internal consistency target: alpha/omega >= 0.75.
- Test-retest (2-4 weeks) target: r >= 0.70.
- Item-total correlation target: >= 0.25.

## Invalid protocol rules (v1)
- Fast completion: < 180 seconds for 60 items.
- Long-string: 20+ identical consecutive responses.
- Opposite-pair inconsistency: 2+ contradictory pairs differ by <= 1 after keying.
- Attention checks failed: 2+ failed checks.

If invalid protocol triggers, result is flagged as low confidence and retake is recommended.
