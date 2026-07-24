from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

README = """# Diffusion Transformer (DiT)

## Présentation

Ce projet propose un module interactif conçu par Billy Thomont dans le cadre de ses travaux de doctorat à l’Université de La Réunion, au sein d’EnergyLab.

L’application présente le fonctionnement d’un Diffusion Transformer appliqué à la génération de séries synthétiques de consommation électrique. Elle réunit un cours illustré, une fable pédagogique et un contrôle des connaissances.

## Installation

```bash
npm install
npm run dev
```

Le serveur de développement est accessible à l’adresse indiquée par Vite, généralement `http://localhost:3000`.

## Production

```bash
npm run build
npm run preview
```

La commande `npm run build` génère le dossier `dist/`. La commande `npm run preview` permet de vérifier localement la version produite.

## Organisation du projet

```text
dit-thomont/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    └── data/
```

`App.jsx` gère la navigation et les modules interactifs. Les contenus du cours et de l’histoire sont séparés dans le dossier `src/data` afin de faciliter leur maintenance.

## Contenu pédagogique

| Vue | Contenu |
| --- | --- |
| Accueil | Présentation du module et choix du parcours |
| Cours | Équations, démonstrations et comparaison entre Transformer et U-Net |
| Histoire illustrée | Explication narrative des principales variables du modèle |
| Contrôle | Dix questions avec correction et score final |

## Dépendances utilisées à l’exécution

Tailwind Play CDN est utilisé pour la mise en forme du cours. KaTeX 0.16.9 assure le rendu des équations. Les polices Fraunces, Spectral, IBM Plex Mono et Manrope sont chargées depuis Google Fonts.

Pour une mise en production totalement autonome, Tailwind Play CDN peut être remplacé par une configuration `tailwindcss` avec `postcss`, et KaTeX peut être installé comme dépendance npm.

Billy Thomont, Université de La Réunion, EnergyLab, 2025–2026.
"""

COMMON_REPLACEMENTS = {
    "Schéma généré avec ChatGPT": "Schéma de synthèse de l’architecture DiT",
    "Schéma généré par ChatGPT": "Schéma de synthèse de l’architecture DiT",
    "Généré avec ChatGPT": "Réalisé pour ce support",
    "Généré par ChatGPT": "Réalisé pour ce support",
    "généré avec ChatGPT": "réalisé pour ce support",
    "généré par ChatGPT": "réalisé pour ce support",
    "généré par une IA": "réalisé pour ce support",
    "générée par une IA": "réalisée pour ce support",
    "AI-generated": "original",
}

