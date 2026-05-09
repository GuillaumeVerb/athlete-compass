# Athlete Compass — prompts complets dans l’ordre d’exécution

Ce document regroupe tous les prompts à donner à Codex / Cursor pour construire puis enrichir **Athlete Compass**.

Objectif du produit :

> Découvrir son âge athlétique, son Hybrid Score, son profil d’athlète, ses limites, son plan minimal de progression, puis évoluer vers un dashboard quotidien avec readiness, coach hybride, recomposition et intégrations santé futures.

---

# Ordre d’exécution conseillé

1. `00_prompt_maitre_v1.md` — Créer la V1 produit
2. `01_recreer_ecrans_reference.md` — Recréer les écrans premium
3. `02_scoring_deterministe.md` — Renforcer le scoring
4. `03_design_ux_premium.md` — Polir le design / UX
5. `04_premium_business.md` — Simuler le premium / pricing
6. `05_roadmap_v2_v6.md` — Roadmap produit
7. `06_daily_dashboard.md` — Ajouter dashboard quotidien
8. `07_readiness_score.md` — Ajouter Readiness Score
9. `08_coach_hybride.md` — Ajouter coach hybride contextuel
10. `09_body_progress.md` — Ajouter recomposition / body progress
11. `10_training_debt.md` — Ajouter dette d’entraînement
12. `11_future_athletic_age.md` — Ajouter projection d’âge athlétique
13. `12_mobile_first_polish.md` — Optimiser mobile-first
14. `13_today_homepage.md` — Faire de “Aujourd’hui” l’accueil post-onboarding
15. `14_integrations_sante_roadmap.md` — Documenter intégrations santé futures
16. `15_prompt_maitre_evolution_v2.md` — Prompt global pour orchestrer toutes les évolutions

---

# 00 — Prompt maître V1

```markdown
Tu es un senior full-stack engineer + product designer + fitness domain expert.

Je veux construire une mini webapp SaaS appelée "Athlete Compass".

Objectif du produit :
Créer une webapp qui permet à un utilisateur de découvrir :
1. son âge athlétique estimé,
2. son Hybrid Score,
3. son profil d’athlète hybride,
4. son principal limiteur,
5. son Performance Gap,
6. son prochain meilleur mouvement,
7. un plan minimal de 4 semaines pour progresser.

Le produit ne doit PAS être une app fitness généraliste.
Il doit être un outil de diagnostic et de progression pour les personnes qui veulent un physique hybride / crossfiter / HYROX-like.

Positionnement :
"Tu connais ton âge réel et ton poids. Mais connais-tu l’âge de ton corps de performance ?"

Public cible :
- hommes et femmes de 25 à 45 ans,
- pratiquants muscu + course,
- personnes qui veulent un physique crossfiter / hybride,
- personnes qui s’entraînent en salle classique sans forcément avoir accès à une box CrossFit,
- personnes qui veulent savoir si leur entraînement va dans la bonne direction.

Stack souhaitée :
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts pour les graphiques
- Zod pour la validation
- Pas besoin d’authentification en V1
- Stockage local côté client en V1
- Prévoir architecture future pour Supabase et Stripe

Pages V1 :
1. Landing page
2. Formulaire profil
3. Formulaire performances
4. Résultat gratuit
5. Rapport détaillé verrouillé visuellement comme future offre premium
6. Page plan 4 semaines

Données profil :
- âge
- sexe
- taille
- poids
- tour de taille optionnel
- objectif principal : physique crossfiter, HYROX, recomposition, endurance, force esthétique
- fréquence d’entraînement
- matériel disponible : rameur, SkiErg, vélo, tapis incliné, kettlebells, haltères, barre, sled, box, machine poulie
- contraintes : pas de course, éviter de charger les cuisses, seulement 3 jours/semaine, séances courtes, salle classique

Tests V1 :
- 1 km rameur
- 2 km rameur
- 5 km course
- tractions strictes
- front squat x5
- développé militaire x5
- deadlift x5
- 50 burpees
- farmer carry
- hollow hold

Important :
L’utilisateur ne doit pas être obligé de remplir tous les tests.
L’app doit calculer un score provisoire avec une fiabilité du score.
Exemple :
"Score provisoire — fiabilité 42 %. Ajoute ton 5 km, tes tractions et ton front squat pour fiabiliser ton profil."

Scores à calculer :
1. Cardio Intense Score
2. Endurance Score
3. Force Score
4. Muscular Endurance Score
5. Core & Carry Score
6. Hybrid Score global
7. Athletic Age estimé
8. Score reliability
9. Performance Gap
10. Next Best Move

Affichage résultat :
- carte principale : Âge réel vs âge athlétique
- Hybrid Score sur 100
- radar chart : force, cardio intense, endurance, résistance musculaire, core
- profil athlétique : Moteur Court, Strong but Slow, Diesel, Crossfit Build, HYROX Ready, Balanced Hybrid, Under-Recovered
- limiteur principal
- prochain test recommandé
- prochain meilleur mouvement
- objectifs 4 semaines

Règles de scoring :
Créer une première version déterministe simple.
Pas besoin d’être scientifiquement parfaite.
Mais le scoring doit être cohérent, explicable et facilement modifiable.

Exemple :
Pour un homme, 1 km rameur :
- 4:15 ou plus = score faible
- 3:55 = moyen
- 3:40 = bon
- 3:30 = très bon
- 3:20 = excellent
- 3:10 = très avancé

Pour les exercices de force, utiliser le poids de corps pour calculer une force relative.
Exemple :
front squat x5 / poids de corps.
développé militaire x5 / poids de corps.
deadlift x5 / poids de corps.

Le rapport doit éviter toute promesse médicale.
Toujours afficher :
"L’âge athlétique est une estimation de performance, pas une mesure biologique ni un diagnostic médical."

Design :
Premium, sportif, sombre mais pas agressif.
Inspiré dashboards modernes :
- fond sombre ou gris profond,
- cartes arrondies,
- accent vert/bleu électrique ou ambre,
- typographie nette,
- visualisations simples,
- pas de surcharge.

Ton UX :
L’utilisateur doit comprendre son résultat en moins de 10 secondes.

Structure des composants :
- components/landing/hero.tsx
- components/forms/profile-form.tsx
- components/forms/performance-form.tsx
- components/results/athletic-age-card.tsx
- components/results/hybrid-score-card.tsx
- components/results/radar-chart.tsx
- components/results/profile-card.tsx
- components/results/limiter-card.tsx
- components/results/next-best-move-card.tsx
- components/plan/four-week-plan.tsx
- lib/scoring/
- lib/scoring/cardio.ts
- lib/scoring/force.ts
- lib/scoring/endurance.ts
- lib/scoring/profiles.ts
- lib/scoring/athletic-age.ts
- lib/scoring/reliability.ts
- lib/plans/generate-plan.ts
- lib/equipment/equivalences.ts

Livrables attendus :
1. Créer l’architecture du projet
2. Implémenter les pages V1
3. Implémenter le scoring déterministe
4. Implémenter les formulaires
5. Implémenter le dashboard résultat
6. Ajouter des données exemples pour tester
7. Ajouter un README expliquant le scoring et les limites
8. Ajouter une todo roadmap V2/V3

Priorité :
Ne pas surcomplexifier.
Je veux une V1 fonctionnelle, belle, démontrable, avec une vraie sensation produit.
```

