import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Feather, ClipboardCheck, ArrowRight, ArrowLeft, Home, Check, X, RotateCcw, Sparkles, Swords } from "lucide-react";
import schemaImg from '../img/graphique.png'
import ProgressBar from "./components/ProgressBar";
import COURSE_HTML from './data/courseContent.html?raw';
import STORY_CSS from './data/story.css?raw';
import STORY_HTML from './data/storyContent.html?raw';
import WGAN_COURSE_HTML from './data/wganCourseContent.html?raw';
import WGAN_STORY_HTML from './data/wganStoryContent.html?raw';
import APP_CSS from './data/App.css?raw';

/* ====== CONTENU INJECTÉ : DiT ====== */
const QUESTIONS_DIT = [{"q": "Dans le processus forward (Éq. 1), à quoi sert le facteur \\(\\sqrt{1-\\beta_t}\\) appliqué à \\(x_{t-1}\\) ?", "options": ["À accélérer les calculs vectoriels sur GPU.", "À contenir la variance globale du signal afin d'éviter son explosion asymptotique au fil des étapes.", "À augmenter la profondeur effective du réseau de neurones."], "correct": 1}, {"q": "Quel est l'avantage principal du trick de reparamétrisation (Éq. 2) pour l'entraînement ?", "options": ["Il réduit la taille du modèle de moitié en supprimant les couches intermédiaires.", "Il impose une distribution uniforme au bruit pour stabiliser le gradient.", "Il permet d'obtenir \\(x_t\\) directement depuis \\(x_0\\) en \\(\\mathcal{O}(1)\\), sans dérouler les 1000 étapes de bruitage."], "correct": 2}, {"q": "Que vaut approximativement \\(\\bar{\\alpha}_t\\) à la dernière itération (\\(t = 999\\)) ?", "options": ["Une valeur proche de 1 : le signal original est quasi-intégralement préservé.", "Exactement 0,5 : signal et bruit sont à parts égales.", "Une valeur tendant vers 0 : le bruit blanc gaussien domine totalement."], "correct": 2}, {"q": "Quel est l'objectif prédictif du modèle \\(\\epsilon_\\theta\\) lors de la minimisation de la fonction de perte (Éq. 3) ?", "options": ["Estimer directement la courbe de consommation sans bruit \\(x_0\\).", "Identifier le vecteur de bruit gaussien \\(\\epsilon\\) injecté lors de la corruption forward.", "Prédire les pas de temps futurs à partir de la série temporelle brute."], "correct": 1}, {"q": "Dans le mécanisme d'auto-attention, pourquoi divise-t-on le produit \\(QK^\\top\\) par \\(\\sqrt{d_k}\\) ?", "options": ["Pour normaliser les poids entre 0 et 1 avant la softmax, indépendamment de la séquence.", "Pour éviter que les scores ne croissent avec la dimension et saturent la softmax, ce qui affaiblirait fortement les gradients.", "Pour réduire le coût quadratique de l'attention à un coût linéaire."], "correct": 1}, {"q": "Quelle est la différence fondamentale entre le champ réceptif d'un U-Net convolutif et celui d'un Transformer ?", "options": ["Le U-Net a un champ réceptif global dès la première couche grâce aux skip-connections.", "Le Transformer dispose d'un champ réceptif global dès la première couche, là où le U-Net ne l'acquiert que progressivement via empilement et pooling.", "Les deux architectures ont un champ réceptif identique ; seul le coût de calcul diffère."], "correct": 1}, {"q": "Dans l'encodage positionnel (Éq. 4), à quoi correspondent les dimensions de haute fréquence (indices \\(i\\) faibles) ?", "options": ["Elles encodent le contexte global (matin vs soir) grâce à des oscillations lentes.", "Elles oscillent vite pour différencier des patches temporellement proches (ex. 10h de 11h).", "Elles encodent l'amplitude maximale observée (13 325 kWh) pour calibrer la normalisation."], "correct": 1}, {"q": "Dans l'adaLN-Zero (Éq. 5), quelle est la conséquence directe d'initialiser \\(\\alpha = 0\\) en début d'entraînement ?", "options": ["Le bloc se comporte comme une identité (\\(x_{l+1} = x_l\\)), stabilisant les gradients dès les premières itérations.", "Le bruit résiduel du vecteur latent est effacé préventivement.", "L'attention multi-têtes est désactivée pour économiser de la mémoire GPU."], "correct": 0}, {"q": "Lors du reverse process (Éq. 6), pourquoi ajoute-t-on le terme stochastique \\(\\sigma_t z\\) à chaque étape (sauf la dernière) ?", "options": ["Pour compenser la perte d'énergie due à la soustraction itérative du bruit estimé.", "Pour forcer le modèle à explorer toutes les étapes forward en sens inverse.", "Pour prévenir le lissage excessif et conserver les variations asymétriques propres aux charges électriques (dynamique de Langevin)."], "correct": 2}, {"q": "Pourquoi l'algorithme de génération utilise-t-il les poids EMA plutôt que les poids d'entraînement bruts ?", "options": ["Les poids EMA sont plus légers en mémoire car ils fusionnent les couches redondantes.", "L'EMA filtre la variance due aux batchs atypiques et représente la tendance consolidée de ~1000 itérations, produisant des courbes générées plus stables.", "Les poids bruts sont réservés à l'inférence conditionnelle sur de nouvelles données RTE."], "correct": 1}];
const EXPLANATIONS_DIT = [
  "Le facteur maintient l'énergie du signal sous contrôle pendant l'ajout progressif du bruit.",
  "La reparamétrisation permet de calculer directement n'importe quel x_t depuis x_0, ce qui accélère fortement l'entraînement.",
  "À la fin du bruitage, alpha barre est presque nul : le signal initial a quasiment disparu dans le bruit gaussien.",
  "Le modèle apprend à retrouver le bruit ajouté, car cette cible est plus stable que la reconstruction directe de la courbe initiale.",
  "Sans la division par racine de d_k, les scores d'attention deviennent trop grands et la softmax peut saturer.",
  "L'attention du Transformer met tous les tokens en relation tout de suite ; le U-Net construit ce contexte global plus progressivement.",
  "Les hautes fréquences varient rapidement et permettent de distinguer des positions temporelles proches.",
  "Avec alpha initialisé à zéro, la branche résiduelle est neutre au départ : le bloc commence comme une identité stable.",
  "Le terme aléatoire préserve la diversité de la génération et évite une courbe trop lissée.",
  "L'EMA lisse les variations des poids d'entraînement et produit généralement une génération plus stable."
];

