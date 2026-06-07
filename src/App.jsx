import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Feather, ClipboardCheck, ArrowRight, ArrowLeft, Home, Check, X, RotateCcw, Sparkles } from "lucide-react";
import schemaImg from '../img/graphique.png'
import ProgressBar from "./components/ProgressBar";
import COURSE_HTML from './data/courseContent.html?raw';
import STORY_CSS from './data/story.css?raw';
import STORY_HTML from './data/storyContent.html?raw';
import APP_CSS from './data/App.css?raw';

/* ====== CONTENU INJECTÉ ====== */
const QUESTIONS = [{"q": "Dans le processus forward (Éq. 1), à quoi sert le facteur \\(\\sqrt{1-\\beta_t}\\) appliqué à \\(x_{t-1}\\) ?", "options": ["À accélérer les calculs vectoriels sur GPU.", "À contenir la variance globale du signal afin d'éviter son explosion asymptotique au fil des étapes.", "À augmenter la profondeur effective du réseau de neurones."], "correct": 1}, {"q": "Quel est l'avantage principal du trick de reparamétrisation (Éq. 2) pour l'entraînement ?", "options": ["Il réduit la taille du modèle de moitié en supprimant les couches intermédiaires.", "Il impose une distribution uniforme au bruit pour stabiliser le gradient.", "Il permet d'obtenir \\(x_t\\) directement depuis \\(x_0\\) en \\(\\mathcal{O}(1)\\), sans dérouler les 1000 étapes de bruitage."], "correct": 2}, {"q": "Que vaut approximativement \\(\\bar{\\alpha}_t\\) à la dernière itération (\\(t = 999\\)) ?", "options": ["Une valeur proche de 1 : le signal original est quasi-intégralement préservé.", "Exactement 0,5 : signal et bruit sont à parts égales.", "Une valeur tendant vers 0 : le bruit blanc gaussien domine totalement."], "correct": 2}, {"q": "Quel est l'objectif prédictif du modèle \\(\\epsilon_\\theta\\) lors de la minimisation de la fonction de perte (Éq. 3) ?", "options": ["Estimer directement la courbe de consommation sans bruit \\(x_0\\).", "Identifier le vecteur de bruit gaussien \\(\\epsilon\\) injecté lors de la corruption forward.", "Prédire les pas de temps futurs à partir de la série temporelle brute."], "correct": 1}, {"q": "Dans le mécanisme d'auto-attention, pourquoi divise-t-on le produit \\(QK^\\top\\) par \\(\\sqrt{d_k}\\) ?", "options": ["Pour normaliser les poids entre 0 et 1 avant la softmax, indépendamment de la séquence.", "Pour éviter que les scores ne croissent avec la dimension et saturent la softmax, ce qui tuerait les gradients.", "Pour réduire le coût quadratique de l'attention à un coût linéaire."], "correct": 1}, {"q": "Quelle est la différence fondamentale entre le champ réceptif d'un U-Net convolutif et celui d'un Transformer ?", "options": ["Le U-Net a un champ réceptif global dès la première couche grâce aux skip-connections.", "Le Transformer dispose d'un champ réceptif global dès la première couche, là où le U-Net ne l'acquiert que progressivement via empilement et pooling.", "Les deux architectures ont un champ réceptif identique ; seul le coût de calcul diffère."], "correct": 1}, {"q": "Dans l'encodage positionnel (Éq. 4), à quoi correspondent les dimensions de haute fréquence (indices \\(i\\) faibles) ?", "options": ["Elles encodent le contexte global (matin vs soir) grâce à des oscillations lentes.", "Elles oscillent vite pour différencier des patches temporellement proches (ex. 10h de 11h).", "Elles encodent l'amplitude maximale observée (13 325 kWh) pour calibrer la normalisation."], "correct": 1}, {"q": "Dans l'adaLN-Zero (Éq. 5), quelle est la conséquence directe d'initialiser \\(\\alpha = 0\\) en début d'entraînement ?", "options": ["Le bloc se comporte comme une identité (\\(x_{l+1} = x_l\\)), stabilisant les gradients dès les premières itérations.", "Le bruit résiduel du vecteur latent est effacé préventivement.", "L'attention multi-têtes est désactivée pour économiser de la mémoire GPU."], "correct": 0}, {"q": "Lors du reverse process (Éq. 6), pourquoi ajoute-t-on le terme stochastique \\(\\sigma_t z\\) à chaque étape (sauf la dernière) ?", "options": ["Pour compenser la perte d'énergie due à la soustraction itérative du bruit estimé.", "Pour forcer le modèle à explorer toutes les étapes forward en sens inverse.", "Pour prévenir le lissage excessif et conserver les variations asymétriques propres aux charges électriques (dynamique de Langevin)."], "correct": 2}, {"q": "Pourquoi l'algorithme de génération utilise-t-il les poids EMA plutôt que les poids d'entraînement bruts ?", "options": ["Les poids EMA sont plus légers en mémoire car ils fusionnent les couches redondantes.", "L'EMA filtre la variance due aux batchs atypiques et représente la tendance consolidée de ~1000 itérations, produisant des courbes générées plus stables.", "Les poids bruts sont réservés à l'inférence conditionnelle sur de nouvelles données RTE."], "correct": 1}];

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
          <button className="home-btn" onClick={() => go("intro")}>
            <Home size={15} /> <span>Accueil</span>
          </button>
          <span className="topbar-sep" />
          <div className="topbar-brand">
            <span className="topbar-bt">BT</span>
            <span className="topbar-author">Billy Thomont</span>
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

