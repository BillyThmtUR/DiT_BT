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
| 4 | **Ronneberger, Fischer & Brox (2015)**, *U-Net: Convolutional Networks for Biomedical Image Segmentation*, MICCAI 2015 — [arXiv:1505.04597](https://arxiv.org/abs/1505.04597) | Encart « Ni convolution, ni U-Net » |
| 5 | **Rombach et al. (2022)**, *High-Resolution Image Synthesis with Latent Diffusion Models*, CVPR 2022 — [arXiv:2112.10752](https://arxiv.org/abs/2112.10752) | Encart « Et pour nos séries RTE de 48 pas ? » (espace latent) |
| 6 | **Esser et al. (2024)**, *Scaling Rectified Flow Transformers for High-Resolution Image Synthesis* (Stable Diffusion 3 / MM-DiT), ICML 2024 — [arXiv:2403.03206](https://arxiv.org/abs/2403.03206) | Section « Pourquoi le DiT est passé devant », point 4 (validation par l'industrie) |
| 7 | **Chen et al. (2023)**, *PixArt-α: Fast Training of Diffusion Transformer for Photorealistic Text-to-Image Synthesis*, ICLR 2024 — [arXiv:2310.00426](https://arxiv.org/abs/2310.00426) | Section « Pourquoi le DiT est passé devant », point 4 (validation par l'industrie) |
| 8 | **Ho & Salimans (2022)**, *Classifier-Free Diffusion Guidance* — [arXiv:2207.12598](https://arxiv.org/abs/2207.12598) | Section « Pourquoi le DiT est passé devant », point 5 (guidance) |
| 9 | **Heusel et al. (2017)**, *GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium* (FID), NeurIPS 2017 — [arXiv:1706.08500](https://arxiv.org/abs/1706.08500) | Section « Pourquoi le DiT est passé devant », point 1 (FID) |
| 10 | **Dosovitskiy et al. (2020)**, *An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale* (ViT), ICLR 2021 — [arXiv:2010.11929](https://arxiv.org/abs/2010.11929) | Équation 4 (patchification) |
| 11 | **Ba, Kiros & Hinton (2016)**, *Layer Normalization* — [arXiv:1607.06450](https://arxiv.org/abs/1607.06450) | Équation 5 (adaLN) |
| 12 | **Dhariwal & Nichol (2021)**, *Diffusion Models Beat GANs on Image Synthesis*, NeurIPS 2021 — [arXiv:2105.05233](https://arxiv.org/abs/2105.05233) | Équation 5 (normalisation de groupe adaptative, précurseur de l'adaLN-Zero) |
| 13 | **Song & Ermon (2019)**, *Generative Modeling by Estimating Gradients of the Data Distribution*, NeurIPS 2019 — [arXiv:1907.05600](https://arxiv.org/abs/1907.05600) | Équation 6 (dynamique de Langevin) |
| 14 | **Song et al. (2021)**, *Score-Based Generative Modeling through Stochastic Differential Equations*, ICLR 2021 — [arXiv:2011.13456](https://arxiv.org/abs/2011.13456) | Équation 6 (lien avec les équations différentielles stochastiques) |
| 15 | **Nichol & Dhariwal (2021)**, *Improved Denoising Diffusion Probabilistic Models*, ICML 2021 — [arXiv:2102.09672](https://arxiv.org/abs/2102.09672) | Section « La Modélisation Continue : l'EMA » |
| 16 | **Rasul et al. (2021)**, *Autoregressive Denoising Diffusion Models for Multivariate Probabilistic Time Series Forecasting* (TimeGrad), ICML 2021 — [arXiv:2101.12072](https://arxiv.org/abs/2101.12072) | Section « Pour aller plus loin : la diffusion appliquée aux séries temporelles » |
| 17 | **Tashiro et al. (2021)**, *CSDI: Conditional Score-based Diffusion Models for Probabilistic Time Series Imputation*, NeurIPS 2021 — [arXiv:2107.03502](https://arxiv.org/abs/2107.03502) | Section « Pour aller plus loin : la diffusion appliquée aux séries temporelles » |
| 18 | **Alcaraz & Strodthoff (2022)**, *Diffusion-based Time Series Imputation and Forecasting with Structured State Space Models* (SSSD), TMLR 2023 — [arXiv:2208.09399](https://arxiv.org/abs/2208.09399) | Section « Pour aller plus loin : la diffusion appliquée aux séries temporelles » |

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