---

# 01 — Recréer les écrans de référence

```markdown
Tu es un senior product designer + frontend engineer.

Je veux que tu recrées une webapp SaaS appelée **Athlete Compass**, en te basant très fortement sur les écrans de référence fournis.

Objectif :
Reproduire une interface premium, sportive, sombre, moderne, type “performance lab”, pour une app qui calcule :
- l’âge athlétique,
- le Hybrid Score,
- le profil d’athlète,
- le prochain test recommandé,
- le plan 4 semaines,
- les offres premium.

IMPORTANT :
Ne change pas radicalement le style.
Ne pars pas vers une app fitness générique.
Je veux une interface très proche des écrans de référence : dark UI, cartes arrondies, sidebar, vert néon, jaune/ambre pour le premium, dashboard clair, sensation SaaS sportif premium.

Stack :
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react pour les icônes
- Recharts pour les graphiques
- Pas d’authentification en V1
- Pas de backend en V1
- Données mockées/locales

Écrans à créer :

## 1. Landing page

Style :
- fond sombre premium
- hero à gauche avec gros titre
- visuel athlète sombre à droite ou bloc image placeholder si pas d’image disponible
- accent vert néon
- header avec logo Athlete Compass, liens Fonctionnalités, À propos, Tarifs
- CTA principal vert : “Commencer mon bilan gratuit”
- sous-texte rassurant : “Estimation de performance, pas un diagnostic médical”
- badges : Rapide, Scientifique, Actionnable
- ligne de logos fictifs en bas : HYROX, CrossFit, Rogue, Concept2, Strava

Texte hero :
“Ton âge réel n’est pas ton âge athlétique.”

Sous-titre :
“Découvre ton niveau, tes forces, tes faiblesses et le plan minimal pour devenir un athlète hybride.”

## 2. Formulaire profil

Layout :
- sidebar gauche fixe avec logo + navigation : Profil, Performances, Résultats, Plan 4 semaines
- contenu principal dans une grande carte sombre
- champs à gauche : âge, sexe, taille, poids, tour de taille optionnel
- objectifs à droite sous forme de cartes sélectionnables :
  - Physique Crossfiter
  - HYROX
  - Recomposition
  - Endurance
  - Force & Esthétique
- fréquence d’entraînement sous forme de boutons : 1-2 jours, 3 jours, 4-5 jours, 6+ jours
- bouton vert : “Suivant”

## 3. Formulaire performances

Créer une grille de cartes pour entrer les tests.

Tests :
- 1 km rameur
- 2 km rameur
- 5 km course
- tractions strictes
- front squat x5
- développé militaire x5
- deadlift x5
- 50 burpees
- farmer carry
- hollow hold

Chaque carte doit avoir :
- une icône
- un titre
- une unité
- un input
- un style sombre avec bordure subtile

CTA :
“Voir mes résultats”

## 4. Résultat gratuit

C’est l’écran le plus important.

Structure :
- sidebar gauche
- titre : “Ton aperçu”
- carte fiabilité du score en haut à droite : “Fiabilité du score : 64%”
- grande carte âge athlétique :
  - “Âge athlétique”
  - “29 ans”
  - “Âge réel : 32 ans”
  - badge “-3 ans”
- grande carte Hybrid Score :
  - “76/100”
  - niveau : “Bon”
  - barre de progression verte
- radar chart avec :
  - Force
  - Cardio intense
  - Endurance
  - Résistance musculaire
  - Core & Carry
- carte profil :
  - “Ton profil”
  - “Moteur Court”
  - description courte
- carte prochain test recommandé :
  - “2 km rameur”
  - bouton “Voir pourquoi”
- carte prochaine meilleure action :
  - “Ajouter 1 séance Zone 2 par semaine”
- bandeau premium en bas :
  - “Débloque ton rapport complet pour voir ton plan personnalisé.”
  - bouton vert : “Débloquer mon rapport”

## 5. Rapport détaillé premium verrouillé

Créer une page qui montre les modules premium verrouillés.

Titre :
“Ton rapport complet”

Cartes verrouillées avec icône cadenas :
- Âge par système
- Performance Gap
- Limiteur principal
- Objectifs 4 semaines
- Plan minimal efficace
- Équivalences machines

En bas, afficher 3 offres :
- Bilan complet — 9 €
- Plan 4 semaines — 19 €
- Pack complet — 29 €

Le Pack complet doit être mis en avant avec une bordure jaune/ambre.

## 6. Plan 4 semaines

Créer une page avec :
- tabs : Semaine 1, Semaine 2, Semaine 3, Semaine 4
- liste des séances de la semaine :
  - Séance 1 — Force Haut du corps
  - Séance 2 — Zone 2
  - Séance 3 — Force Jambes
  - Séance 4 — Metcon Court
  - Séance 5 — Hybride & Core
- tags à droite : Force, Endurance, Conditioning, Hybride
- carte objectif de la semaine avec checklist
- carte focus de la semaine avec score de cohérence prévu, exemple : 72%

## 7. Page explication prochain test

Créer une page “Pourquoi ce test ?”

Exemple :
Test recommandé : 2 km rameur

Texte :
“Ton 1 km rameur montre un excellent moteur court. Le 2 km permettra de mesurer ta capacité à tenir l’intensité plus longtemps.”

Liste :
Ce que ce test va améliorer :
- affiner ton score endurance
- mieux évaluer ton profil
- améliorer la fiabilité du score
- adapter ton plan plus précisément

Ajouter une image sombre ou placeholder de rameur à droite.

CTA :
“J’ai compris, retour aux résultats”

## 8. Équivalences machines

Créer une page premium partiellement verrouillée.

Tableau/cartes d’équivalences :
- Rameur
- SkiErg
- Vélo
- Tapis incliné

Exemples :
- 1 km rameur ≈ 1.1 km SkiErg ≈ 3.2 km vélo ≈ 3 km tapis incliné
- 15 min zone 2 rameur ≈ 15 min SkiErg ≈ 20 min vélo ≈ 20 min tapis incliné
- 500 m intense rameur ≈ 500 m SkiErg ≈ 1 km vélo ≈ 1 km tapis incliné

Ajouter un bouton verrouillé :
“Débloquer toutes les équivalences”

## 9. Pricing page

Créer une page pricing avec 3 offres :

### Bilan complet — 9 €
- Rapport détaillé
- Âge athlétique
- Hybrid Score
- Profil athlète
- Prochain test recommandé

### Plan 4 semaines — 19 €
- Objectifs 4 semaines
- Plan d’entraînement
- Séances détaillées
- Cohérence hebdomadaire

### Pack complet — 29 €
- Tout du bilan complet
- Tout du plan 4 semaines
- Équivalences machines
- Retest 30 jours

Mettre le Pack complet en avant avec :
- badge “Le meilleur choix”
- bordure jaune/ambre
- bouton jaune

Design system :
- background principal : noir bleuté / gris très foncé
- cartes : gris anthracite avec légère bordure
- accent principal : vert néon
- accent premium : jaune/ambre
- texte principal : blanc cassé
- texte secondaire : gris clair
- radius : 16-24px
- ombres très subtiles
- icônes fines
- beaucoup d’espace
- look premium, pas cheap

Contraintes UX :
- mobile responsive impeccable
- desktop dashboard très propre
- pas de surcharge de texte
- résultat compréhensible en moins de 10 secondes
- ne jamais présenter l’âge athlétique comme une mesure médicale

Ajouter partout une mention discrète :
“L’âge athlétique est une estimation de performance, pas une mesure biologique ni un diagnostic médical.”

Architecture souhaitée :
- app/page.tsx
- app/profile/page.tsx
- app/performances/page.tsx
- app/results/page.tsx
- app/report/page.tsx
- app/plan/page.tsx
- app/next-test/page.tsx
- app/equivalences/page.tsx
- app/pricing/page.tsx

Composants :
- components/layout/sidebar.tsx
- components/layout/app-shell.tsx
- components/landing/hero.tsx
- components/forms/profile-form.tsx
- components/forms/performance-form.tsx
- components/results/athletic-age-card.tsx
- components/results/hybrid-score-card.tsx
- components/results/radar-chart.tsx
- components/results/profile-card.tsx
- components/results/next-test-card.tsx
- components/results/next-best-move-card.tsx
- components/premium/locked-card.tsx
- components/pricing/pricing-card.tsx
- components/plan/week-plan.tsx

Données :
Créer des données mockées correspondant à ce profil :
- âge : 32
- sexe : homme
- taille : 178
- poids : 78
- tour de taille : 84
- objectif : Physique Crossfiter
- 1 km rameur : 03:32
- 2 km rameur : 07:15
- 5 km course : 24:20
- tractions : 10
- front squat x5 : 105 kg
- développé militaire x5 : 60 kg
- deadlift x5 : 140 kg
- 50 burpees : 08:45
- farmer carry : 40 m en 35 s
- hollow hold : 01:20

Résultat mocké :
- âge athlétique : 29 ans
- âge réel : 32 ans
- Hybrid Score : 76/100
- fiabilité : 64%
- profil : Moteur Court
- prochain test recommandé : 2 km rameur
- prochaine meilleure action : Ajouter 1 séance Zone 2 par semaine

Livrable attendu :
Créer une V1 navigable, belle, cohérente, proche des écrans de référence, avec données mockées.
Ne pas implémenter de logique complexe pour l’instant.
Priorité absolue : reproduire le rendu visuel et l’expérience produit.
```