/* ====== CONTENU INJECTÉ : WGAN-GP ====== */
const QUESTIONS_WGAN = [
  { "q": "Dans l'objectif minimax du GAN (Éq. 1), que cherche à maximiser le Générateur lorsqu'il minimise \\(\\mathbb{E}_{z\\sim p_z}[\\log(1-D(G(z)))]\\) ?", "options": ["La variance du bruit latent \\(z\\).", "Le score \\(D(G(z))\\) : tromper le Discriminateur en faisant passer ses créations pour réelles.", "La vitesse de convergence de l'algorithme Adam."], "correct": 1 },
  { "q": "À l'optimum théorique de Nash, si le Générateur a parfaitement appris \\(P_g = P_{data}\\), que vaut le Discriminateur optimal \\(D^*(x)\\) ?", "options": ["\\(D^*(x) = 1\\) pour toute donnée réelle.", "\\(D^*(x) = 0\\) pour toute donnée générée.", "\\(D^*(x) = 1/2\\) pour tout \\(x\\) : le Discriminateur ne fait plus que deviner au hasard."], "correct": 2 },
  { "q": "Une fois le Discriminateur optimal \\(D^*\\) substitué dans la loss, à quoi celle-ci est-elle égale ?", "options": ["Deux fois la divergence de Jensen-Shannon moins \\(\\log 4\\).", "La distance de Wasserstein entre \\(P_{data}\\) et \\(P_g\\).", "L'erreur quadratique moyenne entre \\(x\\) et \\(G(z)\\)."], "correct": 0 },
  { "q": "Pourquoi le GAN classique souffre-t-il de vanishing gradient quand \\(P_{data}\\) et \\(P_g\\) ne se chevauchent pas ?", "options": ["Parce que le Discriminateur cesse alors de s'entraîner.", "Parce que la JSD atteint sa valeur maximale \\(\\log 2\\) et reste plate : le gradient reçu par le Générateur devient nul.", "Parce que le bruit latent \\(z\\) devient corrélé au signal \\(x\\)."], "correct": 1 },
  { "q": "Quel avantage central la distance de Wasserstein apporte-t-elle par rapport à la JSD ?", "options": ["Elle est toujours bornée entre 0 et \\(\\log 2\\), comme la JSD.", "Elle reste mesurable et fournit un gradient non nul même quand les deux distributions ne se chevauchent pas.", "Elle ne nécessite plus aucun réseau Discriminateur ou Critique."], "correct": 1 },
  { "q": "Que réalise la dualité de Kantorovich-Rubinstein, \\(W(p,q)=\\sup_{\\|f\\|_L\\le 1}\\dots\\) ?", "options": ["Elle transforme le problème de minimisation du plan de transport (\\(\\inf\\)) en un problème de maximisation (\\(\\sup\\)) sur des fonctions 1-Lipschitz.", "Elle calcule directement le plan de transport optimal \\(\\gamma\\) point par point.", "Elle remplace la fonction de perte par une simple accuracy de classification."], "correct": 0 },
  { "q": "Pourquoi impose-t-on une contrainte de Lipschitz (\\(\\|f\\|_L \\le 1\\)) au Critique \\(f_w\\) ?", "options": ["Pour accélérer le calcul du gradient sur GPU.", "Sans elle, le Critique pourrait donner des scores tendant vers \\(+\\infty\\) et \\(-\\infty\\), ce qui ferait exploser les gradients.", "Pour permettre au Générateur de sauter des itérations d'entraînement."], "correct": 1 },
  { "q": "Quel est le principal défaut du weight clipping (\\(w \\leftarrow \\text{clip}(w,-c,c)\\)) utilisé dans le WGAN original ?", "options": ["Il ne respecte pas du tout la contrainte de Lipschitz.", "Il force le Critique vers des fonctions quasi-linéaires, réduisant artificiellement sa capacité d'expression.", "Il augmente la variance du bruit latent \\(z\\)."], "correct": 1 },
  { "q": "Dans la pénalité de gradient du WGAN-GP, \\(\\lambda\\, \\mathbb{E}[(\\|\\nabla_{\\hat{x}} f_w(\\hat{x})\\|_2 - 1)^2]\\), que se passe-t-il si \\(\\lambda\\) est choisi trop grand ?", "options": ["Le Critique devient trop contraint et quasi-linéaire, incapable de discriminer finement les distributions.", "La contrainte de Lipschitz n'est plus du tout respectée.", "Le Générateur cesse de recevoir un quelconque gradient."], "correct": 0 },
  { "q": "Pourquoi passe-t-on de \\(\\beta_1=0.5\\) (GAN classique) à \\(\\beta_1=0\\) dans Adam pour le WGAN-GP (avec \\(N_{critic}=10\\)) ?", "options": ["Pour augmenter l'inertie du Critique et lisser ses 10 itérations successives.", "Pour annuler le momentum (\\(m_t = g_t\\)) : le Critique doit s'adapter instantanément à chaque itération sans être biaisé par les gradients passés.", "Parce que \\(\\beta_1\\) contrôle directement la valeur du coefficient \\(\\lambda\\) de la pénalité de gradient."], "correct": 1 }
];
const EXPLANATIONS_WGAN = [
  "Le Générateur ne voit jamais les vraies données ; son seul signal est le score que le Discriminateur donne à ses propres créations, qu'il cherche donc à maximiser.",
  "À l'équilibre parfait, le Discriminateur ne peut plus distinguer le vrai du faux : il retombe sur une probabilité de 1/2 partout, comme un tirage à pile ou face.",
  "En substituant le Discriminateur optimal dans la loss du GAN, on montre qu'elle est algébriquement égale à deux fois la JSD entre les deux distributions, moins la constante log 4.",
  "Quand les distributions ne se recouvrent pas, la JSD sature à sa valeur maximale log 2 : la pente devient nulle et le Générateur ne reçoit plus aucune indication de direction.",
  "Contrairement à la JSD binaire, la distance de Wasserstein mesure un véritable effort de transport, qui reste non nul et informatif même sans recouvrement des distributions.",
  "Calculer directement l'infimum sur tous les plans de transport est trop coûteux ; la dualité de Kantorovich-Rubinstein permet de le réécrire comme un supremum sur des fonctions 1-Lipschitz, bien plus simple à optimiser avec un réseau de neurones.",
  "Sans contrainte de vitesse sur ses variations, le Critique pourrait séparer arbitrairement les scores réels et générés à l'infini, rendant l'entraînement instable.",
  "En bornant les poids dans un intervalle étroit, on limite mécaniquement l'expressivité du réseau à des fonctions presque linéaires, bien en-deçà de ce qu'un réseau profond peut représenter.",
  "Une pénalité trop forte impose une contrainte de Lipschitz si stricte que le Critique perd sa capacité à distinguer finement les distributions, et l'estimation de la distance de Wasserstein devient imprécise.",
  "Avec béta1 = 0, la formule du momentum devient m_t = g_t : aucune mémoire des gradients passés, ce qui permet au Critique de réagir immédiatement à chacune de ses dix itérations sans latence."
];

