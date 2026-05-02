# Prompt 03 — Scoring déterministe

Améliore uniquement la logique de scoring de l’application **Athlete Compass**.

## Objectif

Créer un scoring déterministe clair, explicable et extensible.

## Scores nécessaires

1. Cardio Intense Score ;
2. Endurance Score ;
3. Force Score ;
4. Muscular Endurance Score ;
5. Core & Carry Score ;
6. Hybrid Score ;
7. Athletic Age ;
8. Score Reliability ;
9. Performance Gap ;
10. Next Best Move.

## Contraintes

- Le score doit fonctionner même si tous les tests ne sont pas remplis.
- Chaque score doit avoir une fiabilité.
- L’app doit recommander les tests manquants les plus utiles.
- L’app doit expliquer pourquoi le score est donné.
- Le scoring doit tenir compte du sexe, de l’âge, du poids, de l’objectif et des contraintes utilisateur.
- Le scoring doit rester simple, déterministe, sans IA en V1.

## Implémentation attendue

Créer des fonctions pures testables dans `lib/scoring/`.

Structure possible :

- `lib/scoring/types.ts`
- `lib/scoring/utils.ts`
- `lib/scoring/cardio.ts`
- `lib/scoring/endurance.ts`
- `lib/scoring/force.ts`
- `lib/scoring/muscular-endurance.ts`
- `lib/scoring/core-carry.ts`
- `lib/scoring/hybrid-score.ts`
- `lib/scoring/athletic-age.ts`
- `lib/scoring/reliability.ts`
- `lib/scoring/profiles.ts`
- `lib/scoring/next-best-move.ts`
- `lib/scoring/performance-gap.ts`

## Principes de scoring

Chaque test produit :

- un score de 0 à 100 ;
- un niveau textuel ;
- une explication courte ;
- une catégorie associée ;
- un poids dans le score global.

Exemple :

```ts
export type TestScore = {
  key: string;
  category: 'cardio_intense' | 'endurance' | 'force' | 'muscular_endurance' | 'core_carry';
  score: number;
  label: 'faible' | 'moyen' | 'bon' | 'tres_bon' | 'excellent';
  explanation: string;
  reliabilityImpact: number;
};
```

## Pondérations par objectif

### Objectif physique crossfiter

- Force : 30 % ;
- Cardio intense : 25 % ;
- Résistance musculaire : 20 % ;
- Endurance : 15 % ;
- Core & Carry : 10 %.

### Objectif HYROX

- Endurance : 30 % ;
- Cardio intense : 25 % ;
- Résistance musculaire : 25 % ;
- Force : 10 % ;
- Core & Carry : 10 %.

### Objectif recomposition

- Force : 30 % ;
- Résistance musculaire : 20 % ;
- Cardio zone 2 / endurance : 20 % ;
- Composition : 20 % ;
- Core : 10 %.

### Objectif endurance

- Endurance : 40 % ;
- Cardio intense : 20 % ;
- Force : 15 % ;
- Résistance musculaire : 15 % ;
- Core : 10 %.

### Objectif force esthétique

- Force : 45 % ;
- Core & Carry : 15 % ;
- Cardio intense : 15 % ;
- Résistance musculaire : 15 % ;
- Endurance : 10 %.

## Exemples de seuils V1

### 1 km rameur homme

- 4:15 ou plus = 40 ;
- 3:55 = 55 ;
- 3:40 = 68 ;
- 3:30 = 78 ;
- 3:20 = 88 ;
- 3:10 = 96.

### 2 km rameur homme

- 8:30 = 40 ;
- 8:00 = 55 ;
- 7:30 = 68 ;
- 7:15 = 76 ;
- 7:00 = 85 ;
- 6:45 = 92 ;
- 6:30 = 98.

### 5 km course homme

- 30:00 = 35 ;
- 27:00 = 50 ;
- 25:00 = 60 ;
- 23:00 = 72 ;
- 21:00 = 84 ;
- 20:00 = 90 ;
- 18:30 = 98.

### Tractions strictes homme

