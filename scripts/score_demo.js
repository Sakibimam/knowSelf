"use strict";

const fs = require("fs");
const path = require("path");
const { scoreAssessment } = require("../src/scoring");
const { buildFinalReport } = require("../src/report");

const itemBank = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../psychometric-data/item-bank.v1.json"), "utf8")
).items;
const norms = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../psychometric-data/norms.v1.json"), "utf8")
).traits;
const cfg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../psychometric-data/scoring-config.v1.json"), "utf8")
);
const interpretations = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../psychometric-data/trait-interpretations.v1.json"),
    "utf8"
  )
);

const active = itemBank.filter((x) => x.active);
const now = Date.now();
const responses = active.map((item, idx) => ({
  itemId: item.id,
  value: (idx % 5) + 1,
  answeredAtMs: now + idx * 3500,
}));

const result = scoreAssessment(responses, {
  itemBank,
  norms,
  ...cfg,
});
const finalReport = buildFinalReport(result, interpretations);

console.log(JSON.stringify(finalReport, null, 2));