/* ====== Rangs du quiz, par sujet ====== */
function ditRank(score, total) {
  if (score === total) return { t: "Niveau : Expert", c: "#60a5fa", d: "Maîtrise complète : le processus de Markov, l'attention, l'adaLN et la dynamique de génération sont acquis." };
  if (score >= 7) return { t: "Niveau : Solide", c: "#34d399", d: "Très bonne compréhension. Quelques détails techniques restent à consolider, mais la structure globale est acquise." };
  if (score >= 4) return { t: "Niveau : En construction", c: "#fbbf24", d: "Les bases sont là. Relisez les sections sur le forward process, l'attention et l'EMA pour solidifier l'ensemble." };
  return { t: "Niveau : À reprendre", c: "#f87171", d: "Pas grave : le Diffusion Transformer n'est pas une promenade au Barachois. Reprenez le cours, puis retentez." };
}
function wganRank(score, total) {
  if (score === total) return { t: "Niveau : Expert", c: "#60a5fa", d: "Maîtrise complète : la divergence de Jensen-Shannon, la distance de Wasserstein, la dualité de Kantorovich-Rubinstein et la pénalité de gradient sont acquises." };
  if (score >= 7) return { t: "Niveau : Solide", c: "#34d399", d: "Très bonne compréhension du duel adversarial. Quelques détails sur la contrainte de Lipschitz ou l'optimiseur Adam restent à consolider." };
  if (score >= 4) return { t: "Niveau : En construction", c: "#fbbf24", d: "Les bases sont là. Relisez les sections sur le vanishing gradient, la distance de Wasserstein et la pénalité de gradient." };
  return { t: "Niveau : À reprendre", c: "#f87171", d: "Pas grave : le duel Générateur/Critique n'est pas une promenade au Barachois. Reprenez le cours, puis retentez." };
}

