# Athlete Compass — Pack de prompts Codex / Cursor

Ce dossier contient les prompts à exécuter dans l’ordre pour construire la V1 de la webapp SaaS **Athlete Compass**.

## Objectif du produit

Athlete Compass est une mini webapp SaaS qui permet à un utilisateur de découvrir :

1. son **âge athlétique estimé** ;
2. son **Hybrid Score** ;
3. son **profil d’athlète hybride** ;
4. son **principal limiteur** ;
5. son **Performance Gap** ;
6. son **Next Best Move** ;
7. un **plan minimal 4 semaines** pour progresser.

Le produit ne doit pas devenir une app fitness généraliste. C’est un outil de **diagnostic de performance + plan d’action minimal**.

## Ordre d’exécution recommandé

### Phase 1 — Base produit et structure

1. `01_PROMPT_MAITRE_V1.md`  
   Crée l’architecture, les pages, les composants principaux, les données mockées et une première logique de score.

2. `02_PROMPT_RECREER_ECRANS_REFERENCE.md`  
   Force Codex/Cursor à reproduire le style exact des écrans : dark UI premium, sidebar, cartes, vert néon, ambre premium.

### Phase 2 — Logique métier

3. `03_PROMPT_SCORING_DETERMINISTE.md`  
   Améliore la logique de scoring, âge athlétique, fiabilité, profil, limiteur, next best move.

4. `04_PROMPT_TESTS_STANDARDISES.md`  
   Ajoute les protocoles des tests : rameur, course, tractions, front squat, burpees, farmer carry, etc.

5. `05_PROMPT_EQUIVALENCES_MACHINES.md`  
   Ajoute la bibliothèque d’équivalences entre rameur, SkiErg, vélo, tapis incliné, burpees, course, etc.

### Phase 3 — UX, premium et monétisation

6. `06_PROMPT_DESIGN_UX_PREMIUM.md`  
   Améliore le design, le responsive, les cartes résultat, les CTA et la hiérarchie visuelle.

7. `07_PROMPT_PREMIUM_PRICING.md`  
   Ajoute la couche premium simulée : cartes verrouillées, pricing 9/19/29 €, CTA, page pricing.

8. `08_PROMPT_PLAN_4_SEMAINES.md`  
   Améliore la génération et l’affichage du plan minimal 4 semaines.

### Phase 4 — Qualité produit

9. `09_PROMPT_QA_TESTS_RESPONSIVE.md`  
   Ajoute tests, validation TypeScript, responsive mobile, états vides, erreurs de formulaire.

10. `10_PROMPT_COPYWRITING_CONFORMITE.md`  
   Harmonise le wording, évite les promesses médicales, renforce la clarté business.

### Phase 5 — Suite produit

11. `11_PROMPT_ROADMAP_V2_V6.md`  
   Génère la roadmap V2 à V6 : paiement, historique, plans adaptatifs, coachs, intégrations.

12. `12_PROMPT_SUPABASE_STRIPE_FUTUR.md`  
   Prépare l’architecture future Supabase + Stripe sans l’implémenter trop tôt.

## Recommandation d’utilisation

Dans Cursor/Codex, exécute un prompt à la fois. Après chaque prompt :

- demande un résumé des fichiers modifiés ;
- lance `npm run typecheck` ;
- lance `npm run lint` si configuré ;
- vérifie visuellement les écrans principaux ;
- ne passe au prompt suivant que si la base est stable.

## Suivi (agrégat + dossier `doc/`)

Références croisées : racine **`athlete_compass_prompts_ordre_complet.md`** (prompts 00–16 agrégés : daily, readiness, coach, body progress, dette, projection âge, mobile, **§13 hub `/daily`**, **§14 intégrations** documentées dans `docs/integrations.md`, **§15** évolution V2) et ce dossier **`doc/`** (phases 1–5, prompts 01–12). **`doc/09_PROMPT_QA_TESTS_RESPONSIVE.md`** : QA transversale (mobile, formulaires, graphiques bilans, `/daily`) — voir `README.md` section QA. **`doc/10_PROMPT_COPYWRITING_CONFORMITE.md`** : wording landing (`how-it-works`), cartes résultats (`limiter-card`, intro `results-client`), termes produit (Hybrid Score, fiabilité, Next Best Move, Performance Gap). **`doc/11_PROMPT_ROADMAP_V2_V6.md`** : **`ROADMAP.md`** + renvoi dans `README.md`. Passe **`doc/08_PROMPT_PLAN_4_SEMAINES.md`** (tags, limiteur, MEP) et **`doc/06_PROMPT_DESIGN_UX_PREMIUM.md`** (cartes résultats / premium) : plan (`week-plan`, `plan-client`, `generate-plan`) + polish visuel ciblé. **`doc/07_PROMPT_PREMIUM_PRICING.md`** (simulation checkout / rapport) et **`doc/12_PROMPT_SUPABASE_STRIPE_FUTUR.md`** : pricing + `FUTURE_ARCHITECTURE.md` + `.env.example`.

## Phrase à répéter à Codex/Cursor si l’agent dérive

> Ne construis pas une app fitness complète. Construis une démo SaaS premium de diagnostic de performance : âge athlétique, Hybrid Score, profil, limiteur, Next Best Move et plan minimal 4 semaines.