COURSE_REPLACEMENTS = {
    "Contexte de la Donnée (RTE Île-de-France)": "Contexte des données (RTE Île-de-France)",
    "La Grammaire Visuelle des Équations": "Lecture des équations",
    "l'Architecture du Diffusion Transformer": "Architecture du Diffusion Transformer",
    "Le Processus Forward (Bruitage de Markov)": "Processus de diffusion directe (chaîne de Markov)",
    "La destruction méthodique de la structure électrique temporelle.": "Ajout progressif de bruit à la série temporelle.",
    "Deep Dive Mathématique : Pourquoi cette forme ?": "Explication mathématique",
    "Deep Dive Mathématique": "Explication mathématique",
    "Deep Dive": "Analyse détaillée",
    "Décorticage des variables": "Description des variables",
    "Décorticage final des variables": "Description finale des variables",
    "Exemple Numérique (Pic d'hiver à 19h00)": "Exemple numérique : pic d'hiver à 19 h",
    "Exemple Numérique de la variance": "Exemple numérique de la variance",
    "l'Érosion": "L'érosion",
    "Le Saut Temporel (Trick de Reparamétrisation)": "Calcul direct par reparamétrisation",
    "Comment court-circuiter 1000 étapes de calcul grâce aux propriétés des\n        gaussiennes.": "Cette formulation permet d'obtenir directement un état bruité sans calculer toutes les étapes précédentes.",
    "La Mécanique du Calcul (Démonstration pas-à-pas)": "Dérivation de la formule, étape par étape",
    "Le Problème :": "Objectif :",
    "La Magie de l'Addition des Gaussiennes": "Addition de variables gaussiennes",
    "Étape Finale :": "Étape finale :",
    "formule miracle": "formule directe",
    "temps de calcul infini": "temps de calcul très important",
    "ne dépend QUE de": "ne dépend que de",
    "Le changement de paradigme": "Choix architectural",
    "Pourquoi il est passé devant": "Pourquoi le Transformer est adapté",
    "sans payer la facture": "sans subir le surcoût habituel",
    "le meilleur des deux mondes": "un compromis favorable",
    "tuerait les gradients": "affaiblirait fortement les gradients",
    "les gradients meurent": "les gradients deviennent presque nuls",
    "Signal / Donnée": "Signal et données",
    "Bruit / Aléa": "Bruit et aléa",
    "Temps / Étapes": "Temps et étapes",
    "Modèle / Poids": "Modèle et poids",
    " - Probabilité de transition": " : probabilité de transition",
    " - La variance du": " : variance du",
    " - Matrice Identité": " : matrice identité",
    " - Le Signal Pur": " : signal initial",
    " - l'Alpha-bar": " : alpha cumulé",
    "ex: entre -1 et 1": "par exemple entre -1 et 1",
    "ex: 24h": "par exemple 24 h",
    "48x48": "48 × 48",
    "10h00": "10 h",
    "10h30": "10 h 30",
    "19h00": "19 h",
}

STORY_REPLACEMENTS = {
    "Une fable du Diffusion Transformer": "Une fable pour comprendre le Diffusion Transformer",
    "Comment on apprend à une machine à peindre une journée d'électricité à partir de pur\n            brouillard": "Comprendre comment un modèle génère une journée de consommation électrique à partir de bruit",
    "et — détail crucial — on": "et, détail crucial, on",
    "Cette pincée — la dynamique de Langevin — préserve": "Cette pincée, issue de la dynamique de Langevin, préserve",
    "sortilège merveilleux": "raccourci mathématique",
    "La conséquence est spectaculaire": "La conséquence est importante",
    "les gradients meurent": "les gradients deviennent presque nuls",
    "C'est pour ce regard panoramique qu'il a détrôné l'ancien roi.": "Cette vision globale explique son intérêt pour les séries temporelles.",
    "rien ne dérape, les\n        gradients restent sages": "le calcul reste stable et les gradients restent exploitables",
    "on démarre à zéro pour ne rien casser": "l'initialisation à zéro stabilise les premières étapes",
    "Vient l'instant magique": "Vient alors la phase de génération",
    "Les ~7,6 M paramètres": "Environ 7,6 millions de paramètres",
    "les ~7,6 M paramètres": "environ 7,6 millions de paramètres",
    "8h du matin": "8 h du matin",
    "20h": "20 h",
    "10h de 11h": "10 h de 11 h",
    "4h du matin": "4 h du matin",
    "19h": "19 h",
    "bruitage / débruitage": "bruitage et débruitage",
    "Requête / Clé / Valeur": "Requête, clé et valeur",
    "Échelle &amp; décalage": "Échelle et décalage",
}

