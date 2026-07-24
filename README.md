# Diffusion Transformer (DiT)

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
