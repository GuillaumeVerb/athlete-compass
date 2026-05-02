# Prompt 05 — Équivalences machines et substitutions

Ajoute une bibliothèque d’équivalences machines pour Athlete Compass.

## Objectif

Permettre à l’utilisateur de remplacer un exercice ou une machine selon son matériel disponible, sans perdre le stimulus principal de la séance.

La fonctionnalité doit répondre à des questions comme :

- Je n’ai pas de SkiErg, je fais quoi ?
- Je n’ai pas d’assault bike, je remplace par quoi ?
- Je veux éviter de trop charger les cuisses, quelle machine choisir ?
- Je m’entraîne en salle classique, quelles alternatives ?

## À créer

- `lib/equipment/equivalences.ts`
- `components/equipment/equivalence-card.tsx`
- `components/equipment/equivalence-table.tsx`
- page ou section `app/equivalences/page.tsx`

## Machines / exercices à gérer

- rameur ;
- SkiErg ;
- vélo classique ;
- BikeErg ;
- assault bike ;
- tapis incliné ;
- course ;
- escalier / stairmaster ;
- burpees ;
- kettlebell swings ;
- farmer carry.

## Équivalences de base

Créer des équivalences simples en distance / durée / intensité.

### Remplacement de 500 m rameur

- 500 m SkiErg ;
- 400 m course ;
- 1 000 m vélo ;
- 2 min assault bike intense ;
- 3 min tapis incliné rapide ;
- 2 min burpees modérés.

### Remplacement de 1 000 m rameur

- 1 000 m SkiErg ;
- 800 m course ;
- 2 000 m vélo ;
- 4 min assault bike ;
- 6 min tapis incliné ;
- 4 min burpees modérés.

### Remplacement de 400 m course

- 500 m rameur ;
- 500 m SkiErg ;
- 1 000 m vélo ;
- 2 à 3 min tapis incliné rapide ;
- 2 min assault bike.

### Remplacement de 15 min zone 2

- 15 min rameur facile ;
- 15 min SkiErg facile ;
- 20 min vélo cadence fluide ;
- 20 min tapis incliné ;
- 15 min marche rapide.

## Important : expliquer le changement de stimulus

La vraie valeur n’est pas seulement l’équivalence, mais l’explication.

Exemples :

- Remplacer SkiErg par rameur garde le cardio mais ajoute plus de jambes.
- Remplacer SkiErg par vélo garde le moteur mais enlève le travail haut du corps.
- Remplacer rameur par tapis incliné réduit l’intensité haut du corps et devient plus orienté zone 2.
- Remplacer assault bike par burpees augmente l’impact et la fatigue globale.
- Remplacer escalier par tapis incliné réduit la fatigue quadriceps.

## Mode “éviter trop de cuisses”

Si l’utilisateur a la contrainte `avoid_large_quads` ou “éviter de trop charger les cuisses”, recommander plutôt :

- tapis incliné modéré ;
- SkiErg ;
- rameur technique/modéré ;
- vélo cadence haute, résistance modérée ;
- moins d’escalier intense ;
- moins de vélo lourd ;
- moins de gros volume de fentes.

## Mode “salle classique”

Créer des alternatives :

- Sled push → tapis incliné + leg press modérée + farmer carry ;
- Wall balls → goblet squats ou thrusters haltères ;
- Sandbag carry → farmer carry ou bear hug dumbbell carry ;
- SkiErg → rameur ou tirage poulie + cardio ;
- Assault bike → vélo, rameur ou burpees ;
- Rope climb → tractions + tirage vertical.

## UX attendue

La page équivalences doit afficher :

- une grille de cartes par machine ;
- une table d’équivalences ;
- un bloc “ce que ce remplacement change” ;
- un CTA premium verrouillé : “Débloquer toutes les équivalences”.

## Contraintes

Ne pas présenter les équivalences comme parfaitement scientifiques. Afficher :

> Les équivalences sont des estimations pratiques. Elles varient selon ton niveau, ton poids, ta technique et ton intensité.

