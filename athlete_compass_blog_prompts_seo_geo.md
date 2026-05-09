# Athlete Compass — Prompts Blog SEO/GEO

Ce fichier regroupe les prompts à utiliser dans l’ordre pour créer, structurer, optimiser et publier le blog SEO/GEO de **Athlete Compass**.

Objectif du blog : attirer des prospects qualifiés via des articles très précis, puis les convertir vers :

- le calculateur gratuit d’âge athlétique ;
- le Hybrid Score ;
- le rapport premium ;
- le plan 4 semaines ;
- les équivalences machines.

Ordre conseillé :

1. Stratégie éditoriale SEO/GEO
2. Calendrier éditorial des 30 premiers articles
3. Brief article SEO/GEO complet
4. Template article “est-ce un bon niveau ?”
5. Template article comparatif machines
6. Article pilier âge athlétique
7. Article physique crossfiter sans CrossFit
8. Article stagnation muscu + course
9. Optimisation GEO d’un article existant
10. CTA par intention
11. Interlinking blog
12. Template MDX
13. SEO technique blog Next.js
14. Repurposing Instagram / LinkedIn / Shorts
15. Contrôle qualité article
16. Premier article complet à lancer

---

## Couverture technique du repo (audit — prompts 11 à 13)

Référence rapide entre ce guide et le code **Next.js App Router** actuel :

- **§13 SEO technique** — **Déjà en place** : routes `/blog`, `/blog/[slug]`, `/blog/categories/[slug]`, pagination `/blog/p/[page]` ; **`generateMetadata`** (titre, description, canonical) ; **Open Graph** + **Twitter** (`summary_large_image`) ; **`app/sitemap.ts`** (articles, catégories, pages liste) ; **`app/robots.ts`** ; JSON-LD **`Article`** + **`BreadcrumbList`** sur la page article ; **`FAQPage`** lorsque le frontmatter expose une FAQ (`ArticleFaq`) ; table des matières, temps de lecture, dates publication / mise à jour ; composants **CTA** et **articles liés** (`RelatedArticles`, navigation article précédent / suivant).
- **§11 Interlinking** — **Partiellement automatisé** : le maillage contextuel riche reste **éditorial** (liens dans le MDX). Le site propose les blocs techniques (articles liés, fil d’Ariane, catégories).
- **§12 Template MDX** — **Compatible** : frontmatter utilisé (`title`, `description`, `date`, `category`, `tags`, etc.). Les champs « idéaux » optionnels du prompt (`primaryKeyword`, `intent`, `ctaType`…) peuvent être ajoutés **au fil des contenus** sans changer la stack.

_Le calendrier 30 articles et la stratégie 50 titres (§01–§02) restent des livrables éditoriaux à produire ; seuls quelques MDX sont présents dans `content/blog/`._

---

## 01 — Prompt stratégie éditoriale SEO/GEO

```markdown
Tu es un expert SEO, GEO, product marketing et content strategist.

Je veux créer le blog de la webapp SaaS **Athlete Compass**.

Contexte produit :
Athlete Compass aide les sportifs à calculer :
- leur âge athlétique estimé,
- leur Hybrid Score,
- leur profil d’athlète hybride,
- leur limiteur principal,
- leur Performance Gap,
- leur prochain meilleur mouvement,
- un plan minimal de progression.

Positionnement :
“Tu connais ton âge réel et ton poids. Mais connais-tu l’âge de ton corps de performance ?”

Public cible :
- hommes et femmes de 25 à 45 ans,
- pratiquants muscu + course,
- personnes qui veulent un physique crossfiter / HYROX-like,
- personnes qui s’entraînent en salle classique,
- personnes qui veulent savoir si elles progressent vraiment,
- profils qui cherchent des standards : rameur, course, tractions, force, burpees, etc.

Objectif du blog :
Attirer des prospects via des articles SEO très précis et compatibles GEO, puis les convertir vers :
- calculateur gratuit d’âge athlétique,
- rapport premium,
- plan 4 semaines,
- équivalences machines.

Je veux une stratégie éditoriale complète.

Produis :
1. Les grands clusters SEO du blog.
2. Les sous-thématiques.
3. Les intentions de recherche.
4. Les types d’articles à créer.
5. Les angles différenciants.
6. Les CTA naturels vers Athlete Compass.
7. Les opportunités GEO : définitions, tableaux, FAQ, blocs réponse courte.
8. Une architecture de blog.
9. Une stratégie d’interlinking.
10. Les 50 premiers articles à publier, classés par priorité.

Contraintes :
- Ne pas produire du contenu fitness générique.
- Prioriser les requêtes longues.
- Chaque article doit pouvoir amener à un calcul, un test ou un diagnostic.
- Ne pas faire de promesse médicale.
- Toujours distinguer âge athlétique, âge biologique et santé médicale.
- Les articles doivent être utiles même sans acheter le produit.
```

