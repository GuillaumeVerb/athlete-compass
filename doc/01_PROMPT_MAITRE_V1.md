# Prompt 01 — Prompt maître V1

Tu es un senior full-stack engineer + product designer + fitness domain expert.

Je veux construire une mini webapp SaaS appelée **Athlete Compass**.

## Objectif du produit

Créer une webapp qui permet à un utilisateur de découvrir :

1. son âge athlétique estimé ;
2. son Hybrid Score ;
3. son profil d’athlète hybride ;
4. son principal limiteur ;
5. son Performance Gap ;
6. son prochain meilleur mouvement ;
7. un plan minimal de 4 semaines pour progresser.

Le produit ne doit PAS être une app fitness généraliste. Il doit être un outil de diagnostic et de progression pour les personnes qui veulent un physique hybride / crossfiter / HYROX-like.

## Positionnement

> Tu connais ton âge réel et ton poids. Mais connais-tu l’âge de ton corps de performance ?

## Public cible

- hommes et femmes de 25 à 45 ans ;
- pratiquants muscu + course ;
- personnes qui veulent un physique crossfiter / hybride ;
- personnes qui s’entraînent en salle classique sans forcément avoir accès à une box CrossFit ;
- personnes qui veulent savoir si leur entraînement va dans la bonne direction.

## Stack souhaitée

- Next.js App Router ;
- TypeScript ;
- Tailwind CSS ;
- shadcn/ui ;
- lucide-react pour les icônes ;
- Recharts pour les graphiques ;
- Zod pour la validation ;
- pas besoin d’authentification en V1 ;
- stockage local côté client en V1 ;
- prévoir une architecture future pour Supabase et Stripe, mais ne pas les intégrer maintenant.

## Pages V1

1. Landing page ;
2. Formulaire profil ;
3. Formulaire performances ;
4. Résultat gratuit ;
5. Rapport détaillé verrouillé visuellement comme future offre premium ;
6. Page plan 4 semaines ;
7. Page pricing ;
8. Page équivalences machines ;
9. Page explication du prochain test recommandé.

## Données profil

- âge ;
- sexe ;
- taille ;
- poids ;
- tour de taille optionnel ;
- objectif principal : physique crossfiter, HYROX, recomposition, endurance, force esthétique ;
- fréquence d’entraînement ;
- matériel disponible : rameur, SkiErg, vélo, tapis incliné, kettlebells, haltères, barre, sled, box, machine poulie ;
- contraintes : pas de course, éviter de charger les cuisses, seulement 3 jours/semaine, séances courtes, salle classique.

## Tests V1

- 1 km rameur ;
- 2 km rameur ;
- 5 km course ;
- tractions strictes ;
- front squat x5 ;
- développé militaire x5 ;
- deadlift x5 ;
- 50 burpees ;
- farmer carry ;
- hollow hold.

Important : l’utilisateur ne doit pas être obligé de remplir tous les tests. L’app doit calculer un score provisoire avec une fiabilité du score.

Exemple :

> Score provisoire — fiabilité 42 %. Ajoute ton 5 km, tes tractions et ton front squat pour fiabiliser ton profil.

## Scores à calculer

1. Cardio Intense Score ;
2. Endurance Score ;
3. Force Score ;
4. Muscular Endurance Score ;
5. Core & Carry Score ;
6. Hybrid Score global ;
7. Athletic Age estimé ;
8. Score reliability ;
9. Performance Gap ;
10. Next Best Move.

## Affichage résultat

La page résultat doit contenir :

- carte principale : âge réel vs âge athlétique ;
- Hybrid Score sur 100 ;
- radar chart : force, cardio intense, endurance, résistance musculaire, core ;
- profil athlétique : Moteur Court, Strong but Slow, Diesel, Crossfit Build, HYROX Ready, Balanced Hybrid, Under-Recovered ;
- limiteur principal ;
- prochain test recommandé ;
- prochain meilleur mouvement ;
- objectifs 4 semaines.

