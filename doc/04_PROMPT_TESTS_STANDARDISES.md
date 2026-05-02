# Prompt 04 — Protocoles de tests standardisés

Ajoute une bibliothèque de protocoles de tests standardisés pour Athlete Compass.

## Objectif

L’app doit être crédible. Chaque test doit expliquer clairement :

- ce qu’il mesure ;
- comment le réaliser ;
- comment entrer le résultat ;
- quelles erreurs éviter ;
- pourquoi il est utile dans le calcul du score.

## Tests à documenter

Créer une source de données structurée, par exemple :

- `lib/tests/test-protocols.ts`
- `components/tests/test-protocol-card.tsx`
- `app/tests/page.tsx` si utile.

## Tests V1

### 1 km rameur

À inclure :

- Machine recommandée : Concept2 ou équivalent.
- Échauffement : 8 à 10 minutes faciles + 2 accélérations de 20 secondes.
- Réglage : damper modéré, idéalement entre 4 et 6.
- Objectif : réaliser 1 000 m le plus vite possible avec une technique propre.
- Résultat à saisir : temps total au format mm:ss.
- Mesure principale : cardio intense / moteur court.
- Erreurs à éviter : partir trop vite, tirer uniquement avec les bras, arrondir le dos.

### 2 km rameur

À inclure :

- Mesure la capacité à tenir l’intensité plus longtemps.
- Très utile pour distinguer un moteur court d’un vrai moteur hybride.
- Résultat à saisir : temps total au format mm:ss.
- Recommandation : pacing régulier, ne pas sprinter dès le départ.

### 5 km course

À inclure :

- Mesure l’endurance utile.
- Idéalement sur terrain plat ou tapis.
- Résultat à saisir : temps total.
- Ne pas le faire le lendemain d’une grosse séance jambes.

### Tractions strictes

Standard :

- départ bras tendus ;
- menton au-dessus de la barre ;
- pas de kipping ;
- pas d’élan excessif ;
- stop quand l’amplitude se dégrade.

Mesure : force relative haut du corps.

### Front squat x5

Standard :

- charge maximale pour 5 reps propres ;
- amplitude contrôlée ;
- buste stable ;
- pas de 1RM en V1.

Mesure : force jambes + tronc.

### Développé militaire x5

Standard :

- strict press debout ;
- pas de poussée des jambes ;
- gainage serré ;
- amplitude complète.

Mesure : force épaules / haut du corps.

### Deadlift x5

Standard :

- 5 reps propres ;
- dos neutre ;
- pas d’échec technique ;
- trap bar acceptée si mentionnée.

Mesure : force chaîne postérieure.

### 50 burpees

Standard :

- poitrine au sol ;
- extension complète en haut ;
- petit saut ou extension debout selon version choisie ;
- résultat : temps total.

Mesure : résistance musculaire + cardio.

### Farmer carry

Standard :

- charge par main ;
- distance ;
- temps ;
- posture stable ;
- pas de straps.

Mesure : grip, core, trapèzes, capacité hybride.

### Hollow hold

Standard :

- bas du dos collé au sol ;
- jambes tendues si possible ;
- bras au-dessus de la tête ;
- stop si le bas du dos se décolle.

Mesure : gainage profond.

## UX attendue

Dans le formulaire performances, ajouter un lien ou bouton :

> Comment faire ce test ?

Au clic, ouvrir :

- une modal ;
- ou une page dédiée ;
- ou un drawer mobile-friendly.

## Contenu court recommandé

Chaque protocole doit avoir :

- titre ;
- durée estimée ;
- catégorie ;
- matériel ;
- protocole ;
- résultat à entrer ;
- erreurs fréquentes ;
- impact sur le score.

## Contraintes

Ne pas alourdir l’UX. Le protocole doit rassurer, pas bloquer l’utilisateur.