---

## 02 — Prompt calendrier éditorial des 30 premiers articles

```markdown
Tu es un SEO content planner.

À partir de la stratégie du blog Athlete Compass, crée un calendrier éditorial de 30 articles.

Objectif :
Publier d’abord les contenus les plus susceptibles d’attirer des prospects qualifiés et de convertir vers le calculateur d’âge athlétique.

Pour chaque article, fournis :
- titre SEO,
- mot-clé principal,
- requêtes secondaires,
- intention de recherche,
- type d’article,
- difficulté estimée,
- potentiel de conversion,
- angle spécifique,
- CTA principal,
- CTA secondaire,
- liens internes à prévoir,
- format recommandé : guide, comparatif, standards, calculateur, diagnostic, plan.

Priorise les articles dans cet ordre :
1. Requêtes “est-ce un bon niveau ?”
2. Requêtes standards sportifs.
3. Âge athlétique / âge physique.
4. Comparatifs machines.
5. Physique hybride / crossfiter.
6. Problèmes de stagnation.
7. Articles plus larges.

Je veux un tableau clair et actionnable.

Ne donne pas uniquement des titres inspirationnels.
Je veux des articles concrets, capables d’attirer des recherches précises.
```

---

## 03 — Prompt brief article SEO/GEO complet

```markdown
Tu est un expert SEO/GEO et rédacteur spécialisé sport, performance et recomposition physique.

Je veux créer un brief complet pour l’article suivant :

[TITRE DE L’ARTICLE]

Contexte produit :
Cet article est publié sur le blog de Athlete Compass, une webapp qui calcule l’âge athlétique, le Hybrid Score, le profil d’athlète hybride et le plan minimal de progression.

Objectif de l’article :
- Répondre précisément à la requête.
- Être lisible par Google et les moteurs IA.
- Donner une réponse utile et nuancée.
- Convertir naturellement vers le calculateur gratuit Athlete Compass.

Produis un brief complet avec :

1. Intention de recherche.
2. Persona cible.
3. Promesse de l’article.
4. Réponse courte à mettre en haut.
5. Plan H1/H2/H3.
6. Tableaux à inclure.
7. Données ou repères à vérifier.
8. Définitions à inclure.
9. FAQ.
10. Blocs GEO à insérer :
   - réponse courte,
   - résumé en 5 points,
   - tableau comparatif,
   - checklist,
   - exemples concrets.
11. CTA vers Athlete Compass.
12. Liens internes recommandés.
13. Meta title.
14. Meta description.
15. Slug SEO.
16. Schema.org recommandé.
17. Risques à éviter :
   - promesses médicales,
   - standards trop affirmatifs,
   - ton culpabilisant,
   - données non sourcées.

Important :
Si des chiffres sont utilisés, précise quand ils sont des repères indicatifs et non des standards officiels.
```

---

## 04 — Prompt article “est-ce un bon niveau ?”

