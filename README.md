# Athlete Compass (V1)

Mini webapp **Next.js (App Router)** pour un diagnostic de performance hybride : âge athlétique estimé, Hybrid Score, profil, limiteur, prochain test, plan 4 semaines (démo). **Dashboard « Aujourd’hui »** (readiness déterministe, dette d’entraînement, coach hybride en réponses figées), **Body Progress** (démo) et blog SEO sont dans le repo ; données **localStorage** en V1 — pas d’auth ni backend pour le cœur diagnostic.

## Scripts

```bash
npm install
npm run dev
npm run check:v2   # prérequis Stripe/Supabase/Resend (.env) — sans afficher de secrets
npm run typecheck
npm run lint
npm run test
npm run build
```

## QA (V1)

Avant merge ou release, exécuter dans l’ordre :

0. **`npm run check:v2`** (optionnel) — si tu touches au paiement V2 : vérifie `.env` / `.env.local` sans exposer de secrets.
1. `npm run typecheck` — TypeScript strict, pas d’erreur.
2. `npm run lint` — ESLint (Next.js) propre.
3. `npm run test` — Vitest : parsing perfs, formulaire Performances, smoke scoring démo, **readiness**, **dette d’entraînement**, **projection âge futur**, **coach déterministe**, **paliers de fiabilité** (`lib/scoring/*.test.ts`, `lib/coach/*.test.ts`).
4. `npm run build` — build production Next.js OK.

**Formulaires** : les temps attendent `mm:ss` ; le farmer carry `40/35` ou `40 m 35 s` ; les charges en kg strictement positives ; les tractions en entier ≥ 0. Messages d’erreur explicites si un champ renseigné est invalide.

**États vides** : profil / performances absents → démo ou CTA guidé ; résultats avec peu de tests → message type « Ton score est encore provisoire. Ajoute au moins 3 tests… » (`results-client`) et paliers **faible / moyen / bon / élevé** (`lib/scoring/reliability-tier.ts`). Voir aussi **`doc/09_PROMPT_QA_TESTS_RESPONSIVE.md`**.

**UI** : vérifier les vues étroites (320–390 px) : sidebar repliée, graphique radar lisible, onglets du plan (S1–S4) utilisables au doigt, page **Aujourd’hui** (`/daily`) sans scroll horizontal (bannières démo / score provisoire + fiabilité).

**Accessibilité (minimum)** : libellés associés aux champs (`Label` / `sr-only` où besoin), **boutons à état** (`aria-pressed` objectif, fréquence, contraintes, sexe en `fieldset`/`legend`), contrastes des badges, focus visible sur les boutons shadcn.

**Graphiques** : conteneurs `min-w-0` + hauteur fixe (radar, body progress, courbes **Bilans**) pour éviter les débordements en grille responsive.

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

## Roadmap

Résumé : **V1** calculateur + diagnostic (local) ; **V1.5** boucle quotidienne (readiness, dette, coach déterministe, body progress démo) ; **V2** Stripe + rapport premium ; **V3** historique & retest 30 j ; **V4** plans adaptatifs ; **V5** coach / salle ; **V6** intégrations Strava, Garmin, Apple Health, Concept2, etc. — voir [`docs/integrations.md`](docs/integrations.md).

Table détaillée par version (objectifs, risques, métriques, écrans, données) : **[`ROADMAP.md`](ROADMAP.md)** — alignée sur le prompt **`doc/11_PROMPT_ROADMAP_V2_V6.md`**.

### Orchestration produit (V1.5 → V2)

Direction rappelée dans le **prompt maître évolution V2** (`athlete_compass_prompts_ordre_complet.md`, §15) :

- **Promesse** : chaque jour, l’app indique quoi faire pour gagner en hybridité et en performance tout en faisant baisser l’âge athlétique **estimé**, sans accumuler de fatigue inutile — sans devenir une app santé généraliste.
- **Périmètre déjà posé en code** : `app/(app)/daily`, `app/(app)/body-progress`, `lib/scoring/readiness.ts`, `training-debt.ts`, `future-athletic-age.ts`, `lib/coach/coach-responses.ts`, `lib/mock/daily.ts`, cartes associées — données mockées / manuelles, **pas d’API santé ni de LLM en V1**, logique **déterministe**, disclaimers médicaux conservés.
- **Priorité d’implémentation historique** (pour toute suite de chantiers) : daily visuel → readiness → coach à actions rapides → dette → body progress → projection âge futur → polish mobile → doc roadmap / intégrations.
- **Contrainte** : étendre sans casser l’existant (bilan, résultats, plan, pricing restent les références).
- **Parcours agrégé (fichier racine `athlete_compass_prompts_ordre_complet.md` §13)** : après **Profil → Performances**, l’app ouvre **`/daily`** comme hub quotidien ; **`/results`** reste le bilan chiffré complet.

- Détail par version (objectifs, features, risques, métriques) : [`ROADMAP.md`](ROADMAP.md)
- Cible Supabase + Stripe sans casser la V1 : [`docs/FUTURE_ARCHITECTURE.md`](docs/FUTURE_ARCHITECTURE.md)
- Types cloud préparatoires : `lib/future/cloud-types.ts`
- Variables d’environnement futures : `.env.example` (toutes optionnelles pour la V1)
- Première couche API V2 (optionnelle) : `GET /api/health/cloud`, `POST /api/checkout`, `GET /api/purchase/complete`, `POST /api/webhooks/stripe` — voir [`docs/V2_SETUP.md`](docs/V2_SETUP.md) ; **à faire** (Stripe, Resend, déploiement) : [`docs/V2_A_FAIRE.md`](docs/V2_A_FAIRE.md) ; mémo : [`docs/V2_CHECKLIST.md`](docs/V2_CHECKLIST.md). Les CTA **Tarifs**, **Résultats** (pack) et **Rapport** appellent le checkout quand Stripe + Price IDs sont configurés ; après paiement : upsert **`purchases`**, sync **`premium_reports`** si snapshot checkout, cookie httpOnly et persistance si Supabase est branché.

## Documentation produit

Les prompts d’exécution détaillés restent dans `doc/` (ex. **`doc/09_PROMPT_QA_TESTS_RESPONSIVE.md`**, **`doc/10_PROMPT_COPYWRITING_CONFORMITE.md`**). Le fichier agrégé **ordre + prompts 06–15** est à la racine : `athlete_compass_prompts_ordre_complet.md`.
