"use strict";

const TRAIT_ORDER = ["O", "C", "E", "A", "N"];

function toKeyBand(percentile) {
  if (percentile < 30) return "low";
  if (percentile <= 70) return "typical";
  return "high";
}

function roundPct(value) {
  return Math.round(value * 10) / 10;
}

function sortTraitPercentiles(traits) {
  return TRAIT_ORDER.map((id) => ({ trait: id, percentile: traits[id].percentile })).sort(
    (a, b) => b.percentile - a.percentile
  );
}

function buildCombinationNarrative(traits) {
  const sorted = sortTraitPercentiles(traits);
  const top = sorted[0];
  const second = sorted[1];
  const bottom = sorted[sorted.length - 1];

  const style = [];
  const highC = traits.C.percentile >= 70;
  const highO = traits.O.percentile >= 70;
  const highE = traits.E.percentile >= 70;
  const highA = traits.A.percentile >= 70;
  const highN = traits.N.percentile >= 70;
  const lowN = traits.N.percentile < 30;
  const lowA = traits.A.percentile < 30;
  const lowE = traits.E.percentile < 30;

  if (highO && highC) {
    style.push(
      "Your pattern suggests a strategic builder profile: you generate novel options and also execute with structure."
    );
  } else if (highO && !highC) {
    style.push(
      "Your pattern suggests an exploratory profile: strong idea generation with more flexible structure."
    );
  } else if (!highO && highC) {
    style.push(
      "Your pattern suggests a precision executor profile: practical focus with high consistency."
    );
  }

  if (highE && highA) {
    style.push(
      "In social settings, your scores suggest a warm-engaging style with active collaboration."
    );
  } else if (highE && lowA) {
    style.push(
      "In social settings, your scores suggest an assertive-competitive style, likely direct and high influence."
    );
  } else if (lowE && highA) {
    style.push(
      "In social settings, your scores suggest a quiet-supportive style: cooperative, but lower outward intensity."
    );
  } else if (lowE && lowA) {
    style.push(
      "In social settings, your scores suggest an independent-guarded style with selective engagement."
    );
  }

  if (highN) {
    style.push(
      "Your emotional profile indicates higher stress reactivity; risk monitoring may be strong, but recovery load can be higher."
    );
  } else if (lowN) {
    style.push(
      "Your emotional profile indicates higher stability under pressure, which can support consistent decision-making."
    );
  }

  style.push(
    `Your highest relative trait is ${top.trait} (${roundPct(
      top.percentile
    )}th percentile), followed by ${second.trait} (${roundPct(
      second.percentile
    )}th). Your lowest relative trait is ${bottom.trait} (${roundPct(
      bottom.percentile
    )}th).`
  );

  return style.join(" ");
}

function buildTraitBreakdown(traits, interpretations) {
  const out = {};
  for (const trait of TRAIT_ORDER) {
    const percentile = traits[trait].percentile;
    const keyBand = toKeyBand(percentile);
    const copy = interpretations.traits[trait][keyBand];
    out[trait] = {
      percentile: roundPct(percentile),
      confidenceBand: {
        low: roundPct(traits[trait].confidenceBand.low),
        high: roundPct(traits[trait].confidenceBand.high),
      },
      band: traits[trait].band,
      summary: copy.summary,
      strengths: copy.strengths,
      blindSpots: copy.blindSpots,
      contextCaveat: copy.contextCaveat,
    };
  }
  return out;
}

function buildFinalReport(scoringResult, interpretations) {
  if (!scoringResult.ok) {
    return scoringResult;
  }

  const traitBreakdown = buildTraitBreakdown(scoringResult.traits, interpretations);

  return {
    model: "BigFive",
    disclaimer: interpretations.globalDisclaimer,
    confidenceNote: interpretations.confidenceNote,
    lowConfidence: scoringResult.validity.lowConfidence,
    validity: scoringResult.validity,
    traitPercentages: {
      O: traitBreakdown.O.percentile,
      C: traitBreakdown.C.percentile,
      E: traitBreakdown.E.percentile,
      A: traitBreakdown.A.percentile,
      N: traitBreakdown.N.percentile,
    },
    personalitySynthesis: buildCombinationNarrative(scoringResult.traits),
    traits: traitBreakdown,
  };
}

module.exports = {
  buildFinalReport,
};