```markdown
Tu es un rédacteur SEO expert en sport, rameur, musculation et entraînement hybride.

Écris un article complet pour Athlete Compass sur le sujet :

[TITRE]
Exemple : “1 km rameur en 3m30 : bon niveau ou pas ?”

Objectif :
Répondre clairement à une personne qui vient de faire une performance et veut savoir si son niveau est bon.

Structure obligatoire :

# H1 : [Titre]

Introduction courte :
- reformuler la question,
- donner une réponse claire dès le début,
- annoncer que le niveau dépend du sexe, de l’âge, du poids, du contexte et de la technique.

## Réponse courte

Donner une réponse directe en 3 à 5 lignes.

## Tableau des repères par niveau

Créer un tableau :
- débutant,
- correct,
- bon,
- très bon,
- avancé,
- très avancé.

Les chiffres doivent être présentés comme des repères indicatifs, pas comme des standards officiels.

## Ce que cette performance dit de ton profil

Analyser :
- cardio court intense,
- puissance,
- endurance,
- technique,
- capacité à répéter les efforts.

## Les limites de ce test

Expliquer pourquoi une seule performance ne suffit pas.

## Le prochain test à faire

Recommander 2 ou 3 tests complémentaires.

Exemple :
- 2 km rameur,
- 5 km course,
- tractions strictes,
- 50 burpees.

## Objectifs réalistes sur 4 à 8 semaines

Donner des paliers progressifs.

## Comment progresser

Donner 2 séances simples :
- séance intervalles,
- séance endurance/intensité contrôlée,
- conseils techniques.

## Ce que cela signifie pour ton âge athlétique

Expliquer comment cette performance peut influencer l’âge athlétique estimé, sans promesse médicale.

## CTA Athlete Compass

Insérer naturellement :
“Tu peux entrer cette performance dans Athlete Compass pour estimer ton âge athlétique, ton Hybrid Score et ton prochain meilleur test.”

## FAQ

Créer 5 questions/réponses.

Ton :
- clair,
- expert,
- encourageant,
- pas trop académique,
- pas de bullshit fitness.

Contraintes :
- Ne pas faire de promesse médicale.
- Ne pas présenter l’âge athlétique comme un âge biologique.
- Ne pas inventer de standards officiels.
```

---

## 05 — Prompt article comparatif machines

```markdown
Tu es un expert SEO, entraînement hybride et machines cardio.

Écris un article complet pour Athlete Compass sur :

[TITRE]
Exemple : “Rameur ou SkiErg : lequel choisir pour un physique hybride ?”

Objectif :
Aider l’utilisateur à choisir entre deux machines ou à remplacer une machine indisponible.

Structure obligatoire :

# H1

Introduction :
- poser le problème,
- donner une réponse courte,
- annoncer que le choix dépend de l’objectif.

## Réponse courte

Dire clairement quelle machine choisir selon :
- physique hybride,
- sèche,
- cardio intense,
- récupération,
- préservation des jambes,
- haut du corps.

## Tableau comparatif

Colonnes :
- machine,
- muscles sollicités,
- fatigue jambes,
- impact articulaire,
- intérêt cardio,
- intérêt physique,
- meilleur usage,
- à éviter si.

## Analyse machine 1

Expliquer :
- avantages,
- inconvénients,
- meilleurs formats de séance,
- erreurs fréquentes.

## Analyse machine 2

Même structure.

## Équivalences pratiques

Donner des équivalences indicatives :
- en durée,
- en distance,
- en calories si pertinent,
- en intensité ressentie.

Préciser que ce ne sont pas des équivalences parfaites.

## Quelle machine selon ton objectif ?

Créer des sections :
- objectif physique crossfiter,
- objectif HYROX,
- objectif sèche,
- objectif endurance,
- objectif récupération,
- objectif éviter de trop charger les cuisses.

## Exemples de séances

Donner 3 séances :
- débutant/intermédiaire,
- bon niveau,
- format metcon.

## CTA Athlete Compass

Insérer :
“Dans Athlete Compass, tu peux remplacer automatiquement les machines selon ton matériel, ton objectif et ton niveau de fatigue.”

## FAQ

Créer 5 à 7 questions.

Contraintes :
- Ne pas dire qu’une machine est universellement meilleure.
- Nuancer selon le profil.
- Être très concret.
```

