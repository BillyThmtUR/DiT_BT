from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

replacements = {
    "index.html": {
        "<title>Diffusion Transformer (DiT), Billy Thomont</title>": "<title>Diffusion Transformer (DiT) · Billy Thomont</title>",
        "content=\"Cours interactif sur le Diffusion Transformer, Université de La Réunion · EnergyLab\"": "content=\"Cours interactif sur le Diffusion Transformer. Université de La Réunion · EnergyLab\"",
        "Tailwind Play CDN, gère le style": "Tailwind Play CDN gère le style",
    },
    "src/data/courseContent.html": {
        "Le paradigme sous-jacent, détruire méthodiquement la structure d'une\n        distribution de données via un processus de diffusion, puis apprendre\n        à la restaurer, a été formalisé pour la première fois par": "Le paradigme sous-jacent consiste à détruire méthodiquement la structure d'une\n        distribution de données par un processus de diffusion, puis à apprendre\n        à la restaurer. Il a été formalisé pour la première fois par",
        "dépend QUE de": "dépend uniquement de",
        "déterministe d'un bruit auxiliaire, exactement ce que fait": "déterministe d'un bruit auxiliaire. C'est précisément ce que fait",
        "consommation électrique (ECL, ETT), proches en nature de nos courbes": "consommation électrique (ECL, ETT), dont la nature est proche de celle de nos courbes",
        "apprend lui-même</strong> les dépendances pertinentes, y\n      compris à longue portée": "apprend lui-même</strong> les dépendances pertinentes, notamment\n      celles qui s'étendent sur de longues périodes",
        "On profite donc du champ réceptif global,\n      idéal pour capter la périodicité journalière et le couplage matin/soir,\n      <strong>sans subir le surcoût habituel</strong>": "On profite donc du champ réceptif global, particulièrement adapté à la périodicité journalière et au couplage matin/soir,\n      <strong>sans subir le surcoût habituel</strong>",
    },
    "src/data/storyContent.html": {
        "Ce serait épuisant : et pour entraîner notre futur héros, il faudra le faire\n        des millions de fois.": "Ce serait beaucoup trop coûteux, d'autant que l'opération doit être répétée\n        des millions de fois pendant l'entraînement.",
        "à 97&nbsp;% effacé : selon le\n        <span class=\"v tim\">t</span> qu'il choisit": "à 97&nbsp;% effacé, selon la valeur de\n        <span class=\"v tim\">t</span> choisie",
        "existé : mais qui aurait très bien pu": "existé, mais qui aurait très bien pu",
        "parfaitement neutre : <span class=\"v": "parfaitement neutre. <span class=\"v",
        "Devin : un peintre dont la mission": "Devin, un peintre dont la mission",
        "ses <strong>poids</strong> <span class=\"v mod\">θ</span> : quelque": "ses <strong>poids</strong> <span class=\"v mod\">θ</span>, soit quelque",
        "faite de sinus et de cosinus\n        de fréquences différentes : l'encodage positionnel": "faite de sinus et de cosinus\n        de fréquences différentes. C'est l'encodage positionnel",
        "Q, K, V, d_k :</b>": "Q, K, V et d_k :</b>",
    },
}

for relative_path, mapping in replacements.items():
    path = ROOT / relative_path
    text = path.read_text(encoding="utf-8")
    original = text
    for old, new in mapping.items():
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding="utf-8")
        print(f"Corrigé : {relative_path}")
    else:
        print(f"Aucune correspondance supplémentaire : {relative_path}")
