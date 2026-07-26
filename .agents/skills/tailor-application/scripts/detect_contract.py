#!/usr/bin/env python3
"""Detect CDI vs alternance from French or English vacancy text."""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path


PATTERNS = {
    "alternance": (
        (r"\balternance\b", 4.0, "alternance"),
        (r"\bapprentissage\b", 4.0, "apprentissage"),
        (r"\bapprenti(?:e|s|es)?\b", 3.5, "apprenti"),
        (r"\bcontrat\s+de\s+professionnalisation\b", 4.0, "contrat de professionnalisation"),
        (r"\bwork[ -]?study\b", 3.5, "work-study"),
        (r"\bapprentice(?:ship)?\b", 3.5, "apprenticeship"),
    ),
    "cdi": (
        (r"\bcdi\b", 4.0, "CDI"),
        (r"\bcontrat\s+a\s+duree\s+indeterminee\b", 4.0, "contrat à durée indéterminée"),
        (r"\bpermanent\s+(?:contract|position|role)\b", 3.5, "permanent contract/position"),
        (r"\bpermanent\b", 2.0, "permanent"),
        (r"\bfull[ -]?time\b", 1.0, "full-time"),
    ),
}


def normalize(text: str) -> str:
    decomposed = unicodedata.normalize("NFKD", text.casefold())
    return "".join(ch for ch in decomposed if not unicodedata.combining(ch))


def detect(text: str, mode: str = "auto") -> dict[str, object]:
    if mode != "auto":
        return {
            "contract_type": mode,
            "confidence": 1.0,
            "reason": "explicit_user_choice",
            "scores": {"alternance": 0.0, "cdi": 0.0},
            "matches": [],
        }

    normalized = normalize(text)
    scores = {"alternance": 0.0, "cdi": 0.0}
    matches: list[dict[str, object]] = []
    for contract, patterns in PATTERNS.items():
        for pattern, weight, label in patterns:
            count = len(re.findall(pattern, normalized, flags=re.IGNORECASE))
            if count:
                contribution = weight * min(count, 3)
                scores[contract] += contribution
                matches.append(
                    {"contract_type": contract, "term": label, "count": count, "weight": contribution}
                )

    alt, cdi = scores["alternance"], scores["cdi"]
    best = max(alt, cdi)
    gap = abs(alt - cdi)
    if best < 2.0 or (alt > 0 and cdi > 0 and gap < 2.0):
        contract = "ambiguous"
        confidence = 0.0 if best == 0 else round(gap / (alt + cdi), 3)
        reason = "insufficient_or_conflicting_evidence"
    else:
        contract = "alternance" if alt > cdi else "cdi"
        confidence = round(best / (alt + cdi), 3) if alt + cdi else 0.0
        reason = "offer_text"

    return {
        "contract_type": contract,
        "confidence": confidence,
        "reason": reason,
        "scores": scores,
        "matches": matches,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mode", choices=("auto", "cdi", "alternance"), default="auto")
    source = parser.add_mutually_exclusive_group()
    source.add_argument("--text")
    source.add_argument("--text-file", type=Path)
    args = parser.parse_args()

    if args.text is not None:
        text = args.text
    elif args.text_file is not None:
        text = args.text_file.read_text(encoding="utf-8")
    else:
        text = sys.stdin.read()

    print(json.dumps(detect(text, args.mode), ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