---

# 02 — Scoring déterministe

```markdown
Améliore uniquement la logique de scoring de l’application Athlete Compass.

Objectif :
Créer un scoring déterministe clair, explicable et extensible.

Scores nécessaires :
1. Cardio Intense Score
2. Endurance Score
3. Force Score
4. Muscular Endurance Score
5. Core & Carry Score
6. Hybrid Score
7. Athletic Age
8. Score Reliability
9. Performance Gap
10. Next Best Move

Contraintes :
- Le score doit fonctionner même si tous les tests ne sont pas remplis.
- Chaque score doit avoir une fiabilité.
- L’app doit recommander les tests manquants les plus utiles.
- L’app doit expliquer pourquoi le score est donné.
- Le scoring doit tenir compte du sexe, de l’âge, du poids, de l’objectif et des contraintes utilisateur.
- Le scoring doit rester simple, déterministe, sans IA en V1.

Implémente :
- types TypeScript propres
- fonctions pures testables
- commentaires expliquant les seuils
- exemples de profils
- tests unitaires si possible

Ajoute une logique de profil :
- Moteur Court
- Strong but Slow
- Diesel
- Balanced Hybrid
- Crossfit Build
- HYROX Ready
- Under-Recovered
- Strength Gap
- Endurance Gap
- Muscular Endurance Gap

Ajoute une logique Next Best Move :
Selon le plus gros déficit, recommander une action simple :
- ajouter zone 2
- ajouter tractions/force relative
- ajouter metcon court
- réduire intensité
- tester 2 km rameur
- tester 5 km course
- tester front squat x5
- ajouter carries/core

Ne modifie pas le design, concentre-toi sur lib/scoring et les fonctions de calcul.
```

