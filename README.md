# Diffusion Transformer (DiT)
### Cours interactif — Billy Thomont
**Université de La Réunion · EnergyLab**

---

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement (ouvre http://localhost:3000)
npm run dev
```

## Build de production

```bash
npm run build     # génère dist/
npm run preview   # prévisualise la build
```

---

## Structure

```
dit-thomont/
├── index.html          # page hôte + Tailwind Play CDN
├── vite.config.js      # configuration Vite
├── package.json
└── src/
    ├── main.jsx        # point d'entrée React
    └── App.jsx         # application complète (cours + histoire + quiz)
```

## Contenu

| Vue | Description |
|-----|-------------|
| **Accueil** | Écran d'entrée avec choix du parcours |
| **Cours** | Équations, démonstrations, Transformer vs U-Net |
| **Histoire illustrée** | Fable pédagogique — chaque variable est un personnage |
| **Contrôle** | Quiz interactif 10 questions avec score et niveau |

## Dépendances runtime (CDN)

- **Tailwind Play CDN** — style du contenu cours injecté dynamiquement
- **KaTeX 0.16.9** (cdnjs) — rendu des équations mathématiques
- **Google Fonts** — Fraunces, Spectral, IBM Plex Mono, Manrope

> Pour une build production sans CDN externe, remplacer Tailwind CDN
> par un setup `tailwindcss` + `postcss`, et KaTeX par `katex` npm.

---

*Billy Thomont · Université de La Réunion · EnergyLab · 2025–2026*
