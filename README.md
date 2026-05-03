# Athlete Compass (V1)

Mini webapp **Next.js (App Router)** pour un diagnostic de performance hybride : âge athlétique estimé, Hybrid Score, profil, limiteur, prochain test, plan 4 semaines (démo). Données **localStorage** en V1 — pas d’auth ni backend.

## Scripts

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

## QA (V1)

Avant merge ou release, exécuter dans l’ordre :

1. `npm run typecheck` — TypeScript strict, pas d’erreur.
2. `npm run lint` — ESLint (Next.js) propre.
3. `npm run build` — build production Next.js OK.

**Formulaires** : les temps attendent `mm:ss` ; le farmer carry `40/35` ou `40 m 35 s` ; les charges en kg strictement positives ; les tractions en entier ≥ 0. Messages d’erreur explicites si un champ renseigné est invalide.

**États vides** : profil / performances absents → démo ou CTA guidé ; résultats avec peu de tests → bandeau « score provisoire » et palier de fiabilité (`lib/scoring/reliability-tier.ts`).

**UI** : vérifier les vues étroites (320–390 px) : sidebar repliée, graphique radar lisible, onglets du plan (S1–S4) utilisables au doigt.

**Accessibilité (minimum)** : libellés associés aux champs (`Label` / `sr-only` où besoin), contrastes des badges, focus visible sur les boutons shadcn.

## Scoring (V1)

Le calcul est **déterministe** et volontairement simple (modifiable dans `lib/scoring/`).

- **Cardio intense** : principalement le **1 km rameur** (courbe temps → score, ajustement léger selon le sexe).
- **Endurance** : moyenne des scores disponibles (**2 km rameur**, **5 km course**).
- **Force** : moyenne des lifts **/ poids de corps** (front squat ×5, développé militaire ×5, deadlift ×5).
- **Résistance musculaire** : **tractions** + **50 burpees** (temps).
- **Core & carry** : **farmer carry** (format `40/35` = 40 m / 35 s) + **hollow hold** (mm:ss).

**Hybrid Score** : moyenne des piliers renseignés (0–100).  
**Fiabilité** : pondération des champs remplis (`lib/scoring/reliability.ts`).  
**Âge athlétique** : dérivé de l’âge réel et du Hybrid Score (`lib/scoring/athletic-age.ts`) — **estimation de performance, pas une mesure biologique ni un diagnostic médical**.

Les règles de profil (`lib/scoring/profiles.ts`) classifient grossièrement le type d’athlète pour alimenter l’UI.

## Image design (hero)

Place ton export sous **`public/hero-design.png`**. S’il est absent, un **fallback visuel** s’affiche automatiquement.

## Roadmap (extraits)

- **V2** : persistance cloud (Supabase), comptes, historique des tests.
- **V3** : paiement (Stripe), déblocage réel des rapports / plans.
- **V4+** : plans adaptatifs, rôles coach, intégrations capteurs / Strava (cf. `doc/`).

## Documentation produit

Les prompts d’exécution détaillés restent dans `doc/`.
