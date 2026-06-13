# Références scientifiques du cours DiT

Ce dossier réunit les articles scientifiques cités dans la partie **Cours**
(`src/data/courseContent.html`) du module Diffusion Transformer, ainsi que
les outils pour les télécharger et les annoter.

## Références identifiées

| # | Référence | Cité dans le cours pour |
|---|-----------|--------------------------|
| 1 | **Ho, Jain & Abbeel (2020)**, *Denoising Diffusion Probabilistic Models*, NeurIPS 2020 — [arXiv:2006.11239](https://arxiv.org/abs/2006.11239) | Équation 1 (processus forward de Markov), Équation 2 (trick de reparamétrisation), Équation 3 (fonction de perte — prédire le bruit ε), Équation 6 (reverse loop / dynamique de Langevin) |
| 2 | **Peebles & Xie (2023)**, *Scalable Diffusion Models with Transformers*, ICCV 2023 — [arXiv:2212.09748](https://arxiv.org/abs/2212.09748) | Section « Pourquoi le DiT est passé devant » (loi d'échelle, FID, DiT-XL/2), Équation 5 (bloc DiT et adaLN-Zero) |
| 3 | **Vaswani et al. (2017)**, *Attention Is All You Need*, NeurIPS 2017 — [arXiv:1706.03762](https://arxiv.org/abs/1706.03762) | Section « Le cœur : l'auto-attention » (Attention(Q,K,V)), Équation 4 (encodage positionnel sine/cosine) |

Dans le cours, chaque mention de ces références est **surlignée** (style
`.ref-link`, défini dans `src/data/App.css`) et pointe directement vers le PDF
correspondant dans ce dossier (`/reference/<fichier>.pdf`).

## Génération des PDF annotés

La session ayant servi à préparer ce dossier n'a pas d'accès réseau vers
`arxiv.org` (seuls GitHub et PyPI sont accessibles). Le script
`download_and_annotate.py` doit donc être exécuté **localement** (ou dans une
session disposant d'un accès internet plus large) :

```bash
cd public/reference
pip install -r requirements.txt
python download_and_annotate.py
```

Le script :

1. télécharge chaque PDF depuis arXiv (URL définie dans `references.json`) ;
2. recherche, dans le texte du PDF, le passage correspondant à chaque
   notion du cours (`highlights[].search_text`, plusieurs variantes
   candidates par sécurité) ;
3. **surligne** ce passage et y attache un **commentaire** contenant l'extrait
   du cours concerné (`highlights[].course_excerpt`) ;
4. si aucun des textes candidats n'est trouvé, ajoute tout de même le
   commentaire sous forme de note (icône commentaire) en page 1, pour ne
   perdre aucune annotation.

Les PDF annotés sont enregistrés dans ce même dossier
(`public/reference/<fichier>.pdf`), et sont donc immédiatement servis par
l'application aux URLs `/reference/<fichier>.pdf` référencées dans le cours.

## Fichier `references.json`

Décrit, pour chaque référence : titre, auteurs, année, venue, identifiant
arXiv, URL de téléchargement, nom de fichier local, et la liste des
passages à surligner avec leur extrait de cours associé. Pour ajouter une
nouvelle référence ou un nouveau passage à surligner, il suffit de compléter
ce fichier puis de relancer le script.