---

## 06 — Prompt article âge athlétique

```markdown
Tu es un rédacteur expert SEO/GEO, sport, longévité et performance.

Écris un article complet pour Athlete Compass sur :

“Âge athlétique : comment savoir si ton corps performe plus jeune que ton âge ?”

Objectif :
Créer un article pilier qui explique le concept central du produit.

Structure obligatoire :

# Âge athlétique : comment savoir si ton corps performe plus jeune que ton âge ?

## Réponse courte

Définir l’âge athlétique simplement.

Préciser :
- ce n’est pas l’âge biologique,
- ce n’est pas un diagnostic médical,
- c’est une estimation de performance.

## Âge réel, âge biologique, âge physique, âge athlétique : différences

Créer un tableau comparatif.

Colonnes :
- concept,
- ce que cela mesure,
- données nécessaires,
- limites,
- utilité.

## Pourquoi l’âge athlétique parle plus que le poids

Expliquer :
- une personne peut peser pareil mais être plus performante,
- le tour de taille seul ne suffit pas,
- les performances donnent une lecture dynamique.

## Les qualités qui composent l’âge athlétique

Sections :
- force relative,
- cardio court intense,
- endurance,
- résistance musculaire,
- core/grip,
- récupération,
- composition corporelle.

## Les tests simples pour l’estimer

Présenter :
- 1 km rameur,
- 2 km rameur,
- 5 km course,
- tractions,
- front squat x5,
- développé militaire x5,
- 50 burpees,
- farmer carry,
- tour de taille.

## Exemple concret

Créer un exemple :
- homme 37 ans,
- bon rameur,
- force correcte,
- endurance à confirmer.

Montrer comment l’âge athlétique peut varier par système :
- moteur court,
- force,
- endurance,
- récupération.

## Comment faire baisser son âge athlétique

Donner 5 leviers :
- zone 2,
- force relative,
- metcon court,
- sommeil/récupération,
- recomposition corporelle.

## Les erreurs à éviter

- ne regarder que le poids,
- tester trop souvent,
- faire trop d’intensité,
- négliger la récupération,
- se comparer à des athlètes pros.

## CTA Athlete Compass

“Calcule ton âge athlétique estimé avec Athlete Compass.”

## FAQ

Créer 8 questions/réponses.

Ton :
- pédagogique,
- premium,
- crédible,
- motivant.

Important :
Ne pas utiliser de promesse médicale.
```

---

## 07 — Prompt article “physique crossfiter sans CrossFit”

```markdown
Tu es un coach hybride, expert SEO et rédacteur fitness premium.

Écris un article complet pour Athlete Compass :

“Comment avoir un physique de crossfiter sans faire de CrossFit ?”

Objectif :
Capter les personnes qui veulent un physique athlétique, dense, sec et performant mais qui s’entraînent en salle classique.

Structure obligatoire :

# Comment avoir un physique de crossfiter sans faire de CrossFit ?

## Réponse courte

Expliquer que le physique crossfiter vient du mélange :
- force,
- hypertrophie utile,
- cardio intense,
- endurance,
- résistance musculaire,
- gainage,
- récupération.

## Ce qui différencie un physique crossfiter d’un physique bodybuilding

Créer un tableau.

## Les qualités à développer

Sections :
- épaules/dos,
- jambes puissantes,
- gainage,
- moteur cardio,
- capacité à répéter les efforts,
- grip/carries.

## Les exercices essentiels en salle classique

Lister :
- front squat,
- RDL,
- tractions,
- rowing,
- développé militaire,
- push press,
- dips,
- farmer carry,
- rameur,
- tapis incliné,
- kettlebell swings,
- thrusters haltères,
- burpees.

## Les alternatives si tu n’as pas de box CrossFit

Créer un tableau :
- sled push,
- wall balls,
- SkiErg,
- assault bike,
- rope climb,
- sandbag carry,
- box jumps.

Pour chaque exercice, donner une alternative salle classique.

## Exemple de semaine type

Proposer :
- 2 séances force,
- 2 séances conditioning,
- 1 séance zone 2,
- 1 récupération.

## Les objectifs à viser

Donner des standards indicatifs :
- rameur 1 km,
- rameur 2 km,
- 5 km course,
- tractions,
- développé militaire,
- front squat,
- burpees.

## Les erreurs fréquentes

- trop de bodybuilding,
- trop de course,
- pas assez de metcon,
- pas assez de zone 2,
- récupération insuffisante,
- vouloir tout faire à fond.

## CTA Athlete Compass

“Découvre si ton entraînement te rapproche vraiment d’un physique hybride avec Athlete Compass.”

## FAQ

Créer 6 questions.
```