/* ====== Écran d'accueil ====== */
function Intro({ go }) {
  return (
    <div className="intro">
      <div className="intro-bg" />
      <div className="intro-inner">

        {/* Signature auteur */}
        <div className="author-block fade" style={{ animationDelay: "0ms" }}>
          <div className="bt-mono">BT</div>
          <div className="author-info">
            <span className="author-name">Billy Thomont</span>
            <span className="author-role">Thèse de doctorat · Université de La Réunion · EnergyLab</span>
          </div>
        </div>

        {/* Titre principal */}
        <h1 className="intro-title fade" style={{ animationDelay: "110ms" }}>
          Diffusion<br /><em>Transformer</em>
        </h1>

        <p className="intro-ask fade" style={{ animationDelay: "400ms" }}>
          Par où voulez-vous commencer ?
        </p>

        {/* Cartes de choix */}
        <div className="choice-grid">
          <button className="choice c-course fade" style={{ animationDelay: "460ms" }} onClick={() => go("cours")}>
            <div className="choice-top">
              <div className="choice-ico"><BookOpen size={22} /></div>
              <h3>Le Cours</h3>
            </div>
            <p className="choice-desc">Équations détaillées, démonstrations pas-à-pas, deep-dives mathématiques et comparaison U-Net / Transformer.</p>
            <div className="choice-foot">Lire le cours <ArrowRight size={13} /></div>
          </button>

          <button className="choice c-story fade" style={{ animationDelay: "530ms" }} onClick={() => go("histoire")}>
            <div className="choice-top">
              <div className="choice-ico"><Feather size={22} /></div>
              <h3>L'Histoire illustrée</h3>
            </div>
            <p className="choice-desc">Chaque variable devient un personnage. Tout le cycle d'entraînement raconté comme une fable, du Jour Zéro à la création.</p>
            <div className="choice-foot">Lire la fable <ArrowRight size={13} /></div>
          </button>
        </div>

        {/* CTA quiz */}
        <button className="quiz-cta fade" style={{ animationDelay: "600ms" }} onClick={() => go("quiz")}>
          <ClipboardCheck size={17} />
          <span>Contrôle des connaissances — 10 questions</span>
          <ArrowRight size={15} />
        </button>

      </div>
    </div>
  );
}

/* ====== Vue Cours ====== */
function Course() {
  const ref = useRef(null);
  useKatex(ref, "course");

  useEffect(() => {
    if (!ref.current) return;
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
  }, []);

  return (
    <div className="course-scope" ref={ref}
         dangerouslySetInnerHTML={{ __html: COURSE_HTML }} />
  );
}

/* ====== Vue Histoire ====== */
function Story() {
  const ref = useRef(null);
  useKatex(ref, "story");
  return (
    <>
      <style>{STORY_CSS}</style>
      <div className="story-scope" ref={ref} dangerouslySetInnerHTML={{ __html: STORY_HTML }} />
    </>
  );
}

