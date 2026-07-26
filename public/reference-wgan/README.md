# Références scientifiques du cours WGAN-GP

Ce dossier réunit les articles scientifiques cités dans la partie **Cours**
(`src/data/wganCourseContent.html`) du module Wasserstein GAN avec Gradient
Penalty, ainsi que les outils pour les télécharger et les annoter. Il est
organisé exactement comme `public/reference/` (le dossier équivalent pour le
cours DiT), mais reste indépendant afin de ne pas mélanger les annotations
des deux cours sur un même PDF.

## ⚠️ État actuel : PDF non téléchargés dans cette session

Contrairement au dossier `public/reference/` (DiT), **les PDF listés ci-dessous
n'ont pas encore été téléchargés ni annotés** dans cette session de travail.

Raison : la politique réseau (egress) de cette session bloque explicitement
l'accès à `arxiv.org` (confirmé via le statut du proxy sortant : réponse
403, "destination host not allowed by your organization's egress policy for
this session"). Seuls GitHub, npm et PyPI sont accessibles. C'est exactement
la même limitation déjà documentée dans `public/reference/README.md` pour le
cours DiT — dont les PDF avaient pu être téléchargés lors d'une session (ou
un poste local) disposant d'un accès réseau plus large.

**Pour finaliser cette partie**, il suffit d'exécuter le script ci-dessous
depuis un environnement ayant accès à `arxiv.org` (poste local, ou toute
session avec une politique réseau moins restrictive) :

```bash
cd public/reference-wgan
pip install -r requirements.txt
python download_and_annotate.py
```

Une fois les PDF présents dans ce dossier, les liens `/reference-wgan/<fichier>.pdf`
déjà en place dans `wganCourseContent.html` fonctionneront immédiatement,
sans aucune autre modification du code.

## Références identifiées

| # | Référence | Cité dans le cours pour |
|---|-----------|--------------------------|
| 1 | **Goodfellow et al. (2014)**, *Generative Adversarial Networks*, NeurIPS 2014, [arXiv:1406.2661](https://arxiv.org/abs/1406.2661) | Section « Vue d'ensemble » (paradigme adversarial), Équation 1 (objectif minimax), optimum théorique de Nash |
| 2 | **Arjovsky, Chintala & Bottou (2017)**, *Wasserstein GAN*, ICML 2017, [arXiv:1701.07875](https://arxiv.org/abs/1701.07875) | Équation 3 (distance de Wasserstein / EMD), Équation 4 (weight clipping) |
| 3 | **Gulrajani et al. (2017)**, *Improved Training of Wasserstein GANs*, NeurIPS 2017, [arXiv:1704.00028](https://arxiv.org/abs/1704.00028) | Équation 5 (pénalité de gradient, λ=10), section N_critic |
| 4 | **Kingma & Ba (2014)**, *Adam: A Method for Stochastic Optimization*, ICLR 2015, [arXiv:1412.6980](https://arxiv.org/abs/1412.6980) | Équation 6 (optimiseur Adam, momentum/variance, β1/β2) |
| 5 | **Salimans et al. (2016)**, *Improved Techniques for Training GANs*, NeurIPS 2016, [arXiv:1606.03498](https://arxiv.org/abs/1606.03498) | Section « Pourquoi le WGAN-GP a détrôné le GAN classique » (mode collapse), section « Pour aller plus loin » |
| 6 | **Chen et al. (2018)**, *Model-Free Renewable Scenario Generation Using GANs*, IEEE Trans. Power Systems, [arXiv:1707.09676](https://arxiv.org/abs/1707.09676) | Application du GAN aux séries électriques (scénarios éoliens/solaires) |

Dans le cours, chaque mention de ces références est **surlignée** (style
`.ref-link`, défini dans `src/data/App.css`, partagé avec le cours DiT) et
pointe vers le PDF correspondant dans ce dossier
(`/reference-wgan/<fichier>.pdf`).

## Génération des PDF annotés

```bash
cd public/reference-wgan
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
   perdre aucune annotation ;
5. relancer le script sur un PDF déjà annoté remet à jour les annotations
   créées par ce script : les anciens surlignages/commentaires
   `Cours WGAN-GP - Billy Thomont` sont supprimés, puis les passages courants
   de `references.json` sont surlignés à nouveau.

Les PDF annotés sont enregistrés dans ce même dossier
(`public/reference-wgan/<fichier>.pdf`), et sont donc immédiatement servis
par l'application aux URLs `/reference-wgan/<fichier>.pdf` référencées dans
le cours.

## Fichier `references.json`

Décrit, pour chaque référence : titre, auteurs, année, venue, identifiant
arXiv, URL de téléchargement, nom de fichier local, et la liste des
passages à surligner avec leur extrait de cours associé. Pour ajouter une
nouvelle référence ou un nouveau passage à surligner, il suffit de compléter
ce fichier puis de relancer le script.