---

## 08 — Prompt article “stagnation muscu + course”

```markdown
Tu es un rédacteur SEO expert en entraînement hybride, performance et récupération.

Écris un article complet pour Athlete Compass :

“Je fais muscu et course mais je ne progresse plus : que faire ?”

Objectif :
Attirer des sportifs qui s’entraînent déjà beaucoup mais manquent de structure.

Structure obligatoire :

# Je fais muscu et course mais je ne progresse plus : que faire ?

## Réponse courte

Expliquer que le problème vient souvent d’un manque de cohérence :
- trop d’intensité,
- pas assez de récupération,
- pas assez de force relative,
- pas assez de zone 2,
- mauvaise distribution des séances.

## Les signes que tu t’entraînes beaucoup mais mal

Liste :
- fatigue constante,
- charges qui stagnent,
- cardio qui ne progresse pas,
- jambes lourdes,
- sommeil moyen,
- motivation irrégulière,
- tour de taille qui ne bouge pas.

## Les 5 causes les plus fréquentes

1. Trop d’intensité.
2. Pas assez de zone 2.
3. Force et cardio placés n’importe comment.
4. Pas de tests mesurables.
5. Récupération négligée.

## Le concept de Training Debt

Expliquer :
- dette force,
- dette cardio,
- dette endurance,
- dette récupération,
- dette jambes.

## Comment diagnostiquer ton limiteur

Proposer les tests :
- 1 km rameur,
- 5 km course,
- tractions,
- front squat x5,
- 50 burpees,
- sommeil/fatigue.

## Exemple de correction sur 4 semaines

Donner une structure :
- 2 forces,
- 1 zone 2,
- 1 metcon,
- 1 séance optionnelle,
- 1 repos réel.

## CTA Athlete Compass

“Identifie ton limiteur principal et ton Training Debt avec Athlete Compass.”

## FAQ

Créer 6 questions/réponses.

Ton :
- direct,
- réaliste,
- pas culpabilisant.
```

---

## 09 — Prompt optimisation GEO d’un article existant

```markdown
Tu es un expert GEO, SEO sémantique et optimisation de contenu pour moteurs de recherche génératifs.

Je vais te donner un article existant.

Ta mission :
L’optimiser pour Google, ChatGPT, Perplexity, Claude et autres moteurs IA, sans le rendre artificiel.

Pour l’article, ajoute ou améliore :

1. Réponse courte en haut de l’article.
2. Définition claire si le sujet s’y prête.
3. Tableau comparatif ou tableau de niveaux.
4. Résumé en 5 points.
5. FAQ directe.
6. Section “à retenir”.
7. Phrases simples et citables.
8. CTA naturel vers Athlete Compass.
9. Liens internes suggérés.
10. Meta title.
11. Meta description.
12. Slug.
13. Schema.org recommandé.
14. Bloc “limites et nuances”.

Contraintes :
- Ne pas bourrer de mots-clés.
- Ne pas sur-optimiser.
- Ne pas inventer de données officielles.
- Si une donnée est incertaine, la formuler comme repère indicatif.
- Garder un ton expert, clair et humain.

Voici l’article à optimiser :

[COLLER L’ARTICLE]
```