/* ====== Sujets disponibles ====== */
const TOPICS = {
  dit: {
    key: "dit",
    landingTitle: "Diffusion Transformer",
    landingSub: "DiT",
    landingDesc: "Bruitage progressif, auto-attention et adaLN-Zero : la génération par débruitage itératif.",
    landingIcon: Sparkles,
    landingClass: "c-topic-dit",
    titleHtml: "Diffusion<br /><em>Transformer</em>",
    introSub: "Un module interactif pour comprendre le bruitage, le débruitage, l'attention et la génération de séries de consommation électrique synthétiques.",
    courseDesc: "Équations détaillées, démonstrations étape par étape, analyses mathématiques et comparaison entre U-Net et Transformer.",
    storyDesc: "Chaque variable devient un personnage. Tout le cycle d'entraînement raconté comme une fable, du Jour Zéro à la création.",
    quizCtaLabel: "Contrôle des connaissances : 10 questions",
    quizModuleTitle: "Module d'Évaluation DiT",
    quizSub: "Validez votre compréhension des concepts mathématiques abordés.",
    endCtaText: "10 questions pour valider les concepts clés du Diffusion Transformer.",
    courseHtml: COURSE_HTML,
    storyHtml: STORY_HTML,
    questions: QUESTIONS_DIT,
    explanations: EXPLANATIONS_DIT,
    rank: ditRank,
    hasSchema: true,
  },
  wgan: {
    key: "wgan",
    landingTitle: "WGAN-GP",
    landingSub: "Wasserstein GAN + Gradient Penalty",
    landingDesc: "Générateur contre Critique : distance de Wasserstein, pénalité de gradient et stabilité adversariale.",
    landingIcon: Swords,
    landingClass: "c-topic-wgan",
    titleHtml: "Wasserstein GAN<br /><em>Gradient Penalty</em>",
    introSub: "Un module interactif pour comprendre le duel Générateur/Critique, la distance de Wasserstein et la génération adversariale de séries de consommation électrique synthétiques.",
    courseDesc: "Équations détaillées, démonstrations étape par étape, et comparaison entre GAN classique et WGAN-GP.",
    storyDesc: "Le Faussaire et l'Arpenteur : le duel adversarial raconté comme une fable, du mur de brume à la création.",
    quizCtaLabel: "Contrôle des connaissances : 10 questions",
    quizModuleTitle: "Module d'Évaluation WGAN-GP",
    quizSub: "Validez votre compréhension du duel adversarial et de la distance de Wasserstein.",
    endCtaText: "10 questions pour valider les concepts clés du WGAN-GP.",
    courseHtml: WGAN_COURSE_HTML,
    storyHtml: WGAN_STORY_HTML,
    questions: QUESTIONS_WGAN,
    explanations: EXPLANATIONS_WGAN,
    rank: wganRank,
    hasSchema: false,
  },
};

