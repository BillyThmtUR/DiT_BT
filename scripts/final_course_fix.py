from pathlib import Path

path = Path(__file__).resolve().parents[1] / "src/data/courseContent.html"
text = path.read_text(encoding="utf-8")

replacements = {
    "Cette équation est une <em>Chaîne de Markov</em>. L'état \\(x_t\\) ne\n        dépend uniquement de \\(x_{t-1}\\).": "Cette équation décrit une <em>chaîne de Markov</em>. L'état \\(x_t\\)\n        dépend uniquement de \\(x_{t-1}\\).",
    "<strong>\\( q(...) \\) : probabilité de transition :</strong> La": "<strong>\\( q(...) \\) : probabilité de transition</strong>. La",
    "><span class=\"color-noise\">\\(\\beta_t\\)</span> : variance du\n              bruit :</strong": "><span class=\"color-noise\">\\(\\beta_t\\)</span> : variance du\n              bruit</strong",
    "<strong>\\( I \\) : matrice identité (48 × 48) :</strong> Signifie que": "<strong>\\( I \\) : matrice identité (48 × 48)</strong>. Elle indique que",
    "(ex: \\(10^{-4}\\))": "(par exemple \\(10^{-4}\\))",
}

for old, new in replacements.items():
    text = text.replace(old, new)

path.write_text(text, encoding="utf-8")