---

# 03 — Design / UX premium

```markdown
Améliore le design de Athlete Compass.

Objectif :
Donner à la webapp une apparence premium, sportive, moderne et très lisible.

Style souhaité :
- dashboard sombre premium
- cartes arrondies
- typographie forte
- hiérarchie visuelle claire
- accent color électrique mais sobre
- sensation "performance lab"
- pas de look app médicale
- pas de look bodybuilding cheap
- pas de surcharge de texte

La page résultat doit faire comprendre en moins de 10 secondes :
1. mon âge athlétique,
2. mon score hybride,
3. mon profil,
4. mon limiteur principal,
5. ma prochaine action.

Améliorations attendues :
- meilleure landing page
- meilleure carte Athletic Age
- radar chart plus lisible
- badges de profil
- score reliability visible
- CTA vers rapport premium
- section plan 4 semaines plus claire
- responsive mobile impeccable

Important :
Garde le produit très crédible.
Ne mets pas de promesses médicales.
Affiche clairement :
"Estimation de performance, pas diagnostic médical."

Ne change pas la logique métier sauf si nécessaire pour l’affichage.
```

---

# 04 — Premium / business

```markdown
Ajoute une couche premium simulée à Athlete Compass.

Objectif :
Préparer la monétisation sans intégrer Stripe pour l’instant.

Modèle :
Gratuit :
- âge athlétique estimé
- Hybrid Score
- profil athlétique
- fiabilité du score
- prochain test recommandé

Premium :
- âge par système
- Performance Gap détaillé
- limiteur principal expliqué
- objectifs 4 semaines
- plan minimal efficace
- équivalences machines
- protocole de retest à 30 jours
- export rapport PDF plus tard

À implémenter :
- cartes premium verrouillées visuellement
- CTA "Débloquer mon rapport complet"
- page pricing simple
- mock checkout disabled
- texte marketing clair
- ne pas intégrer Stripe pour l’instant

Prix affiché :
- Bilan complet : 9 €
- Plan 4 semaines : 19 €
- Pack complet : 29 €

But :
Tester la valeur perçue avant de construire une vraie infrastructure paiement.
```

---

# 05 — Roadmap V2 / V6