/* ====== KaTeX (chargé à la volée depuis CDN) ====== */
let katexPromise = null;
function loadKatex() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.renderMathInElement) return Promise.resolve();
  if (katexPromise) return katexPromise;
  katexPromise = new Promise((resolve) => {
    const base = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/";
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = base + "katex.min.css";
    document.head.appendChild(css);
    const s1 = document.createElement("script");
    s1.src = base + "katex.min.js";
    s1.onload = () => {
      const s2 = document.createElement("script");
      s2.src = base + "contrib/auto-render.min.js";
      s2.onload = () => resolve();
      s2.onerror = () => resolve();
      document.head.appendChild(s2);
    };
    s1.onerror = () => resolve();
    document.head.appendChild(s1);
  });
  return katexPromise;
}
function typeset(el) {
  if (el && window.renderMathInElement) {
    try {
      window.renderMathInElement(el, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
        throwOnError: false,
      });
    } catch (e) {}
  }
}
function useKatex(ref, dep) {
  useEffect(() => {
    let mounted = true;
    loadKatex().then(() => {
      if (mounted) setTimeout(() => typeset(ref.current), 30);
    });
    return () => { mounted = false; };
  }, [dep]);
}

function useInteractiveParallax(view) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const root = document.documentElement;
    let raf = 0;

    const updateScrollParallax = () => {
      raf = 0;
      const viewportCenter = window.innerHeight / 2;
      const items = document.querySelectorAll(".parallax-item");
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const distance = rect.top + rect.height / 2 - viewportCenter;
        const depth = Number(item.dataset.depth || 1);
        const y = Math.max(-18, Math.min(18, -distance * 0.018 * depth));
        item.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
      });
      if (view === "intro" || view === "landing") {
        root.style.setProperty("--intro-scroll-y", `${Math.min(window.scrollY * 0.08, 34).toFixed(2)}px`);
      }
    };

    const requestScrollUpdate = () => {
      if (!raf) raf = window.requestAnimationFrame(updateScrollParallax);
    };

    let observer = null;

    const decorateScrollItems = () => {
      document.querySelectorAll(".parallax-item").forEach((item) => item.classList.remove("parallax-item"));
      document.querySelectorAll(".scroll-fade").forEach((item) => item.classList.remove("scroll-fade", "is-visible"));
      if (view === "cours") {
        document
          .querySelectorAll(".course-scope header, .course-scope section, .course-scope .deep-dive, .course-scope figure")
          .forEach((item, index) => {
            item.classList.add("parallax-item");
            item.classList.add("scroll-fade");
            item.dataset.depth = index % 3 === 0 ? "0.7" : index % 3 === 1 ? "1" : "1.25";
          });
      }
      if (view === "histoire") {
        document
          .querySelectorAll(".story-scope header.hero, .story-scope .chap, .story-scope .card, .story-scope .eq, .story-scope .note, .story-scope blockquote")
          .forEach((item, index) => {
            item.classList.add("parallax-item");
            item.classList.add("scroll-fade");
            item.dataset.depth = index % 2 === 0 ? "0.75" : "1.15";
          });
      }
      if (observer) observer.disconnect();
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
      document.querySelectorAll(".scroll-fade").forEach((item) => observer.observe(item));
      requestScrollUpdate();
    };

    const timeout = window.setTimeout(decorateScrollItems, 60);
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);
    requestScrollUpdate();

    return () => {
      window.clearTimeout(timeout);
      if (raf) window.cancelAnimationFrame(raf);
      if (observer) observer.disconnect();
      window.removeEventListener("scroll", requestScrollUpdate);
      window.removeEventListener("resize", requestScrollUpdate);
      document.querySelectorAll(".parallax-item").forEach((item) => {
        item.classList.remove("parallax-item");
        item.style.removeProperty("--parallax-y");
      });
      document.querySelectorAll(".scroll-fade").forEach((item) => item.classList.remove("scroll-fade", "is-visible"));
      root.style.removeProperty("--intro-scroll-y");
    };
  }, [view]);
}