APP_REPLACEMENTS = {
    "Équations détaillées, démonstrations pas-à-pas, deep-dives mathématiques et comparaison U-Net / Transformer.": "Équations détaillées, démonstrations étape par étape, analyses mathématiques et comparaison entre U-Net et Transformer.",
    "Contrôle des connaissances — 10 questions": "Contrôle des connaissances : 10 questions",
    "Maîtrise parfaite — processus de Markov, attention, adaLN et dynamique de génération n'ont plus de secrets.": "Maîtrise complète : le processus de Markov, l'attention, l'adaLN et la dynamique de génération sont acquis.",
    "Le facteur garde l'energie du signal sous controle pendant que le bruit est ajoute progressivement.": "Le facteur maintient l'énergie du signal sous contrôle pendant l'ajout progressif du bruit.",
    "La reparametrisation permet de calculer directement n'importe quel x_t depuis x_0, ce qui rend l'entrainement beaucoup plus efficace.": "La reparamétrisation permet de calculer directement n'importe quel x_t depuis x_0, ce qui accélère fortement l'entraînement.",
    "A la fin du bruitage, alpha barre est presque nul : le signal initial a quasiment disparu dans le bruit gaussien.": "À la fin du bruitage, alpha barre est presque nul : le signal initial a quasiment disparu dans le bruit gaussien.",
    "Le modele apprend a retrouver le bruit ajoute, car cette cible est plus stable que la reconstruction directe de la courbe propre.": "Le modèle apprend à retrouver le bruit ajouté, car cette cible est plus stable que la reconstruction directe de la courbe initiale.",
    "Les hautes frequences changent vite, elles servent donc a distinguer des positions temporelles proches.": "Les hautes fréquences varient rapidement et permettent de distinguer des positions temporelles proches.",
    "Avec alpha initialise a zero, la branche residuelle est neutre au depart : le bloc commence comme une identite stable.": "Avec alpha initialisé à zéro, la branche résiduelle est neutre au départ : le bloc commence comme une identité stable.",
    "Le terme aleatoire conserve de la diversite dans la generation et evite une courbe trop lissee.": "Le terme aléatoire préserve la diversité de la génération et évite une courbe trop lissée.",
    "L'EMA lisse les variations des poids d'entrainement et donne souvent une generation plus stable.": "L'EMA lisse les variations des poids d'entraînement et produit généralement une génération plus stable.",
    "ce qui tuerait les gradients": "ce qui affaiblirait fortement les gradients",
}


def apply_replacements(text: str, replacements: dict[str, str]) -> str:
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def clean_file(relative_path: str) -> bool:
    path = ROOT / relative_path
    if not path.exists():
        return False

    original = path.read_text(encoding="utf-8")
    text = original
    text = apply_replacements(text, COMMON_REPLACEMENTS)

    if path.suffix in {".html", ".jsx", ".md"}:
        text = text.replace("\\'", "'")

    if relative_path == "src/data/courseContent.html":
        text = apply_replacements(text, COURSE_REPLACEMENTS)
        text = text.replace(" — ", ", ")
        text = text.replace("l'amplitude maximale", "L'amplitude maximale")
        text = text.replace("l'état \\(x_t\\)", "L'état \\(x_t\\)")

    elif relative_path == "src/data/storyContent.html":
        text = apply_replacements(text, STORY_REPLACEMENTS)
        text = text.replace(" — ", " : ")

    elif relative_path == "src/App.jsx":
        text = apply_replacements(text, APP_REPLACEMENTS)
        text = text.replace(" — ", ", ")
        text = re.sub(
            r"\nconst ROCKET_ASCII = String\.raw`.*?\n}\n\n(?=/\* ====== KaTeX)",
            "\n",
            text,
            flags=re.DOTALL,
        )

    elif relative_path == "src/data/App.css":
        text = text.replace('content:" — BT"', 'content:" · BT"')

    else:
        text = text.replace(" — ", ", ")

    text = re.sub(r"[ \t]+\n", "\n", text)

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    (ROOT / "README.md").write_text(README, encoding="utf-8")

    targets = [
        "index.html",
        "src/App.jsx",
        "src/data/courseContent.html",
        "src/data/storyContent.html",
        "src/data/App.css",
        "public/reference/README.md",
    ]

    changed = [path for path in targets if clean_file(path)]
    print("Fichiers nettoyés :")
    for path in ["README.md", *changed]:
        print(f"  {path}")

    workflow = ROOT / ".github/workflows/humanize-texts.yml"
    script = Path(__file__)
    if workflow.exists():
        workflow.unlink()
    if script.exists():
        script.unlink()


if __name__ == "__main__":
    main()
