# Références scientifiques du cours DiT

Ce dossier réunit les articles scientifiques cités dans la partie **Cours**
(`src/data/courseContent.html`) du module Diffusion Transformer, ainsi que
les outils pour les télécharger et les annoter.

## Références identifiées

| # | Référence | Cité dans le cours pour |
|---|-----------|--------------------------|
| 1 | **Sohl-Dickstein et al. (2015)**, *Deep Unsupervised Learning using Nonequilibrium Thermodynamics*, ICML 2015 — [arXiv:1503.03585](https://arxiv.org/abs/1503.03585) | Section « Vue d'ensemble » (origine du paradigme forward/reverse), Équation 1 (chaîne de Markov de diffusion générale), Équation 3 (borne variationnelle à l'origine de la perte, simplifiée par Ho et al. 2020) |
| 2 | **Kingma & Welling (2013)**, *Auto-Encoding Variational Bayes*, ICLR 2014 — [arXiv:1312.6114](https://arxiv.org/abs/1312.6114) | Équation 2 (origine du « reparameterization trick » repris pour \(x_t = \sqrt{\bar\alpha_t}x_0 + \sqrt{1-\bar\alpha_t}\epsilon\)) |
| 3 | **Ho, Jain & Abbeel (2020)**, *Denoising Diffusion Probabilistic Models*, NeurIPS 2020 — [arXiv:2006.11239](https://arxiv.org/abs/2006.11239) | Équation 1 (processus forward de Markov), Équation 2 (trick de reparamétrisation), Équation 3 (fonction de perte — prédire le bruit ε), Équation 6 (reverse loop / dynamique de Langevin) |
| 4 | **Peebles & Xie (2023)**, *Scalable Diffusion Models with Transformers*, ICCV 2023 — [arXiv:2212.09748](https://arxiv.org/abs/2212.09748) | Section « Pourquoi le DiT est passé devant » (loi d'échelle, FID, DiT-XL/2), Équation 5 (bloc DiT et adaLN-Zero) |
| 5 | **Vaswani et al. (2017)**, *Attention Is All You Need*, NeurIPS 2017 — [arXiv:1706.03762](https://arxiv.org/abs/1706.03762) | Section « Le cœur : l'auto-attention » (Attention(Q,K,V)), Équation 4 (encodage positionnel sine/cosine) |
| 6 | **Rombach et al. (2022)**, *High-Resolution Image Synthesis with Latent Diffusion Models*, CVPR 2022 — [arXiv:2112.10752](https://arxiv.org/abs/2112.10752) | Encart « Et pour nos séries RTE de 48 pas ? » (espace latent) |
| 7 | **Ho & Salimans (2022)**, *Classifier-Free Diffusion Guidance* — [arXiv:2207.12598](https://arxiv.org/abs/2207.12598) | Section « Pourquoi le DiT est passé devant », point 5 (guidance) |
| 8 | **Ba, Kiros & Hinton (2016)**, *Layer Normalization* — [arXiv:1607.06450](https://arxiv.org/abs/1607.06450) | Équation 5 (adaLN) |
| 9 | **Dhariwal & Nichol (2021)**, *Diffusion Models Beat GANs on Image Synthesis*, NeurIPS 2021 — [arXiv:2105.05233](https://arxiv.org/abs/2105.05233) | Équation 5 (normalisation de groupe adaptative, précurseur de l'adaLN-Zero) |
| 10 | **Song & Ermon (2019)**, *Generative Modeling by Estimating Gradients of the Data Distribution*, NeurIPS 2019 — [arXiv:1907.05600](https://arxiv.org/abs/1907.05600) | Équation 6 (dynamique de Langevin) |
| 11 | **Song et al. (2021)**, *Score-Based Generative Modeling through Stochastic Differential Equations*, ICLR 2021 — [arXiv:2011.13456](https://arxiv.org/abs/2011.13456) | Équation 6 (lien avec les équations différentielles stochastiques) |
| 12 | **Nichol & Dhariwal (2021)**, *Improved Denoising Diffusion Probabilistic Models*, ICML 2021 — [arXiv:2102.09672](https://arxiv.org/abs/2102.09672) | Section « La Modélisation Continue : l'EMA » |
| 13 | **Rasul et al. (2021)**, *Autoregressive Denoising Diffusion Models for Multivariate Probabilistic Time Series Forecasting* (TimeGrad), ICML 2021 — [arXiv:2101.12072](https://arxiv.org/abs/2101.12072) | Section « Pour aller plus loin : la diffusion appliquée aux séries temporelles » |
| 14 | **Tashiro et al. (2021)**, *CSDI: Conditional Score-based Diffusion Models for Probabilistic Time Series Imputation*, NeurIPS 2021 — [arXiv:2107.03502](https://arxiv.org/abs/2107.03502) | Section « Pour aller plus loin : la diffusion appliquée aux séries temporelles » |
| 15 | **Alcaraz & Strodthoff (2022)**, *Diffusion-based Time Series Imputation and Forecasting with Structured State Space Models* (SSSD), TMLR 2023 — [arXiv:2208.09399](https://arxiv.org/abs/2208.09399) | Section « Pour aller plus loin : la diffusion appliquée aux séries temporelles » |
| 16 | **Zhou et al. (2021)**, *Informer: Beyond Efficient Transformer for Long Sequence Time-Series Forecasting*, AAAI 2021 — [arXiv:2012.07436](https://arxiv.org/abs/2012.07436) | Encart « Transformers pour séries longues » (attention ProbSparse, jeux de données électriques ECL/ETT) |
| 17 | **Wu et al. (2021)**, *Autoformer: Decomposition Transformers with Auto-Correlation for Long-Term Series Forecasting*, NeurIPS 2021 — [arXiv:2106.13008](https://arxiv.org/abs/2106.13008) | Encart « Transformers pour séries longues » (corrélation automatique, jeux de données électriques ECL/ETT) |
| 18 | **Chen et al. (2018)**, *Model-Free Renewable Scenario Generation Using Generative Adversarial Networks*, IEEE Trans. Power Systems — [arXiv:1707.09676](https://arxiv.org/abs/1707.09676) | Section « Pourquoi le DiT est passé devant », point 1 (loi d'échelle / scénarios renouvelables) |
| 19 | **Wang et al. (2023)**, *DiffLoad: Uncertainty Quantification in Energy Load Forecasting with Diffusion Model* — [arXiv:2306.01001](https://arxiv.org/abs/2306.01001) | Section « Pourquoi le DiT est passé devant », point 4 (validation par le domaine de l'énergie) |
| 20 | **Wen et al. (2023)**, *DiffSTG: Probabilistic Spatio-Temporal Graph Forecasting with Denoising Diffusion Models*, SIGSPATIAL 2023 — [arXiv:2301.13629](https://arxiv.org/abs/2301.13629) | Section « Pourquoi le DiT est passé devant », point 4 (validation par le domaine de l'énergie) |

Dans le cours, chaque mention de ces références est **surlignée** (style
`.ref-link`, défini dans `src/data/App.css`) et pointe directement vers le PDF
correspondant dans ce dossier (`/reference/<fichier>.pdf`).

## Génération des PDF annotés

```bash
cd public/reference
pip install -r requirements.txt
python download_and_annotate.py
```

Certains environnements cassent la vérification TLS vers `arxiv.org` (proxy
sortant, magasin de certificats incomplet) sans bloquer réellement l'accès
réseau : le script retente alors automatiquement le téléchargement sans
vérification du certificat plutôt que d'abandonner (voir `download()` dans
`download_and_annotate.py`).

Le script :

1. télécharge chaque PDF depuis arXiv (URL définie dans `references.json`) ;
2. recherche, dans le texte du PDF, le passage correspondant à chaque
   notion du cours (`highlights[].search_text`, plusieurs variantes
   candidates par sécurité) ;
3. **surligne** ce passage et y attache un **commentaire** contenant l'extrait
   du cours concerné (`highlights[].course_excerpt`) ;
4. si aucun des textes candidats n'est trouvé, ajoute tout de même le
   commentaire sous forme de note (icône commentaire) en page 1, pour ne
   perdre aucune annotation ;
5. relancer le script sur un PDF déjà annoté n'ajoute pas de doublon : les
   extraits déjà présents sont détectés et ignorés.

Les PDF annotés sont enregistrés dans ce même dossier
(`public/reference/<fichier>.pdf`), et sont donc immédiatement servis par
l'application aux URLs `/reference/<fichier>.pdf` référencées dans le cours.

## Fichier `references.json`

Décrit, pour chaque référence : titre, auteurs, année, venue, identifiant
arXiv, URL de téléchargement, nom de fichier local, et la liste des
passages à surligner avec leur extrait de cours associé. Pour ajouter une
nouvelle référence ou un nouveau passage à surligner, il suffit de compléter
ce fichier puis de relancer le script.
