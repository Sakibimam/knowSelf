#!/usr/bin/env python3
"""
Pilot psychometric analysis for Big Five item pruning.

Input CSV requirements:
- One row per participant
- One column per item id (O01..N15)
- Optional metadata columns are ignored

Usage:
  python scripts/pilot_psychometrics.py --responses psychometric-data/pilot/responses.csv
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd


TRAITS = ["O", "C", "E", "A", "N"]


def cronbach_alpha(x: pd.DataFrame) -> float:
    k = x.shape[1]
    if k < 2:
        return float("nan")
    item_vars = x.var(axis=0, ddof=1).sum()
    total_var = x.sum(axis=1).var(ddof=1)
    if total_var == 0:
        return float("nan")
    return (k / (k - 1)) * (1 - (item_vars / total_var))


def item_total_corr(x: pd.DataFrame) -> Dict[str, float]:
    out: Dict[str, float] = {}
    for col in x.columns:
        rest = x.drop(columns=[col]).sum(axis=1)
        out[col] = x[col].corr(rest)
    return out


def reverse_score(series: pd.Series, scale_max: int = 5) -> pd.Series:
    return (scale_max + 1) - series


def load_item_bank(path: Path) -> pd.DataFrame:
    payload = json.loads(path.read_text())
    return pd.DataFrame(payload["items"])


def keyed_matrix(responses: pd.DataFrame, item_bank: pd.DataFrame) -> pd.DataFrame:
    keyed = responses.copy()
    for _, row in item_bank.iterrows():
        item_id = row["id"]
        if item_id not in keyed.columns:
            continue
        if bool(row["reverseKeyed"]):
            keyed[item_id] = reverse_score(keyed[item_id])
    return keyed


def pick_top12_by_trait(
    item_bank: pd.DataFrame, it_corr: Dict[str, float], trait: str
) -> List[str]:
    trait_items = item_bank[item_bank["trait"] == trait]["id"].tolist()
    scored = [(item_id, it_corr.get(item_id, float("-inf"))) for item_id in trait_items]
    scored.sort(key=lambda x: x[1], reverse=True)
    return [item_id for item_id, _ in scored[:12]]


def pseudo_factor_quality(keyed: pd.DataFrame, selected_items: List[str]) -> Tuple[float, float]:
    """
    Lightweight stand-in for factor structure sanity check:
    - ratio_first_component: first eigenvalue / total variance
    - ratio_first_five_components: sum first five / total variance
    """
    x = keyed[selected_items].dropna().to_numpy()
    x = x - x.mean(axis=0, keepdims=True)
    cov = np.cov(x, rowvar=False)
    eigvals = np.sort(np.linalg.eigvalsh(cov))[::-1]
    total = eigvals.sum()
    if total <= 0:
        return float("nan"), float("nan")
    first = float(eigvals[0] / total)
    first_five = float(eigvals[:5].sum() / total)
    return first, first_five


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--responses", required=True, type=Path)
    parser.add_argument("--item-bank", type=Path, default=Path("psychometric-data/item-bank.v1.json"))
    parser.add_argument("--out", type=Path, default=Path("psychometric-data/pilot/report.json"))
    args = parser.parse_args()

    responses = pd.read_csv(args.responses)
    item_bank = load_item_bank(args.item_bank)

    expected = set(item_bank["id"].tolist())
    available = [c for c in responses.columns if c in expected]
    if len(available) < 50:
        raise ValueError("Insufficient item columns in responses CSV. Expected Big Five item IDs.")

    keyed = keyed_matrix(responses[available], item_bank[item_bank["id"].isin(available)])
    it_corr = item_total_corr(keyed)

    selected: Dict[str, List[str]] = {}
    alphas: Dict[str, float] = {}
    for trait in TRAITS:
        selected[trait] = pick_top12_by_trait(item_bank, it_corr, trait)
        alphas[trait] = float(cronbach_alpha(keyed[selected[trait]]))

    final_60 = [item for trait in TRAITS for item in selected[trait]]
    one_factor_ratio, five_factor_ratio = pseudo_factor_quality(keyed, final_60)

    report = {
        "sample_size": int(len(keyed)),
        "alpha_by_trait": alphas,
        "item_total_corr": it_corr,
        "selected_12_per_trait": selected,
        "factor_sanity": {
            "first_component_ratio": one_factor_ratio,
            "first_five_component_ratio": five_factor_ratio,
            "note": "Use CFA/EFA in R or specialized psychometrics stack for publication-grade fit indices.",
        },
        "quality_gate_targets": {
            "alpha_min": 0.75,
            "item_total_corr_min": 0.25,
            "test_retest_min": 0.70,
        },
    }

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, indent=2))
    print(f"Wrote pilot report: {args.out}")


if __name__ == "__main__":
    main()