---

## 10 — Prompt création de CTA par intention

```markdown
Tu es un expert conversion copywriting pour SaaS fitness.

Je veux créer des CTA pour les articles du blog Athlete Compass.

Contexte :
Athlete Compass calcule :
- âge athlétique,
- Hybrid Score,
- profil athlète,
- limiteur principal,
- Performance Gap,
- plan 4 semaines.

Crée des CTA adaptés à ces intentions :

1. L’utilisateur cherche si sa performance est bonne.
2. L’utilisateur compare deux machines.
3. L’utilisateur veut un physique crossfiter.
4. L’utilisateur veut faire baisser son âge athlétique.
5. L’utilisateur stagne malgré muscu + course.
6. L’utilisateur veut remplacer un exercice.
7. L’utilisateur veut préparer HYROX.
8. L’utilisateur veut sécher sans perdre de force.
9. L’utilisateur veut éviter de trop charger les cuisses.
10. L’utilisateur veut un plan concret.

Pour chaque intention, donne :
- CTA court,
- CTA long,
- phrase d’introduction avant CTA,
- texte de bouton,
- version discrète en fin d’article,
- version plus directe au milieu de l’article.

Ton :
- naturel,
- premium,
- pas agressif,
- pas bullshit.

Évite :
- “transforme ton corps en 7 jours”
- promesses irréalistes
- urgence artificielle.
```

---

## 11 — Prompt interlinking blog

```markdown
Tu es un expert SEO technique et maillage interne.

Je veux construire le maillage interne du blog Athlete Compass.

Voici la liste des articles existants ou prévus :

[COLLER LISTE DES ARTICLES]

Ta mission :
Créer une stratégie d’interlinking.

Pour chaque article, indique :
- articles parents à lier,
- articles enfants à lier,
- articles connexes,
- ancre de lien recommandée,
- emplacement idéal du lien,
- CTA interne recommandé.

Structure souhaitée :
1. Pages piliers.
2. Articles standards sportifs.
3. Articles comparatifs machines.
4. Articles âge athlétique.
5. Articles problèmes/stagnation.
6. Articles plans/exercices.

Objectif :
Faire comprendre à Google et aux moteurs IA que Athlete Compass possède une expertise cohérente sur :
- âge athlétique,
- entraînement hybride,
- standards de performance,
- équivalences machines,
- diagnostic sportif,
- progression physique.

Contraintes :
- Ne pas mettre 20 liens par article.
- Prioriser 3 à 6 liens internes utiles.
- Les ancres doivent être naturelles.
```

---

## 12 — Prompt template MDX pour article

```markdown
Tu es un développeur Next.js + rédacteur SEO.

Je veux transformer un article du blog Athlete Compass en fichier MDX prêt à publier.

Stack :
- Next.js App Router
- MDX
- Tailwind
- composants possibles :
  - <Callout />
  - <Table />
  - <CtaBox />
  - <Faq />
  - <RelatedArticles />
  - <PerformanceLevelTable />
  - <AthleteCompassCta />

Ta mission :
À partir de l’article fourni, génère un fichier `.mdx` propre.

Inclure en frontmatter :
- title
- description
- slug
- date
- updated
- category
- tags
- primaryKeyword
- secondaryKeywords
- intent
- ctaType

Structure :
- H1
- réponse courte
- contenu principal
- tableaux si utiles
- CTA milieu d’article
- FAQ
- articles liés
- CTA final

Contraintes :
- Garder un markdown propre.
- Ne pas mettre de HTML inutile.
- Les tableaux doivent être lisibles.
- Ajouter une note si les standards sont indicatifs.
- Ajouter la mention si l’article parle d’âge athlétique :
“L’âge athlétique est une estimation de performance, pas une mesure biologique ni un diagnostic médical.”

Voici l’article :

[COLLER ARTICLE]
```

