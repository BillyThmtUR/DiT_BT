#!/usr/bin/env python3
"""
Telecharge les references scientifiques citees dans le cours WGAN-GP et annote
chaque PDF : les passages correspondant aux notions du cours sont surlignes,
avec un commentaire (popup) reprenant l'extrait du cours concerne.

Pourquoi ce script ?
La session distante utilisee pour preparer ce dossier n'a pas acces a
arxiv.org (egress limite a GitHub/PyPI par la politique reseau de la
session). Ce script doit donc etre execute dans un environnement avec acces
internet (poste local, ou future session avec un reseau moins restreint).

Usage :
    pip install -r requirements.txt
    python download_and_annotate.py

Les PDF annotes sont ecrits dans ce meme dossier (public/reference-wgan/), aux
cotes de ce script, afin d'etre servis directement par l'application (liens
"/reference-wgan/<fichier>.pdf" dans le cours WGAN-GP).
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
MANIFEST = HERE / "references.json"

ANNOTATION_TITLE = "Cours WGAN-GP - Billy Thomont"


def _ps_single_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def load_manifest() -> list[dict]:
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def download(url: str, dest: Path) -> None:
    if dest.exists():
        print(f"  -> {dest.name} deja present, telechargement ignore")
        return
    print(f"  -> telechargement : {url}")
    powershell = shutil.which("pwsh") or shutil.which("powershell")
    if powershell is None:
        raise RuntimeError("PowerShell introuvable pour telecharger le PDF")

    command = (
        "$ProgressPreference='SilentlyContinue'; "
        f"Invoke-WebRequest -Uri {_ps_single_quote(url)} "
        f"-OutFile {_ps_single_quote(str(dest))} "
        "-Headers @{'User-Agent'='Mozilla/5.0'}"
    )
    subprocess.run(
        [powershell, "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command],
        check=True,
    )
    print(f"  -> enregistre : {dest}")


def _existing_excerpts(doc) -> set[str]:
    """Contenus deja annotes (highlight ou note), pour eviter les doublons
    quand le script est relance sur un PDF deja traite."""
    seen = set()
    for page in doc:
        for annot in page.annots() or []:
            content = annot.info.get("content")
            if content:
                seen.add(content)
    return seen


def _remove_course_annotations(doc) -> None:
    """Supprime les anciennes annotations creees par ce script.

    Cela garde les PDF synchronises quand un extrait du cours est corrige dans
    references.json, sans toucher aux annotations personnelles eventuelles.
    """
    for page in doc:
        annot = page.first_annot
        while annot:
            next_annot = annot.next
            title = annot.info.get("title", "")
            if title.startswith(ANNOTATION_TITLE):
                page.delete_annot(annot)
            annot = next_annot


def annotate(pdf_path: Path, highlights: list[dict]) -> None:
    import fitz  # PyMuPDF

    doc = fitz.open(pdf_path)
    fallback_index = 0
    _remove_course_annotations(doc)
    already_annotated = _existing_excerpts(doc)

    for highlight in highlights:
        section = highlight["course_section"]
        excerpt = highlight["course_excerpt"]
        candidates = highlight["search_text"]

        if excerpt in already_annotated:
            print(f"     deja annote -> {section} (ignore)")
            continue

        located = False
        for candidate in candidates:
            for page in doc:
                rects = page.search_for(candidate)
                if not rects:
                    continue
                annot = page.add_highlight_annot(rects)
                annot.set_info(title=ANNOTATION_TITLE, content=excerpt)
                annot.update()
                print(
                    f'     surligne "{candidate}" (page {page.number + 1}) '
                    f"-> {section}"
                )
                located = True
                break
            if located:
                break

        if not located:
            page = doc[0]
            point = fitz.Point(36, 36 + 28 * fallback_index)
            note = page.add_text_annot(point, excerpt)
            note.set_info(title=f"{ANNOTATION_TITLE} ({section})")
            note.update()
            fallback_index += 1
            print(
                "     ATTENTION : aucun des textes recherches n'a ete trouve "
                f"({', '.join(candidates)!s}) pour la section « {section} » ; "
                "un commentaire (note) a ete ajoute en page 1."
            )

    doc.saveIncr()
    doc.close()


def main() -> int:
    references = load_manifest()

    for ref in references:
        print(f"\n== {ref['title']} — {ref['authors']} ({ref['year']}) ==")
        dest = HERE / ref["filename"]
        try:
            download(ref["pdf_url"], dest)
        except Exception as exc:  # noqa: BLE001 - on veut un message clair, pas un crash
            print(f"  !! Echec du telechargement ({exc}). PDF ignore.")
            continue

        try:
            annotate(dest, ref["highlights"])
        except Exception as exc:  # noqa: BLE001
            print(f"  !! Echec de l'annotation ({exc}).")
            return 1

    print("\nTermine. PDF annotes disponibles dans public/reference-wgan/.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