/* ====== Module Contrôle des connaissances ====== */
function Quiz({ go }) {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  useKatex(ref, "quiz-" + idx + "-" + (done ? "r" : "q"));

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

  let rank;
  if (score === total) rank = { t: "Niveau : Expert", c: "#60a5fa", d: "Maîtrise parfaite — processus de Markov, attention, adaLN et dynamique de génération n'ont plus de secrets." };
  else if (score >= 7) rank = { t: "Niveau : Avancé", c: "#fff", d: "Solide compréhension de l'architecture. Quelques subtilités mathématiques méritent une relecture ciblée." };
  else if (score >= 4) rank = { t: "Niveau : Intermédiaire", c: "#a78bfa", d: "Les fondamentaux sont posés. Reprendre les sections sur l'attention, l'adaLN et la dynamique de Langevin." };
  else rank = { t: "Niveau : Fondations", c: "#94a3b8", d: "Une relecture approfondie des concepts forward/reverse, du mécanisme d'attention et de l'EMA est recommandée." };

  return (
    <div className="quiz-wrap" ref={ref}>
      <div className="quiz-card">
        <div className="quiz-head">
          <span className="quiz-eyebrow">Contrôle des connaissances</span>
          <h2>Module d'Évaluation DiT</h2>
          <p className="quiz-sub">Validez votre compréhension des concepts mathématiques abordés.</p>
          <div className="quiz-progress"><div style={{ width: ((done ? total : idx) / total) * 100 + "%" }} /></div>
        </div>

        {!done && (
          <div className="quiz-q" key={idx}>
            <span className="q-count">Question {idx + 1} / {total}</span>
            <h3 className="q-text">{q.q}</h3>
            <div className="q-opts">
              {q.options.map((opt, i) => {
                let cls = "q-opt";
                if (picked !== null) {
                  if (i === q.correct) cls += " q-correct";
                  else if (i === picked) cls += " q-wrong";
                  else cls += " q-dim";
                }
                return (
                  <button key={i} className={cls} onClick={() => pick(i)} disabled={picked !== null}>
                    <span className="q-letter">{String.fromCharCode(65 + i)}</span>
                    <span className="q-label">{opt}</span>
                    {picked !== null && i === q.correct && <Check size={18} className="q-ico" />}
                    {picked !== null && i === picked && i !== q.correct && <X size={18} className="q-ico" />}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="q-feedback">
                {picked === q.correct
                  ? <span className="fb-ok">Réponse correcte.</span>
                  : <span className="fb-no">Réponse incorrecte. La bonne réponse est mise en évidence.</span>}
              </div>
            )}
            {picked !== null && (
              <button className="q-next" onClick={next}>
                {idx + 1 < total ? "Suivant" : "Terminer l'évaluation"}
              </button>
            )}
          </div>
        )}

        {done && (
          <div className="quiz-result">
            <h3 style={{ color: rank.c }}>{rank.t}</h3>
            <p className="rank-desc">{rank.d}</p>
            <div className="score-box">
              <span className="score-label">Score final</span>
              <span className="score-val">{score} / {total}</span>
            </div>
            <div className="result-actions">
              <button className="q-next" onClick={restart}><RotateCcw size={16} /> Reprendre</button>
              <button className="ghost-btn" onClick={() => go("cours")}>Revoir le cours</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ====== Bandeau de fin (vers le quiz) ====== */
function EndCTA({ go }) {
  return (
    <div className="endcta-wrap">
      <div className="endcta">
        <Sparkles size={22} />
        <div>
          <h4>Tester la compréhension</h4>
          <p>10 questions pour valider les concepts clés du Diffusion Transformer.</p>
        </div>
        <button onClick={() => go("quiz")}>Contrôle des connaissances <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

/* ====== Application ====== */
export default function App() {
  const [view, setView] = useState("intro");
  const go = (v) => { window.scrollTo(0, 0); setView(v); };
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-root">
      <button onClick={toggleTheme} className="theme-toggle">
        Passer en mode {theme === 'light' ? 'sombre' : 'clair'}
      </button>
      <style>{APP_CSS}</style>
      {view !== "intro" && <TopBar view={view} go={go} />}
      <main>
        {view === "intro" && <Intro go={go} />}
        {view === "cours" && <Course />}
        {view === "histoire" && <Story />}
        {view === "quiz" && <Quiz go={go} />}
        {(view === "cours" || view === "histoire") && <EndCTA go={go} />}
      </main>
    </div>
  );
}