---

## 13 — Prompt SEO technique pour blog Next.js

```markdown
Tu es un expert SEO technique Next.js.

Je veux créer ou améliorer le blog de Athlete Compass.

Stack :
- Next.js App Router
- TypeScript
- MDX
- Tailwind
- éventuellement Contentlayer ou système simple de fichiers markdown

Objectif :
Créer un blog SEO performant et compatible GEO.

À implémenter :
1. Structure `/blog`
2. Pages catégories
3. Page article
4. Génération metadata dynamique
5. Open Graph
6. Twitter cards
7. Sitemap
8. robots.txt
9. Schema.org Article
10. Schema.org FAQPage si FAQ présente
11. Breadcrumbs
12. Articles liés
13. Table des matières
14. CTA vers calculateur Athlete Compass
15. Temps de lecture
16. Date de mise à jour

Contraintes :
- Performance élevée.
- HTML propre.
- Titres hiérarchisés.
- Pas de contenu caché inutile.
- Mobile impeccable.
- Ne pas bloquer l’indexation.
- Prévoir des URLs propres.

Structure souhaitée :
- `/blog`
- `/blog/[slug]`
- `/blog/categories/[category]`

Créer aussi :
- `lib/blog.ts`
- `components/blog/article-card.tsx`
- `components/blog/table-of-contents.tsx`
- `components/blog/blog-cta.tsx`
- `components/blog/faq-section.tsx`
- `components/blog/related-articles.tsx`

Livrable :
Un blog fonctionnel avec 3 articles exemples en MDX.
```

---

## 14 — Prompt repurposing Instagram / LinkedIn / Shorts

```markdown
Tu es un expert content repurposing pour SaaS fitness.

À partir d’un article du blog Athlete Compass, crée des contenus courts pour attirer du trafic.

Article :
[COLLER ARTICLE]

Produis :

## Instagram carousel

- 7 slides
- titre de chaque slide
- texte court
- CTA final
- description Instagram
- hashtags

## LinkedIn post

- hook
- développement court
- exemple concret
- CTA naturel

## YouTube Shorts / TikTok script

- hook 3 secondes
- script 30 secondes
- texte à l’écran
- CTA

## Pinterest pin

- titre
- description SEO
- mots-clés

## Newsletter courte

- objet
- intro
- corps
- CTA

Contraintes :
- Ne pas faire trop commercial.
- Garder l’angle éducatif.
- Renvoyer naturellement vers le calculateur d’âge athlétique.
```

---

## 15 — Prompt contrôle qualité article

```markdown
Tu es un éditeur SEO senior, spécialiste crédibilité, sport et performance.

Relis cet article Athlete Compass :

[COLLER ARTICLE]

Ta mission :
Faire un audit qualité avant publication.

Vérifie :

1. La réponse à l’intention de recherche est-elle claire ?
2. Le titre est-il assez précis ?
3. L’introduction répond-elle rapidement ?
4. L’article est-il utile même sans acheter le produit ?
5. Les tableaux sont-ils clairs ?
6. Les chiffres sont-ils présentés prudemment ?
7. Y a-t-il des affirmations médicales à retirer ?
8. Le CTA est-il naturel ?
9. L’article est-il compatible GEO ?
10. La FAQ répond-elle à de vraies questions ?
11. Le maillage interne est-il suffisant ?
12. Le ton est-il premium mais accessible ?
13. Les phrases sont-elles trop longues ?
14. Y a-t-il du contenu générique à supprimer ?
15. Quelles sections faut-il renforcer ?

Retour attendu :
- score sur 100,
- problèmes critiques,
- améliorations rapides,
- améliorations SEO,
- améliorations GEO,
- version améliorée des passages faibles.
```

---

## 16 — Prompt premier article complet à lancer