- 0-2 = 25 ;
- 3-5 = 45 ;
- 6-8 = 60 ;
- 9-12 = 75 ;
- 13-15 = 85 ;
- 16-20 = 95.

### Front squat x5 relatif au poids de corps

- 0.6x bodyweight = 35 ;
- 0.8x = 50 ;
- 1.0x = 65 ;
- 1.2x = 78 ;
- 1.4x = 90 ;
- 1.6x = 98.

### Développé militaire x5 relatif au poids de corps

- 0.35x = 35 ;
- 0.45x = 50 ;
- 0.55x = 65 ;
- 0.70x = 80 ;
- 0.80x = 90 ;
- 0.90x = 98.

### Deadlift x5 relatif au poids de corps

- 1.0x = 35 ;
- 1.25x = 50 ;
- 1.5x = 65 ;
- 1.8x = 80 ;
- 2.0x = 90 ;
- 2.2x = 98.

### 50 burpees

- 10:00 = 35 ;
- 8:30 = 50 ;
- 7:00 = 65 ;
- 5:30 = 80 ;
- 4:30 = 90 ;
- 3:45 = 98.

### Hollow hold

- 20 sec = 35 ;
- 30 sec = 50 ;
- 45 sec = 65 ;
- 60 sec = 80 ;
- 90 sec = 95.

## Logique de profils

Créer une fonction qui attribue un profil principal selon les scores.

Profils à gérer :

- Moteur Court ;
- Strong but Slow ;
- Diesel ;
- Balanced Hybrid ;
- Crossfit Build ;
- HYROX Ready ;
- Under-Recovered ;
- Strength Gap ;
- Endurance Gap ;
- Muscular Endurance Gap.

Exemples :

- Cardio intense élevé + endurance inconnue ou moyenne = Moteur Court.
- Force élevée + endurance basse = Strong but Slow.
- Endurance élevée + force basse = Diesel.
- Tous les scores relativement équilibrés = Balanced Hybrid.
- Force + cardio intense + résistance musculaire élevés = Crossfit Build.
- Endurance + résistance + carries élevés = HYROX Ready.

## Logique Next Best Move

Selon le plus gros déficit, recommander une action simple :

- ajouter 1 séance Zone 2 ;
- ajouter tractions / force relative ;
- ajouter metcon court ;
- réduire intensité ;
- tester 2 km rameur ;
- tester 5 km course ;
- tester front squat x5 ;
- ajouter carries / core.

La recommandation doit contenir :

- titre ;
- raison ;
- action concrète ;
- fréquence ;
- impact attendu.

## Logique de fiabilité

Calculer la fiabilité selon le nombre et la diversité des tests remplis.

Exemple :

- moins de 3 tests = fiabilité faible ;
- 3 à 5 tests = fiabilité moyenne ;
- 6 à 8 tests = fiabilité bonne ;
- 9+ tests = fiabilité élevée.

La fiabilité doit aussi tenir compte des catégories couvertes.

Exemple :

Un utilisateur avec seulement 4 tests cardio a une fiabilité plus faible qu’un utilisateur avec 4 tests répartis entre cardio, force, endurance et core.

## Logique d’âge athlétique

Créer un âge athlétique estimé, mais le présenter comme une estimation ludique de performance.

Principe simple :

- Hybrid Score 50 = âge réel approximatif ;
- Hybrid Score > 50 = âge athlétique plus jeune ;
- Hybrid Score < 50 = âge athlétique plus vieux ;
- limiter l’écart à environ -10 / +12 ans pour éviter les résultats absurdes.

Exemple :

- âge réel 37 ;
- Hybrid Score 76 ;
- âge athlétique estimé : environ 31-33 ans.

Ajouter toujours le disclaimer :

> Estimation de performance, pas mesure biologique.

## Tests

Ajouter des tests unitaires si l’environnement est déjà configuré. Sinon, créer un fichier `lib/scoring/examples.ts` avec plusieurs profils exemples.

Ne modifie pas le design, concentre-toi sur `lib/scoring` et les fonctions de calcul.

