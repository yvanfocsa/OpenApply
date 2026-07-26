#!/usr/bin/env python3
"""Verify a CV and cover letter concurrently against their user-supplied templates."""

from __future__ import annotations

import argparse
import concurrent.futures
import json
import subprocess
import sys
from pathlib import Path


def run(command: list[str]) -> dict:
    completed = subprocess.run(command, text=True, capture_output=True, check=False)
    if completed.returncode:
        raise RuntimeError((completed.stderr or completed.stdout).strip())
    return json.loads(completed.stdout)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cv-template", type=Path, required=True)
    parser.add_argument("--cv-docx", type=Path, required=True)
    parser.add_argument("--cv-pdf", type=Path, required=True)
    parser.add_argument("--cv-qa-dir", type=Path, required=True)
    parser.add_argument("--letter-template", type=Path, required=True)
    parser.add_argument("--letter-docx", type=Path, required=True)
    parser.add_argument("--letter-pdf", type=Path, required=True)
    parser.add_argument("--letter-qa-dir", type=Path, required=True)
    args = parser.parse_args()

    verifier = Path(__file__).with_name("verify_document.py")
    commands = [
        [sys.executable, str(verifier), "--template", str(args.cv_template.resolve()), "--docx", str(args.cv_docx.resolve()), "--pdf", str(args.cv_pdf.resolve()), "--qa-dir", str(args.cv_qa_dir.resolve()), "--label", "CV"],
        [sys.executable, str(verifier), "--template", str(args.letter_template.resolve()), "--docx", str(args.letter_docx.resolve()), "--pdf", str(args.letter_pdf.resolve()), "--qa-dir", str(args.letter_qa_dir.resolve()), "--label", "cover letter"],
    ]
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        futures = [executor.submit(run, command) for command in commands]
        try:
            cv_result, letter_result = [future.result() for future in futures]
        except Exception as error:
            for future in futures:
                future.cancel()
            print(str(error), file=sys.stderr)
            return 1
    print(json.dumps({"status": "ok", "cv": cv_result, "letter": letter_result}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())