```markdown
Crée une roadmap produit détaillée pour Athlete Compass.

Structure :
V1 — Calculateur et diagnostic
V2 — Rapport premium et paiement
V3 — Historique et progression 30 jours
V4 — Plans adaptatifs
V5 — Version coach / salle
V6 — Intégrations Strava, Garmin, Apple Health, Google Fit, Concept2

Pour chaque version, détaille :
- objectif produit
- features
- écrans
- données nécessaires
- complexité technique
- risques
- critères de succès
- métriques à suivre

Mets à jour le README avec cette roadmap.
Ajoute aussi un fichier ROADMAP.md.
```

---

# 06 — Daily Dashboard

```markdown
Tu es un senior product designer + frontend engineer.

Je veux ajouter à Athlete Compass un nouvel écran : **Daily Dashboard**.

Objectif :
Transformer Athlete Compass d’un simple outil de bilan ponctuel en compagnon quotidien de progression.

Important :
Ne transforme pas l’app en tracker santé généraliste.
Tout doit rester orienté vers :
- âge athlétique,
- progression hybride,
- récupération,
- mission du jour,
- physique crossfiter / HYROX-like.

Nouvelle page :
`app/daily/page.tsx`

Ajouter aussi un lien dans la sidebar :
- Profil
- Performances
- Résultats
- Daily
- Plan 4 semaines
- Pricing

Contenu du dashboard quotidien :

## Header
Texte :
“Bonjour, voici ton état du jour.”

Sous-texte :
“Ta mission : progresser sans accumuler de fatigue inutile.”

## Carte principale : Mission du jour

Afficher :
- Readiness Score : 72 %
- Séance recommandée : Zone 2 + mobilité
- Intensité conseillée : Modérée
- À éviter : Metcon jambes intense
- Objectif du jour : Construire le moteur sans fatiguer les jambes

Texte exemple :
“Ton profil montre un bon moteur court, mais ta récupération est moyenne aujourd’hui. Le meilleur choix est une séance Zone 2 ou un haut du corps modéré.”

## Cartes résumé

Créer 4 cartes avec mini graphiques :
1. Sommeil
   - 7h10
   - Qualité : bonne

2. Fatigue ressentie
   - 4/10
   - Statut : acceptable

3. Activité
   - 8 900 pas
   - Objectif : 10 000

4. Récupération
   - 68 %
   - Statut : moyenne

## Carte âge athlétique

Afficher :
- Âge réel : 37 ans
- Âge athlétique : 33 ans
- Variation : -1 an depuis le dernier bilan
- Focus actuel : endurance longue + force relative

## Carte “Ce que tu dois faire aujourd’hui”

Afficher 3 actions :
- 35 à 45 min Zone 2
- 8 min mobilité hanches/chevilles
- Pas de test maximal aujourd’hui

## Carte “Ce qu’il faut éviter”

Afficher :
- Burpees en volume élevé
- Escalier intense
- Intervalles rameur très durs
- Séance jambes lourde si fatigue > 6/10

Design :
- dark UI premium
- cartes arrondies
- accent vert néon
- accent ambre pour les alertes
- mini courbes ou progress bars
- mobile-first impeccable

Créer des données mockées dans :
`lib/mock/daily.ts`

Ne pas intégrer d’API santé en V1.
Toutes les données sont mockées ou saisies manuellement.
```

---

# 07 — Readiness Score

```markdown
Tu es un senior TypeScript engineer spécialisé en logique produit.

Je veux ajouter à Athlete Compass un **Readiness Score** déterministe.

Objectif :
Aider l’utilisateur à savoir s’il doit pousser fort, s’entraîner modérément ou récupérer.

Créer :
`lib/scoring/readiness.ts`

Le Readiness Score doit être sur 100.

Entrées :
- sleepHours
- sleepQuality de 1 à 5
- fatigue de 1 à 10
- soreness de 1 à 10
- motivation de 1 à 10
- restingHeartRate optionnel
- previousDayIntensity : rest, easy, moderate, hard, very_hard
- weeklyTrainingLoad : low, normal, high, very_high

Sorties :
- readinessScore sur 100
- status : excellent, good, moderate, low, very_low
- recommendationType : push, train_normal, moderate, deload, rest
- warningMessage optionnel
- recommendedSessionType
- avoidToday array
- explanation courte

Règles simples :
- sommeil < 6h pénalise fortement
- fatigue > 7 pénalise fortement
- soreness > 7 pénalise les séances jambes/metcon
- previousDayIntensity very_hard réduit la readiness
- weeklyTrainingLoad very_high réduit la readiness
- motivation basse réduit légèrement
- bonne qualité de sommeil améliore le score

Exemples de recommandations :

Si score > 80 :
“Tu peux pousser aujourd’hui. Bonne journée pour force ou intervalles.”

Si score entre 65 et 80 :
“Entraînement normal possible. Garde 1 à 2 reps en réserve.”

Si score entre 45 et 65 :
“Privilégie une séance modérée, Zone 2 ou technique.”

Si score < 45 :
“Réduis fortement l’intensité. Mobilité, marche ou repos actif.”

Ajouter des tests unitaires simples si le projet en a déjà.
Sinon, créer au minimum des exemples commentés dans le fichier.

Brancher le Readiness Score sur la page Daily Dashboard.
```

---

# 08 — Coach Hybride contextuel

