#!/usr/bin/env python3
"""Render a DOCX to PDF and PNG on macOS, Windows, or Linux."""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


def executable_candidates() -> list[Path]:
    candidates: list[Path] = []
    override = os.environ.get("LIBREOFFICE_BIN")
    if override:
        candidates.append(Path(override).expanduser())
    for command in ("soffice", "libreoffice"):
        resolved = shutil.which(command)
        if resolved:
            candidates.append(Path(resolved))
    if sys.platform == "darwin":
        candidates.extend(
            [
                Path("/Applications/LibreOffice.app/Contents/MacOS/soffice"),
                Path("/opt/homebrew/bin/soffice"),
                Path("/usr/local/bin/soffice"),
            ]
        )
    elif os.name == "nt":
        for variable in ("ProgramFiles", "ProgramFiles(x86)"):
            root = os.environ.get(variable)
            if root:
                candidates.append(Path(root) / "LibreOffice" / "program" / "soffice.exe")
        local_app_data = os.environ.get("LOCALAPPDATA")
        if local_app_data:
            candidates.extend(
                [
                    Path(local_app_data)
                    / "Programs"
                    / "LibreOffice"
                    / "program"
                    / "soffice.exe",
                    Path(local_app_data)
                    / "LibreOffice"
                    / "program"
                    / "soffice.exe",
                ]
            )
    return candidates


def find_soffice() -> Path:
    for candidate in executable_candidates():
        if candidate.is_file():
            return candidate.resolve()
    raise RuntimeError(
        "LibreOffice est introuvable. Installe LibreOffice ou définis LIBREOFFICE_BIN."
    )


def run_command(command: list[str], timeout: int = 120) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        check=False,
        text=True,
        capture_output=True,
        timeout=timeout,
    )


def convert_to_pdf(docx_path: Path, output_dir: Path) -> Path:
    pdf_path = output_dir / f"{docx_path.stem}.pdf"
    if pdf_path.exists():
        pdf_path.unlink()
    temp_root = output_dir / "tmp"
    temp_root.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="openapply-lo-", dir=temp_root) as profile:
        profile_uri = Path(profile).resolve().as_uri()
        base = [
            str(find_soffice()),
            f"-env:UserInstallation={profile_uri}",
            "--headless",
            "--invisible",
            "--norestore",
            "--convert-to",
        ]
        direct = run_command(
            [*base, "pdf", "--outdir", str(output_dir), str(docx_path)]
        )
        if pdf_path.is_file() and pdf_path.stat().st_size > 0:
            return pdf_path

        odt = output_dir / f"{docx_path.stem}.odt"
        if odt.exists():
            odt.unlink()
        first = run_command(
            [*base, "odt", "--outdir", str(output_dir), str(docx_path)]
        )
        if odt.is_file():
            second = run_command(
                [*base, "pdf", "--outdir", str(output_dir), str(odt)]
            )
            if pdf_path.is_file() and pdf_path.stat().st_size > 0:
                odt.unlink(missing_ok=True)
                return pdf_path
            details = f"{second.stdout}\n{second.stderr}".strip()
        else:
            details = f"{first.stdout}\n{first.stderr}".strip()
        direct_details = f"{direct.stdout}\n{direct.stderr}".strip()
        raise RuntimeError(
            "LibreOffice n’a pas produit de PDF."
            + (f"\n{direct_details}" if direct_details else "")
            + (f"\n{details}" if details else "")
        )


def render_with_pymupdf(pdf_path: Path, output_dir: Path, dpi: int) -> list[Path]:
    try:
        import fitz
    except ImportError as error:
        raise RuntimeError(
            "PyMuPDF est requis pour produire les aperçus PNG. Lance l’installation des dépendances Python."
        ) from error
    images: list[Path] = []
    scale = dpi / 72
    with fitz.open(pdf_path) as document:
        for index, page in enumerate(document, start=1):
            target = output_dir / f"page-{index}.png"
            page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False).save(target)
            images.append(target)
    return images


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("docx_path", type=Path)
    parser.add_argument("--output_dir", type=Path, required=True)
    parser.add_argument("--emit_pdf", action="store_true")
    parser.add_argument("--dpi", type=int, default=150)
    args = parser.parse_args()

    docx_path = args.docx_path.expanduser().resolve()
    output_dir = args.output_dir.expanduser().resolve()
    if not docx_path.is_file():
        raise SystemExit(f"DOCX introuvable : {docx_path}")
    output_dir.mkdir(parents=True, exist_ok=True)
    for old_image in output_dir.glob("page-*.png"):
        old_image.unlink()

    try:
        pdf_path = convert_to_pdf(docx_path, output_dir)
        images = render_with_pymupdf(pdf_path, output_dir, max(72, min(args.dpi, 300)))
    except (RuntimeError, subprocess.TimeoutExpired) as error:
        print(str(error), file=sys.stderr)
        return 1

    if not images:
        print("Aucune page PNG n’a été produite.", file=sys.stderr)
        return 1
    if not args.emit_pdf:
        pdf_path.unlink(missing_ok=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
