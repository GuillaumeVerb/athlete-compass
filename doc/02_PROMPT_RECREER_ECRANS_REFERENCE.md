# Prompt 02 — Recréer les écrans de référence

Tu es un senior product designer + frontend engineer.

Je veux que tu recrées une webapp SaaS appelée **Athlete Compass**, en te basant très fortement sur les écrans de référence fournis.

## Objectif

Reproduire une interface premium, sportive, sombre, moderne, type “performance lab”, pour une app qui calcule :

- l’âge athlétique ;
- le Hybrid Score ;
- le profil d’athlète ;
- le prochain test recommandé ;
- le plan 4 semaines ;
- les offres premium.

## Important

Ne change pas radicalement le style. Ne pars pas vers une app fitness générique.

Je veux une interface très proche des écrans de référence :

- dark UI ;
- cartes arrondies ;
- sidebar ;
- vert néon ;
- jaune/ambre pour le premium ;
- dashboard clair ;
- sensation SaaS sportif premium.

## Stack

- Next.js App Router ;
- TypeScript ;
- Tailwind CSS ;
- shadcn/ui ;
- lucide-react pour les icônes ;
- Recharts pour les graphiques ;
- pas d’authentification en V1 ;
- pas de backend en V1 ;
- données mockées/locales.

## Écrans à créer

### 1. Landing page

Style :

- fond sombre premium ;
- hero à gauche avec gros titre ;
- visuel athlète sombre à droite ou bloc image placeholder si pas d’image disponible ;
- accent vert néon ;
- header avec logo Athlete Compass, liens Fonctionnalités, À propos, Tarifs ;
- CTA principal vert : “Commencer mon bilan gratuit” ;
- sous-texte rassurant : “Estimation de performance, pas un diagnostic médical” ;
- badges : Rapide, Scientifique, Actionnable ;
- ligne de logos fictifs en bas : HYROX, CrossFit, Rogue, Concept2, Strava.

Texte hero :

> Ton âge réel n’est pas ton âge athlétique.

Sous-titre :

> Découvre ton niveau, tes forces, tes faiblesses et le plan minimal pour devenir un athlète hybride.

### 2. Formulaire profil

Layout :

- sidebar gauche fixe avec logo + navigation : Profil, Performances, Résultats, Plan 4 semaines ;
- contenu principal dans une grande carte sombre ;
- champs à gauche : âge, sexe, taille, poids, tour de taille optionnel ;
- objectifs à droite sous forme de cartes sélectionnables :
  - Physique Crossfiter ;
  - HYROX ;
  - Recomposition ;
  - Endurance ;
  - Force & Esthétique ;
- fréquence d’entraînement sous forme de boutons : 1-2 jours, 3 jours, 4-5 jours, 6+ jours ;
- bouton vert : “Suivant”.

### 3. Formulaire performances

Créer une grille de cartes pour entrer les tests :

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

Chaque carte doit avoir :

- une icône ;
- un titre ;
- une unité ;
- un input ;
- un style sombre avec bordure subtile.

CTA :

> Voir mes résultats

### 4. Résultat gratuit

C’est l’écran le plus important.

Structure :

- sidebar gauche ;
- titre : “Ton aperçu” ;
- carte fiabilité du score en haut à droite : “Fiabilité du score : 64%” ;
- grande carte âge athlétique :
  - “Âge athlétique” ;
  - “29 ans” ;
  - “Âge réel : 32 ans” ;
  - badge “-3 ans” ;
- grande carte Hybrid Score :
  - “76/100” ;
  - niveau : “Bon” ;
  - barre de progression verte ;
- radar chart avec :
  - Force ;
  - Cardio intense ;
  - Endurance ;
  - Résistance musculaire ;
  - Core & Carry ;
- carte profil :
  - “Ton profil” ;
  - “Moteur Court” ;
  - description courte ;
- carte prochain test recommandé :
  - “2 km rameur” ;
  - bouton “Voir pourquoi” ;
- carte prochaine meilleure action :
  - “Ajouter 1 séance Zone 2 par semaine” ;
- bandeau premium en bas :
  - “Débloque ton rapport complet pour voir ton plan personnalisé.” ;
  - bouton vert : “Débloquer mon rapport”.

### 5. Rapport détaillé premium verrouillé

Créer une page qui montre les modules premium verrouillés.

Titre :

> Ton rapport complet

Cartes verrouillées avec icône cadenas :

- Âge par système ;
- Performance Gap ;
- Limiteur principal ;
- Objectifs 4 semaines ;
- Plan minimal efficace ;
- Équivalences machines.