```markdown
Tu es un rédacteur SEO expert en entraînement hybride, rameur et performance sportive.

Écris un article complet pour le blog Athlete Compass.

Titre :
“1 km rameur en 3m30 : bon niveau ou pas ?”

Mot-clé principal :
1 km rameur 3m30

Requêtes secondaires :
- temps 1 km rameur
- bon temps rameur 1000m
- 1000m rameur niveau
- rameur 1 km 3 minutes 30
- allure rameur 500m
- test rameur 1 km

Objectif :
Répondre à une personne qui vient de faire 3m30 au 1 km rameur et veut savoir si c’est bien.

Contexte produit :
Athlete Compass permet de calculer son âge athlétique, son Hybrid Score et son profil d’athlète hybride à partir de performances comme le rameur, la course, les tractions, la force et les metcons.

Structure obligatoire :

# 1 km rameur en 3m30 : bon niveau ou pas ?

## Réponse courte

Dire clairement :
Oui, 3m30 au 1 km rameur est un bon à très bon niveau amateur, surtout si la technique est propre.

Préciser :
Cela correspond à une allure moyenne de 1:45 / 500 m.

## Tableau des niveaux au 1 km rameur

Créer un tableau indicatif :
- plus de 4:15
- 4:00
- 3:45
- 3:30
- 3:20
- 3:10
- moins de 3:00

Indiquer le niveau associé.

## Ce que 3m30 dit de ton profil

Analyser :
- puissance jambes/dos,
- cardio court intense,
- capacité à tolérer l’effort,
- intérêt pour un profil hybride.

## Pourquoi ce test ne suffit pas

Expliquer :
- 1 km est un effort court,
- il ne mesure pas l’endurance longue,
- il ne mesure pas la force relative,
- il ne mesure pas la résistance musculaire globale.

## Les prochains tests à faire

Recommander :
- 2 km rameur,
- 5 km course,
- tractions strictes,
- 50 burpees,
- front squat x5.

## Objectifs réalistes après 3m30

Donner :
- prochain palier : 3m25,
- objectif fort : 3m20,
- objectif très avancé : 3m15.

## Deux séances pour progresser

Séance 1 :
8 × 250 m fort, repos 60-90 sec.

Séance 2 :
4 × 500 m, repos 2 min.

Ajouter conseils :
- ne pas tester toutes les semaines,
- garder une bonne technique,
- progresser aussi sur le 2 km.

## Ce que cela peut dire de ton âge athlétique

Expliquer :
Une performance comme 3m30 peut indiquer un moteur court supérieur à la moyenne, mais l’âge athlétique global dépend aussi de la force, de l’endurance, du core, de la récupération et de la composition.

Ajouter :
“L’âge athlétique est une estimation de performance, pas une mesure biologique ni un diagnostic médical.”

## CTA

Insérer :
“Tu peux entrer ton temps au 1 km rameur dans Athlete Compass pour découvrir ton âge athlétique estimé, ton Hybrid Score et ton prochain test recommandé.”

## FAQ

Créer 6 questions :
- 3m30 au 1 km rameur est-il un bon temps ?
- Quelle est l’allure moyenne pour 3m30 ?
- Quel temps viser au 2 km rameur ?
- Faut-il tester son 1 km souvent ?
- Le rameur suffit-il pour devenir athlète hybride ?
- Comment améliorer son 1 km rameur ?

Ton :
- clair,
- direct,
- expert,
- encourageant.

Contraintes :
- Pas de promesse médicale.
- Les standards sont indicatifs.
- Pas de comparaison excessive avec athlètes élite.
```

---

# Utilisation recommandée

Pour produire le premier article :

1. Utiliser le **prompt 16** pour générer l’article.
2. Passer l’article dans le **prompt 15** pour l’audit qualité.
3. Passer la version corrigée dans le **prompt 12** pour générer un fichier `.mdx` prêt à publier.
4. Utiliser le **prompt 14** pour transformer l’article en posts LinkedIn, carrousel Instagram, Shorts/TikTok, Pinterest et newsletter.
5. Utiliser le **prompt 11** dès que 5 à 10 articles sont publiés pour organiser le maillage interne.