/* ====== Barre de navigation ====== */
function TopBar({ view, go }) {
  const tabs = [
    { id: "cours", label: "Cours" },
    { id: "histoire", label: "Histoire" },
    { id: "quiz", label: "Contrôle" },
  ];
  return (
    <header className="topbar">
      <ProgressBar />
      <div className="topbar-inner">
        <div className="topbar-left">
          <button className="home-btn" onClick={() => go("landing")}>
            <Home size={15} /> <span>Accueil</span>
          </button>
          <span className="topbar-sep" />
          <div className="topbar-brand">
            <span className="topbar-bt">BT</span>
            <span className="topbar-author"><span className="author-firstname">Billy</span> <span className="author-lastname">Thomont</span></span>
          </div>
        </div>
        <nav className="seg">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={"seg-btn" + (view === t.id ? " active" : "")}
              onClick={() => go(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ====== Écran d'accueil : choix du sujet ====== */
function Landing({ go }) {
  const topics = [TOPICS.dit, TOPICS.wgan];
  return (
    <div className="intro">
      <div className="intro-bg" />
      <div className="intro-inner">

        <div className="author-block fade" style={{ animationDelay: "0ms" }}>
          <div className="bt-mono">BT</div>
          <div className="author-info">
            <span className="author-name"><span className="author-firstname">Billy</span> <span className="author-lastname">Thomont</span></span>
            <span className="author-role">Thèse de doctorat · Université de La Réunion · EnergyLab</span>
            <span className="author-supervisors">Encadrants : Cedric Damour · Dominique Grondin · Michel Benne</span>
          </div>
        </div>

        <h1 className="intro-title fade" style={{ animationDelay: "130ms" }}>
          Modèles<br /><em>génératifs</em>
        </h1>

        <div className="motion-divider electric-divider fade" style={{ animationDelay: "190ms" }} aria-hidden="true">
          <span className="electric-line" />
          <span className="electric-core" />
          <span className="electric-line" />
        </div>

        <p className="intro-sub fade" style={{ animationDelay: "240ms" }}>
          Deux approches pour générer des séries de consommation électrique synthétiques. Choisissez le modèle que vous souhaitez explorer.
        </p>

        <p className="intro-ask fade" style={{ animationDelay: "390ms" }}>
          Choisissez votre modèle
        </p>

        <div className="choice-grid">
          {topics.map((topic, i) => {
            const Icon = topic.landingIcon;
            return (
              <button
                key={topic.key}
                className={`choice ${topic.landingClass} fade`}
                style={{ animationDelay: `${460 + i * 70}ms` }}
                onClick={() => go("intro", topic.key)}
              >
                <div className="choice-top">
                  <div className="choice-ico"><Icon size={22} /></div>
                  <h3>{topic.landingTitle}</h3>
                </div>
                <p className="choice-desc">{topic.landingDesc}</p>
                <div className="choice-foot">Explorer <ArrowRight size={13} /></div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}

/* ====== Écran d'accueil d'un sujet ====== */
function Intro({ go, topic }) {
  return (
    <div className="intro">
      <div className="intro-bg" />
      <div className="intro-inner">

        <div className="author-block fade" style={{ animationDelay: "0ms" }}>
          <div className="bt-mono">BT</div>
          <div className="author-info">
            <span className="author-name"><span className="author-firstname">Billy</span> <span className="author-lastname">Thomont</span></span>
            <span className="author-role">Thèse de doctorat · Université de La Réunion · EnergyLab</span>
            <span className="author-supervisors">Encadrants : Cedric Damour · Dominique Grondin · Michel Benne</span>
          </div>
        </div>

        <h1 className="intro-title fade" style={{ animationDelay: "130ms" }} dangerouslySetInnerHTML={{ __html: topic.titleHtml }} />

        <div className="motion-divider electric-divider fade" style={{ animationDelay: "190ms" }} aria-hidden="true">
          <span className="electric-line" />
          <span className="electric-core" />
          <span className="electric-line" />
        </div>

        <p className="intro-sub fade" style={{ animationDelay: "240ms" }}>
          {topic.introSub}
        </p>

        <p className="intro-ask fade" style={{ animationDelay: "390ms" }}>
          Choisissez votre parcours
        </p>

        <div className="choice-grid">
          <button className="choice c-course fade" style={{ animationDelay: "460ms" }} onClick={() => go("cours", topic.key)}>
            <div className="choice-top">
              <div className="choice-ico"><BookOpen size={22} /></div>
              <h3>Le Cours</h3>
            </div>
            <p className="choice-desc">{topic.courseDesc}</p>
            <div className="choice-foot">Lire le cours <ArrowRight size={13} /></div>
          </button>

          <button className="choice c-story fade" style={{ animationDelay: "530ms" }} onClick={() => go("histoire", topic.key)}>
            <div className="choice-top">
              <div className="choice-ico"><Feather size={22} /></div>
              <h3>L'Histoire illustrée</h3>
            </div>
            <p className="choice-desc">{topic.storyDesc}</p>
            <div className="choice-foot">Lire la fable <ArrowRight size={13} /></div>
          </button>
        </div>

        <button className="quiz-cta fade" style={{ animationDelay: "600ms" }} onClick={() => go("quiz", topic.key)}>
          <ClipboardCheck size={17} />
          <span>{topic.quizCtaLabel}</span>
          <ArrowRight size={15} />
        </button>

        <button className="ghost-btn back-to-landing fade" style={{ animationDelay: "660ms" }} onClick={() => go("landing")}>
          <ArrowLeft size={14} /> Changer de modèle
        </button>

      </div>
    </div>
  );
}

/* ====== Vue Cours ====== */
function Course({ topic }) {
  const ref = useRef(null);
  useKatex(ref, "course-" + topic.key);

  useEffect(() => {
    if (!topic.hasSchema || !ref.current) return;
    const spans = ref.current.querySelectorAll('span');
    for (const span of spans) {
      if (span.textContent.trim() === 'Schéma indisponible') {
        const img = document.createElement('img');
        img.src   = schemaImg;
        img.alt   = "Schéma de l'architecture du Diffusion Transformer (DiT)";
        img.style.cssText =
          'width:100%;max-width:48rem;margin:0 auto;display:block;' +
          'border-radius:.75rem;border:1px solid #e2e8f0;' +
          'box-shadow:0 1px 4px rgba(0,0,0,.08);background:#fff';
        span.parentElement?.replaceWith(img);
        break;
      }
    }
  }, [topic.key]);

  return (
    <div className="course-scope" ref={ref} key={topic.key}
         dangerouslySetInnerHTML={{ __html: topic.courseHtml }} />
  );
}

/* ====== Vue Histoire ====== */
function Story({ topic }) {
  const ref = useRef(null);
  useKatex(ref, "story-" + topic.key);
  return (
    <>
      <style>{STORY_CSS}</style>
      <div className="story-scope" ref={ref} key={topic.key} dangerouslySetInnerHTML={{ __html: topic.storyHtml }} />
    </>
  );
}

/* ====== Module Contrôle des connaissances ====== */
function Quiz({ go, topic }) {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  useKatex(ref, "quiz-" + topic.key + "-" + idx + "-" + (done ? "r" : "q"));

  const QUESTIONS = topic.questions;
  const EXPLANATIONS = topic.explanations;
  const total = QUESTIONS.length;
  const q = QUESTIONS[idx];

  function pick(i) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correct) setScore((s) => s + 1);
  }
  function next() {
    if (idx + 1 < total) {
      setIdx(idx + 1);
      setPicked(null);
    } else {
      setDone(true);
    }
  }
  function restart() {
    setIdx(0); setPicked(null); setScore(0); setDone(false);
  }

  const rank = topic.rank(score, total);

  return (
    <div className="quiz-page">
      <div className="quiz-wrap" ref={ref}>
        <div className="quiz-head">
          <div className="quiz-eyebrow">Contrôle des connaissances</div>
          <h2>{topic.quizModuleTitle}</h2>
          <p className="quiz-sub">{topic.quizSub}</p>
          <div className="quiz-progress"><div style={{ width: `${done ? 100 : ((idx) / total) * 100}%` }} /></div>
        </div>

        <div className="quiz-card">
          {!done ? (
            <div className="quiz-q" key={idx}>
              <div className="q-count">Question {idx + 1} / {total}</div>
              <h3 className="q-text">{q.q}</h3>
              <div className="q-opts">
                {q.options.map((opt, i) => {
                  const selected = picked === i;
                  const isCorrect = i === q.correct;
                  let cls = "q-opt";
                  if (picked !== null) {
                    if (isCorrect) cls += " q-correct";
                    else if (selected) cls += " q-wrong";
                    else cls += " q-dim";
                  }
                  return (
                    <button key={i} className={cls} onClick={() => pick(i)} disabled={picked !== null}>
                      <span className="q-letter">{String.fromCharCode(65 + i)}</span>
                      <span className="q-label">{opt}</span>
                      {picked !== null && isCorrect && <Check size={18} className="q-ico" />}
                      {picked !== null && selected && !isCorrect && <X size={18} className="q-ico" />}
                    </button>
                  );
                })}
              </div>
              {picked !== null && (
                <>
                  <div className={"q-feedback " + (picked === q.correct ? "fb-ok" : "fb-no")}>
                    {picked === q.correct ? "Bonne réponse." : "Réponse incorrecte."}
                  </div>
                  {picked !== q.correct && (
                    <div className="q-explain">
                      <strong>Pourquoi ?</strong> {EXPLANATIONS[idx]}
                    </div>
                  )}
                  <button className="q-next" onClick={next}>
                    {idx + 1 < total ? "Question suivante" : "Voir le résultat"} <ArrowRight size={17} />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="quiz-result">
              <div className="quiz-eyebrow">Résultat final</div>
              <h3 style={{ color: rank.c }}>{rank.t}</h3>
              <p className="rank-desc">{rank.d}</p>
              <div className="score-box">
                <span className="score-label">Score</span>
                <span className="score-val">{score} / {total}</span>
              </div>
              <div className="result-actions">
                <button className="q-next" onClick={restart}><RotateCcw size={16} /> Recommencer</button>
                <button className="ghost-btn" onClick={() => go("cours", topic.key)}><ArrowLeft size={16} /> Retour au cours</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ====== Bandeau de fin (vers le quiz) ====== */
function EndCTA({ go, topic }) {
  return (
    <div className="endcta-wrap">
      <div className="endcta">
        <Sparkles size={22} />
        <div>
          <h4>Tester la compréhension</h4>
          <p>{topic.endCtaText}</p>
        </div>
        <button onClick={() => go("quiz", topic.key)}>Contrôle des connaissances <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

/* ====== Application ====== */
export default function App() {
  const [view, setView] = useState("landing");
  const [topicKey, setTopicKey] = useState(null);
  const go = (v, t) => {
    window.scrollTo(0, 0);
    setView(v);
    if (v === "landing") setTopicKey(null);
    else if (t) setTopicKey(t);
  };
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return window.localStorage.getItem("theme") || "dark";
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);
  useInteractiveParallax(view);

  const topic = topicKey ? TOPICS[topicKey] : null;

  return (
    <div className="app-root">
      <button onClick={toggleTheme} className="theme-toggle" aria-label="Changer de thème">
        {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
      </button>
      <style>{APP_CSS}</style>
      {(view === "cours" || view === "histoire" || view === "quiz") && <TopBar view={view} go={go} />}
      <main>
        {view === "landing" && <Landing go={go} />}
        {view === "intro" && topic && <Intro go={go} topic={topic} />}
        {view === "cours" && topic && <Course topic={topic} />}
        {view === "histoire" && topic && <Story topic={topic} />}
        {view === "quiz" && topic && <Quiz go={go} topic={topic} />}
        {(view === "cours" || view === "histoire") && topic && <EndCTA go={go} topic={topic} />}
      </main>
    </div>
  );
}