```markdown
Tu es un senior product engineer.

Je veux ajouter un module **Coach Hybride** à Athlete Compass.

Objectif :
Créer une expérience de coach intelligent sans construire un chatbot libre complexe en V1.

Le Coach Hybride doit apparaître sur le Daily Dashboard et sur la page Résultats.

Il doit proposer des boutons rapides :

- “Adapter ma séance”
- “Je suis fatigué”
- “Je n’ai que 30 minutes”
- “Remplacer une machine”
- “Je veux progresser au rameur”
- “Je veux éviter de trop charger les cuisses”
- “Quelle est ma prochaine meilleure action ?”

En V1, ne pas intégrer d’API LLM.
Créer une logique déterministe avec réponses pré-écrites selon :
- profil athlétique
- limiteur principal
- objectif utilisateur
- readiness score
- matériel disponible
- contraintes utilisateur

Créer :
`lib/coach/coach-responses.ts`
`components/coach/hybrid-coach-card.tsx`
`components/coach/quick-action-button.tsx`

Exemples de réponses :

## Cas : utilisateur fatigué + readiness < 60
Réponse :
“Évite de transformer cette journée en test mental. Fais 35-45 minutes de Zone 2 ou une séance haut du corps légère. Ton objectif aujourd’hui est de préserver la progression, pas d’ajouter de la fatigue.”

## Cas : pas de SkiErg
Réponse :
“Tu peux remplacer le SkiErg par du rameur si tu acceptes plus de travail jambes/dos, ou par du vélo si tu veux limiter l’impact. Pour garder le stimulus haut du corps, ajoute tirage poulie + gainage.”

## Cas : éviter grosses cuisses
Réponse :
“Évite les gros volumes d’escalier, de fentes et de vélo lourd. Privilégie tapis incliné modéré, SkiErg, rameur technique, Zone 2 et renforcement haut du corps.”

## Cas : progresser rameur
Réponse :
“Garde deux séances rameur : une séance intervalles courts type 8 × 250 m, et une séance endurance intense type 4 × 500 m. Ne teste pas ton 1 km toutes les semaines.”

Design :
- carte sombre premium
- avatar ou icône coach
- champ visuel type chat mais non interactif complexe
- boutons rapides
- réponse affichée dans une bulle
- CTA premium discret : “Débloquer le coach adaptatif”

Important :
Le Coach Hybride doit rester prudent.
Il ne doit pas donner de conseil médical.
Ajouter une mention :
“Conseils d’entraînement généraux, à adapter à tes sensations.”
```

---

# 09 — Body Progress / recomposition

```markdown
Tu es un senior product designer + frontend engineer.

Je veux ajouter un module **Body Progress** à Athlete Compass.

Objectif :
Suivre la recomposition physique sans tomber dans une app de perte de poids classique.

Créer une page :
`app/body-progress/page.tsx`

Ajouter le lien dans la sidebar :
- Body Progress

Données à suivre :
- poids
- tour de taille
- tour de poitrine optionnel
- tour de bras optionnel
- tour de cuisse optionnel
- estimation masse grasse optionnelle
- photos de progression plus tard, mais pas en V1
- note énergie de 1 à 10
- note sommeil de 1 à 10

Créer des cartes :

## Carte Recomposition Signal

Exemples de statuts :
- “Très bon signal”
- “Progression probable”
- “Maintenance”
- “Risque de perte de performance”
- “Surplus probable”

Logique simple :
- si tour de taille baisse et performances montent : très bon signal
- si poids baisse mais performances chutent : déficit trop agressif
- si poids monte et tour de taille monte : surplus probable
- si poids stable, taille baisse, performance stable ou hausse : recomposition idéale

## Carte tendances

Afficher mini courbes :
- poids
- tour de taille
- Hybrid Score
- âge athlétique

## Carte interprétation

Exemple :
“Ton poids est stable, mais ton tour de taille baisse et ton score rameur progresse. C’est un signal très positif de recomposition : tu ne perds pas seulement du poids, tu construis un corps plus performant.”

Design :
- dark UI premium
- mini charts Recharts
- cartes simples
- pas de culpabilisation
- pas de langage régime agressif

Important :
Ne jamais promettre de mesurer précisément la masse grasse.
Si masse grasse affichée :
“Estimation déclarative, non médicale.”
```

---

# 10 — Training Debt

```markdown
Tu es un senior product strategist + engineer.

Je veux ajouter un concept différenciant à Athlete Compass : **Training Debt**.

Objectif :
Dire à l’utilisateur quelle dette son entraînement crée actuellement.

Créer :
`lib/scoring/training-debt.ts`
`components/results/training-debt-card.tsx`

Types de Training Debt :
1. Dette cardio
2. Dette force
3. Dette endurance
4. Dette résistance musculaire
5. Dette récupération
6. Dette mobilité
7. Dette cohérence
8. Dette jambes

Entrées :
- scores actuels : force, cardio intense, endurance, résistance, core
- readiness score
- fréquence d’entraînement
- objectif
- contraintes
- séances hebdomadaires déclarées
- fatigue
- douleurs
- sommeil

Sortie :
- primaryDebt
- severity : low, moderate, high
- explanation
- recommendedCorrection
- avoidThisWeek

Exemples :

## Dette force
“Tu as un moteur correct, mais ta force relative limite ton physique hybride. Ajoute 2 expositions force par semaine : tractions, développé militaire, front squat.”

## Dette endurance
“Tu as une bonne intensité courte, mais ton profil manque d’endurance de base. Ajoute 1 séance Zone 2 de 40 à 50 minutes.”

## Dette récupération
“Tu accumules de l’intensité avec une récupération moyenne. Cette semaine, le meilleur progrès vient d’une meilleure distribution des efforts.”

## Dette jambes
“Ton volume jambes est probablement trop dense : course, escalier, fentes et squat proches les uns des autres. Répartis mieux l’intensité.”

Afficher cette carte sur :
- page Résultats
- Daily Dashboard
- rapport premium

Design :
- carte sombre
- badge couleur selon sévérité
- action corrective claire
```