En bas, afficher 3 offres :

- Bilan complet — 9 € ;
- Plan 4 semaines — 19 € ;
- Pack complet — 29 €.

Le Pack complet doit être mis en avant avec une bordure jaune/ambre.

### 6. Plan 4 semaines

Créer une page avec :

- tabs : Semaine 1, Semaine 2, Semaine 3, Semaine 4 ;
- liste des séances de la semaine :
  - Séance 1 — Force Haut du corps ;
  - Séance 2 — Zone 2 ;
  - Séance 3 — Force Jambes ;
  - Séance 4 — Metcon Court ;
  - Séance 5 — Hybride & Core ;
- tags à droite : Force, Endurance, Conditioning, Hybride ;
- carte objectif de la semaine avec checklist ;
- carte focus de la semaine avec score de cohérence prévu, exemple : 72 %.

### 7. Page explication prochain test

Créer une page “Pourquoi ce test ?”

Exemple : Test recommandé : 2 km rameur.

Texte :

> Ton 1 km rameur montre un excellent moteur court. Le 2 km permettra de mesurer ta capacité à tenir l’intensité plus longtemps.

Liste :

Ce que ce test va améliorer :

- affiner ton score endurance ;
- mieux évaluer ton profil ;
- améliorer la fiabilité du score ;
- adapter ton plan plus précisément.

Ajouter une image sombre ou placeholder de rameur à droite.

CTA :

> J’ai compris, retour aux résultats

### 8. Équivalences machines

Créer une page premium partiellement verrouillée.

Tableau/cartes d’équivalences :

- Rameur ;
- SkiErg ;
- Vélo ;
- Tapis incliné.

Exemples :

- 1 km rameur ≈ 1.1 km SkiErg ≈ 3.2 km vélo ≈ 3 km tapis incliné ;
- 15 min zone 2 rameur ≈ 15 min SkiErg ≈ 20 min vélo ≈ 20 min tapis incliné ;
- 500 m intense rameur ≈ 500 m SkiErg ≈ 1 km vélo ≈ 1 km tapis incliné.

Ajouter un bouton verrouillé :

> Débloquer toutes les équivalences

### 9. Pricing page

Créer une page pricing avec 3 offres :

#### Bilan complet — 9 €

- Rapport détaillé ;
- Âge athlétique ;
- Hybrid Score ;
- Profil athlète ;
- Prochain test recommandé.

#### Plan 4 semaines — 19 €

- Objectifs 4 semaines ;
- Plan d’entraînement ;
- Séances détaillées ;
- Cohérence hebdomadaire.

#### Pack complet — 29 €

- Tout du bilan complet ;
- Tout du plan 4 semaines ;
- Équivalences machines ;
- Retest 30 jours.

Mettre le Pack complet en avant avec :

- badge “Le meilleur choix” ;
- bordure jaune/ambre ;
- bouton jaune.

## Design system

- background principal : noir bleuté / gris très foncé ;
- cartes : gris anthracite avec légère bordure ;
- accent principal : vert néon ;
- accent premium : jaune/ambre ;
- texte principal : blanc cassé ;
- texte secondaire : gris clair ;
- radius : 16-24px ;
- ombres très subtiles ;
- icônes fines ;
- beaucoup d’espace ;
- look premium, pas cheap.

## Contraintes UX

- mobile responsive impeccable ;
- desktop dashboard très propre ;
- pas de surcharge de texte ;
- résultat compréhensible en moins de 10 secondes ;
- ne jamais présenter l’âge athlétique comme une mesure médicale.

Ajouter partout une mention discrète :

> L’âge athlétique est une estimation de performance, pas une mesure biologique ni un diagnostic médical.

## Architecture souhaitée

- `app/page.tsx`
- `app/profile/page.tsx`
- `app/performances/page.tsx`
- `app/results/page.tsx`
- `app/report/page.tsx`
- `app/plan/page.tsx`
- `app/next-test/page.tsx`
- `app/equivalences/page.tsx`
- `app/pricing/page.tsx`

## Données mockées

Créer des données mockées correspondant à ce profil :

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
- fiabilité : 64% ;
- profil : Moteur Court ;
- prochain test recommandé : 2 km rameur ;
- prochaine meilleure action : Ajouter 1 séance Zone 2 par semaine.

## Livrable attendu

Créer une V1 navigable, belle, cohérente, proche des écrans de référence, avec données mockées.

Ne pas implémenter de logique complexe pour l’instant. Priorité absolue : reproduire le rendu visuel et l’expérience produit.