## Règles de scoring V1

Créer une première version déterministe simple. Pas besoin d’être scientifiquement parfaite, mais le scoring doit être cohérent, explicable et facilement modifiable.

Exemple pour un homme, 1 km rameur :

- 4:15 ou plus = score faible ;
- 3:55 = moyen ;
- 3:40 = bon ;
- 3:30 = très bon ;
- 3:20 = excellent ;
- 3:10 = très avancé.

Pour les exercices de force, utiliser le poids de corps pour calculer une force relative.

Exemples :

- front squat x5 / poids de corps ;
- développé militaire x5 / poids de corps ;
- deadlift x5 / poids de corps.

## Disclaimer obligatoire

Afficher clairement :

> L’âge athlétique est une estimation de performance, pas une mesure biologique ni un diagnostic médical.

## Design

Style attendu :

- premium, sportif, sombre mais pas agressif ;
- inspiration “performance lab” ;
- fond sombre ou gris profond ;
- cartes arrondies ;
- accent vert/bleu électrique ;
- accent jaune/ambre pour les éléments premium ;
- typographie nette ;
- visualisations simples ;
- pas de surcharge.

L’utilisateur doit comprendre son résultat en moins de 10 secondes.

## Structure des composants

Créer au minimum :

- `components/layout/sidebar.tsx`
- `components/layout/app-shell.tsx`
- `components/landing/hero.tsx`
- `components/forms/profile-form.tsx`
- `components/forms/performance-form.tsx`
- `components/results/athletic-age-card.tsx`
- `components/results/hybrid-score-card.tsx`
- `components/results/radar-chart.tsx`
- `components/results/profile-card.tsx`
- `components/results/limiter-card.tsx`
- `components/results/next-test-card.tsx`
- `components/results/next-best-move-card.tsx`
- `components/premium/locked-card.tsx`
- `components/pricing/pricing-card.tsx`
- `components/plan/week-plan.tsx`

Créer aussi :

- `lib/scoring/cardio.ts`
- `lib/scoring/force.ts`
- `lib/scoring/endurance.ts`
- `lib/scoring/profiles.ts`
- `lib/scoring/athletic-age.ts`
- `lib/scoring/reliability.ts`
- `lib/plans/generate-plan.ts`
- `lib/equipment/equivalences.ts`

## Données mockées V1

Utiliser ce profil exemple :

- âge : 32 ;
- sexe : homme ;
- taille : 178 ;
- poids : 78 ;
- tour de taille : 84 ;
- objectif : Physique Crossfiter ;
- 1 km rameur : 03:32 ;
- 2 km rameur : 07:15 ;
- 5 km course : 24:20 ;
- tractions : 10 ;
- front squat x5 : 105 kg ;
- développé militaire x5 : 60 kg ;
- deadlift x5 : 140 kg ;
- 50 burpees : 08:45 ;
- farmer carry : 40 m en 35 s ;
- hollow hold : 01:20.

Résultat mocké :

- âge athlétique : 29 ans ;
- âge réel : 32 ans ;
- Hybrid Score : 76/100 ;
- fiabilité : 64 % ;
- profil : Moteur Court ;
- prochain test recommandé : 2 km rameur ;
- prochaine meilleure action : Ajouter 1 séance Zone 2 par semaine.

## Livrables attendus

1. Créer l’architecture du projet ;
2. Implémenter les pages V1 ;
3. Implémenter le scoring déterministe ;
4. Implémenter les formulaires ;
5. Implémenter le dashboard résultat ;
6. Ajouter les données exemples ;
7. Ajouter un README expliquant le scoring et les limites ;
8. Ajouter une TODO roadmap V2/V3.

## Priorité absolue

Ne pas surcomplexifier. Je veux une V1 fonctionnelle, belle, démontrable, avec une vraie sensation produit.