---

# 11 — Future Athletic Age

```markdown
Tu es un senior product engineer.

Je veux ajouter une feature premium appelée **Future Athletic Age**.

Objectif :
Projeter l’âge athlétique estimé dans 4 à 8 semaines si l’utilisateur atteint certains objectifs.

Créer :
`lib/scoring/future-athletic-age.ts`
`components/premium/future-athletic-age-card.tsx`

Entrées :
- âge athlétique actuel
- scores actuels
- objectif utilisateur
- limiteur principal
- objectifs 4 semaines générés
- performances actuelles

Sortie :
- currentAthleticAge
- projectedAthleticAge
- improvementPotential
- requiredMilestones
- confidence : low, medium, high
- explanation

Exemple :
Âge athlétique actuel : 36 ans
Projection 8 semaines : 33 ans

Milestones :
- passer le 1 km rameur de 3:30 à 3:24
- passer les tractions de 8 à 12
- faire 1 séance Zone 2 par semaine pendant 4 semaines
- réduire le tour de taille de 2 cm sans perte de force

Important :
Présenter cela comme une projection de performance, pas une promesse médicale.

Texte obligatoire :
“Projection indicative basée sur tes performances déclarées. Ce n’est pas une mesure biologique.”

Afficher cette carte dans le rapport premium verrouillé ou débloqué.
```

---

# 12 — Mobile-first polish

```markdown
Tu es un senior mobile-first product designer.

Je veux améliorer l’expérience mobile de Athlete Compass en m’inspirant des apps fitness premium modernes.

Objectif :
Sur mobile, l’app doit donner une impression immédiate de coach personnel premium.

Priorité :
- Daily Dashboard mobile
- Résultats mobile
- Plan 4 semaines mobile
- Coach Hybride mobile

Créer ou améliorer :
- responsive layout
- bottom navigation mobile
- cartes verticales
- CTA sticky
- grands chiffres lisibles
- mini graphes simples
- coach card en bas de dashboard

Sur mobile, la page Daily doit afficher dans cet ordre :

1. Header :
“Bonjour Guillaume”
“Voici ton résumé du jour.”

2. Carte principale :
Readiness Score + Mission du jour

3. Cartes compactes :
- Sommeil
- Récupération
- Activité
- Fatigue

4. Carte :
Âge athlétique

5. Carte :
Coach Hybride

6. Carte :
Ce qu’il faut faire aujourd’hui

7. Carte :
Ce qu’il faut éviter

Design :
- dark premium
- beaucoup d’espace
- gros chiffres
- micro animations légères
- pas de surcharge
- CTA clair

Ne pas sacrifier le desktop.
Mais la version mobile doit être prioritaire pour l’usage quotidien à la salle.
```

---

# 13 — Page “Aujourd’hui” comme accueil post-onboarding

```markdown
Tu es un senior UX designer + frontend engineer.

Je veux que l’écran d’accueil après onboarding ne soit plus seulement les résultats, mais une page **Aujourd’hui**.

Objectif :
Créer une boucle quotidienne.

Après que l’utilisateur a rempli son profil et ses performances, il arrive sur :
`/daily`

La page `/results` reste disponible pour le bilan complet.

Sur `/daily`, afficher :
- résumé du jour
- âge athlétique
- readiness
- mission du jour
- next best move
- coach hybride
- accès rapide au plan 4 semaines
- bouton “Mettre à jour mes données”

Ajouter CTA :
- “J’ai fait ma séance”
- “Je suis fatigué”
- “Adapter ma séance”

En V1, ces CTA peuvent ouvrir un état mocké ou un simple panneau avec recommandations.

Important :
L’app doit donner envie d’être ouverte tous les jours.
Mais elle ne doit pas devenir un simple habit tracker.
Tout doit ramener à :
- progression athlétique
- réduction de l’âge athlétique
- cohérence d’entraînement
- meilleure récupération
```

---

# 14 — Intégrations santé futures

```markdown
Tu es un senior product manager.

Je veux mettre à jour la roadmap de Athlete Compass pour intégrer plus tard les données santé et fitness.

Ne code pas les intégrations maintenant.
Mets seulement à jour :
- README.md
- ROADMAP.md
- éventuellement docs/integrations.md

Intégrations futures à prévoir :
- Apple Health
- Google Fit
- Garmin
- Strava
- Concept2 Logbook
- Fitbit
- Whoop

Pour chaque intégration, préciser :
- données utiles
- complexité
- valeur utilisateur
- priorité
- risques

Données utiles :
- pas quotidiens
- fréquence cardiaque au repos
- sommeil
- entraînements
- distances course
- sorties vélo
- rameur Concept2
- calories approximatives
- HRV si disponible
- charge d’entraînement

Important :
La V1 doit rester sans intégration.
L’argument marketing est :
“Pas besoin de montre connectée pour commencer.”

Roadmap souhaitée :
V1 : bilan manuel + âge athlétique + score
V1.5 : daily dashboard manuel
V2 : rapport premium + paiement
V3 : historique + retest 30 jours
V4 : coach hybride contextuel
V5 : intégrations santé
V6 : version coachs / salles
```

