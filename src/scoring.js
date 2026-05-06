"use strict";

const TRAITS = ["O", "C", "E", "A", "N"];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function erf(x) {
  const sign = x >= 0 ? 1 : -1;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const absX = Math.abs(x);
  const t = 1 / (1 + p * absX);
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
      Math.exp(-absX * absX);
  return sign * y;
}

function normalCdf(z) {
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

function reverseScore(raw, maxScale = 5) {
  return maxScale + 1 - raw;
}

function longestIdenticalRun(values) {
  if (!values.length) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < values.length; i += 1) {
    if (values[i] === values[i - 1]) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

function percentileFromRaw(raw, normMean, normSd) {
  const z = (raw - normMean) / normSd;
  return clamp(normalCdf(z) * 100, 0, 100);
}

/**
 * responses: [{ itemId, value, answeredAtMs? }]
 * config: {
 *   itemBank: [{id, trait, reverseKeyed, active}],
 *   norms: { O:{mean,sd,reliability}, ... },
 *   attentionChecks: [{ itemId, expectedMin, expectedMax }],
 *   oppositePairs: [{ a, b }],
 *   minDurationSeconds: number,
 *   maxLongstring: number
 * }
 */
function scoreAssessment(responses, config) {
  const {
    itemBank,
    norms,
    attentionChecks = [],
    oppositePairs = [],
    minDurationSeconds = 180,
    maxLongstring = 20,
  } = config;

  const activeItems = itemBank.filter((x) => x.active);
  const activeIdSet = new Set(activeItems.map((x) => x.id));
  const itemById = new Map(activeItems.map((x) => [x.id, x]));
  const responseMap = new Map();
  const orderedValues = [];
  for (const entry of responses) {
    if (!activeIdSet.has(entry.itemId)) continue;
    const val = Number(entry.value);
    if (Number.isNaN(val)) continue;
    const bounded = clamp(val, 1, 5);
    responseMap.set(entry.itemId, bounded);
    orderedValues.push(bounded);
  }

  const missingItems = activeItems
    .map((x) => x.id)
    .filter((id) => !responseMap.has(id));
  if (missingItems.length > 0) {
    return {
      ok: false,
      error: "Missing required responses.",
      missingItems,
    };
  }

  const keyedByTrait = { O: [], C: [], E: [], A: [], N: [] };
  for (const item of activeItems) {
    const raw = responseMap.get(item.id);
    const keyed = item.reverseKeyed ? reverseScore(raw) : raw;
    keyedByTrait[item.trait].push({ itemId: item.id, raw, keyed });
  }

  const traits = {};
  for (const trait of TRAITS) {
    const values = keyedByTrait[trait].map((x) => x.keyed);
    const rawMean = values.reduce((a, b) => a + b, 0) / values.length;
    const norm = norms[trait];
    const percentile = percentileFromRaw(rawMean, norm.mean, norm.sd);
    const sem = norm.sd * Math.sqrt(Math.max(0, 1 - norm.reliability));
    const ciLowRaw = clamp(rawMean - 1.96 * sem, 1, 5);
    const ciHighRaw = clamp(rawMean + 1.96 * sem, 1, 5);
    traits[trait] = {
      rawMean,
      percentile,
      confidenceBand: {
        low: percentileFromRaw(ciLowRaw, norm.mean, norm.sd),
        high: percentileFromRaw(ciHighRaw, norm.mean, norm.sd),
      },
      band:
        percentile < 30 ? "Low" : percentile <= 70 ? "Typical" : "High",
    };
  }

  const attentionFailures = attentionChecks.filter((rule) => {
    const actual = responseMap.get(rule.itemId);
    return actual < rule.expectedMin || actual > rule.expectedMax;
  });

  const oppositeInconsistencyCount = oppositePairs.reduce((count, pair) => {
    const aItem = itemById.get(pair.a);
    const bItem = itemById.get(pair.b);
    if (!aItem || !bItem) return count;
    const aRaw = responseMap.get(pair.a);
    const bRaw = responseMap.get(pair.b);
    const aKeyed = aItem.reverseKeyed ? reverseScore(aRaw) : aRaw;
    const bKeyed = bItem.reverseKeyed ? reverseScore(bRaw) : bRaw;
    return Math.abs(aKeyed - bKeyed) <= 1 ? count + 1 : count;
  }, 0);

  const startedAt = responses[0]?.answeredAtMs;
  const endedAt = responses[responses.length - 1]?.answeredAtMs;
  const durationSeconds =
    Number.isFinite(startedAt) && Number.isFinite(endedAt)
      ? Math.max(0, (endedAt - startedAt) / 1000)
      : null;

  const validityFlags = {
    tooFast: durationSeconds !== null && durationSeconds < minDurationSeconds,
    longstring: longestIdenticalRun(orderedValues) >= maxLongstring,
    oppositeInconsistency: oppositeInconsistencyCount >= 2,
    attentionCheckFailures: attentionFailures.length >= 2,
  };

  const lowConfidence = Object.values(validityFlags).some(Boolean);

  return {
    ok: true,
    traits,
    validity: {
      lowConfidence,
      validityFlags,
      durationSeconds,
      attentionFailures: attentionFailures.map((x) => x.itemId),
      oppositeInconsistencyCount,
    },
  };
}

module.exports = {
  scoreAssessment,
  reverseScore,
  percentileFromRaw,
};