---

# 15 — Prompt maître évolution V2

```markdown
Tu es un senior full-stack engineer + product designer + product strategist.

Je veux faire évoluer Athlete Compass.

Contexte :
Athlete Compass est une webapp SaaS qui calcule :
- âge athlétique,
- Hybrid Score,
- profil d’athlète,
- limiteur principal,
- Performance Gap,
- plan minimal 4 semaines.

Nouvelle direction :
Ajouter une dimension quotidienne inspirée des apps premium de coaching fitness, mais sans devenir une app santé généraliste.

Nouvelle promesse :
“Chaque jour, Athlete Compass te dit quoi faire pour devenir plus hybride, plus performant et faire baisser ton âge athlétique — sans accumuler de fatigue inutile.”

À ajouter :
1. Daily Dashboard
2. Readiness Score
3. Mission du jour
4. Coach Hybride contextuel
5. Suivi composition / recomposition
6. Training Debt
7. Future Athletic Age
8. Mobile-first UX
9. Roadmap intégrations santé futures

Contraintes :
- Ne pas intégrer d’API santé en V1
- Ne pas intégrer de LLM en V1
- Utiliser données mockées ou manuelles
- Garder une logique déterministe
- Rester premium, sobre, sportif
- Ne jamais faire de promesse médicale
- Répéter que l’âge athlétique est une estimation de performance

Architecture souhaitée :
- app/daily/page.tsx
- app/body-progress/page.tsx
- lib/scoring/readiness.ts
- lib/scoring/training-debt.ts
- lib/scoring/future-athletic-age.ts
- lib/coach/coach-responses.ts
- lib/mock/daily.ts
- components/daily/
- components/coach/
- components/body-progress/
- components/results/training-debt-card.tsx
- components/premium/future-athletic-age-card.tsx

Priorité d’exécution :
1. Daily Dashboard visuel avec données mockées
2. Readiness Score déterministe
3. Coach Hybride à boutons rapides
4. Training Debt
5. Body Progress
6. Future Athletic Age
7. Mobile polish
8. Documentation roadmap

Ne casse pas l’existant.
Garde les pages existantes.
Ajoute les nouvelles features progressivement.
```

---

# Notes produit importantes à conserver

## Ne pas devenir une app fitness générique

Athlete Compass doit rester un outil de diagnostic + progression, pas un tracker complet.

La phrase à répéter à Codex / Cursor :

> Ce n’est pas une app fitness généraliste. C’est un diagnostic de corps performant + un plan minimal pour devenir plus hybride.

## Promesse centrale

> Tu connais ton poids. Mais connais-tu l’âge de ton corps de performance ?

## Formulation prudente

Toujours afficher :

> L’âge athlétique est une estimation de performance, pas une mesure biologique ni un diagnostic médical.

## V1 : ne pas surcomplexifier

La V1 doit être :
- belle,
- crédible,
- démontrable,
- manuelle,
- sans API santé,
- sans auth obligatoire,
- sans paiement réel,
- mais avec une forte valeur perçue.

## Ce qui fait payer

Les gens ne paient pas pour un score seul.
Ils paient pour :
- le diagnostic,
- la lecture de leurs faiblesses,
- le plan minimal,
- les objectifs,
- la projection,
- le suivi 30 jours,
- la simplicité.

## Meilleur modèle de départ

Gratuit :
- âge athlétique estimé,
- Hybrid Score,
- profil,
- prochain test.

Payant :
- bilan complet 9 €,
- plan 4 semaines 19 €,
- pack complet 29 €.

## Évolution future

> **Source de vérité produit** : les versions détaillées (objectifs, risques, métriques, écrans) sont dans **[`ROADMAP.md`](ROADMAP.md)**. Le résumé ci-dessous évite la dérive par rapport à ce fichier.

- **V1** — Calculateur + diagnostic (profil, performances, âge athlétique, Hybrid Score, limiteur, plan minimal en aperçu, premium simulé).
- **V1.5** — Boucle quotidienne **manuelle** : `/daily`, readiness, coach déterministe, dette d’entraînement, projection âge futur, body progress démo.
- **V2** — Rapport premium + **paiement** (Stripe, accès rapport, e-mail).
- **V3** — **Historique** bilans + **retest ~30 j** + courbes progression.
- **V4** — **Plans adaptatifs** (feedback, substitutions, contraintes).
- **V5** — **Coach / salle** (B2B, multi-clients, PDF brandé).
- **V6** — **Intégrations** données externes (Strava, Garmin, Apple Health, etc.) — voir aussi [`docs/integrations.md`](docs/integrations.md).

_Ancienne version de ce bloc (V4 = coach, V5 = intégrations, V6 = salles) était obsolète par rapport au produit et à `ROADMAP.md`._
