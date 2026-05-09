# Architecture future — Supabase & Stripe (V2+)

Ce document décrit la cible technique **sans implémenter** le backend dans la V1. L’app actuelle reste **100 % client + localStorage**.

---

## Checklist `doc/12_PROMPT_SUPABASE_STRIPE_FUTUR.md`

| Élément | Statut dans le repo |
| --- | --- |
| Document d’architecture (ce fichier) | **Ici** — sections modèle de données, flux, sécurité, plan V2+ |
| Types TS (`Assessment`, `Purchase`, `PremiumReport`, `Plan4Weeks`, …) | **`lib/future/cloud-types.ts`** (+ ré-exports types métier) |
| Tables Postgres cibles | Migrations versionnées **`docs/supabase/migrations/`** (miroir `supabase/migrations/`) — `purchases`, `premium_reports`, `assessments`, etc. |
| Flux Stripe décrit | Section **Flux paiement** + routes **`/api/checkout`**, **`/api/webhooks/stripe`**, **`/api/purchase/complete`** |
| Variables d’environnement | **`.env.example`** — toutes optionnelles pour `npm run dev` / `npm run build` |

---

## Limites V1 (explicites)

- Aucune dépendance runtime à Supabase ou Stripe.
- Aucune variable d’environnement obligatoire pour `npm run dev` / `npm run build`.
- Les types dans `lib/future/cloud-types.ts` servent de **contrat** pour la migration ; le scoring reste dans `lib/scoring/` côté client jusqu’à introduction d’API routes ou Edge Functions.

---

## Modèle de données futur (Supabase)

Tables proposées (Postgres). Les noms sont indicatifs ; préfixe `ac_` possible en prod.

### `users`

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | Auth Supabase (`auth.users`) ou table app liée 1:1 |
| `email` | `text` | Si magic link / email login |
| `created_at` | `timestamptz` | |

### `profiles`

Profil athlète (équivalent `UserProfile` + métadonnées).

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK → `users` | |
| `age`, `sex`, `height_cm`, `weight_kg`, `waist_cm` | types scalaires | Alignés sur `lib/types` |
| `goal`, `training_frequency` | `text` / enum | |
| `constraints` | `text[]` ou `jsonb` | `ConstraintKey[]` |
| `equipment` | `text[]` ou `jsonb` | `EquipmentKey[]` |
| `created_at`, `updated_at` | `timestamptz` | |

### `assessments`

Un **bilan** calculé à un instant T (résultat du moteur). **Implémenté** : migration `20260507120000_assessments.sql` (+ miroir `docs/supabase/migrations/006_assessments.sql`).

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK → `auth.users` | Obligatoire |
| `profile_id` | `uuid` nullable | Réservé table `profiles` future |
| `hybrid_score`, `athletic_age`, `reliability_pct` | `numeric` | |
| `profile_label`, `profile_key`, `limiter` | `text` | `profile_key` = `ScoreResult.profileId` |
| `next_best_move` | `jsonb` | `NextBestMovePlan` |
| `breakdown` | `jsonb` | `ScoreBreakdown` |
| `goals_4_weeks` | `jsonb` | `string[]` |
| `performance_snapshot` | `jsonb` | `PerformanceInput` |
| `profile_snapshot` | `jsonb` | `UserProfile` utilisé pour le calcul |
| `source` | `text` | `manual` \| `retest_30d` \| `import` |
| `previous_assessment_id` | `uuid` nullable | FK vers `assessments` |
| `created_at` | `timestamptz` | |

### `performance_tests` (option normalisée)

Si on veut une ligne par test plutôt qu’un JSON unique :

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `assessment_id` | `uuid` FK | |
| `test_key` | `text` | ex. `row1k`, `pullups` |
| `value` | `text` | Valeur brute saisie |
| `unit` | `text` | optionnel |
| `score`, `category` | `numeric` / `text` | optionnel si dénormalisé |
| `created_at` | `timestamptz` | |

### `premium_reports`

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK | |
| `assessment_id` | `uuid` FK | Bilan source |
| `status` | `text` | `draft`, `ready`, `failed` |
| `report_json` | `jsonb` | Payload `PremiumReport` (sections débloquées) |
| `pdf_url` | `text` nullable | Stockage objet (S3, Supabase Storage) |
| `created_at` | `timestamptz` | |

### `purchases`

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK nullable | Invité tant qu’il n’y a pas d’auth |
| `stripe_checkout_session_id` | `text` unique | |
| `stripe_payment_intent_id` | `text` nullable | |
| `product_key` | `text` | `bilan_9`, `plan_19`, `pack_29` |
| `amount_cents`, `currency` | `int`, `text` | |
| `customer_email` | `text` nullable | |
| `status` | `text` | `pending`, `paid`, `refunded` |
| `report_snapshot` | `jsonb` nullable | Bilan figé au checkout (profil + perfs + score recalculé serveur) |
| `created_at` | `timestamptz` | |

Script SQL minimal versionné : **`docs/supabase/migrations/001_purchases.sql`**, puis **`002_report_snapshot.sql`**, puis **`003_premium_reports.sql`** (`premium_reports` + RLS activé sans policy publique — accès serveur service role).

---

## Flux utilisateur (V2)

1. L’utilisateur complète profil + performances (comme V1, éventuellement sync vers `profiles` / `assessments`).
2. Il consulte l’aperçu résultats (gratuit).
3. Clic « Débloquer mon rapport » → **Stripe Checkout Session** créée côté serveur ; le client peut envoyer **`snapshot`** `{ profile, performance }` → serveur recalcule le score, stocke un pending row, passe **`snapshot_id`** en metadata session.
4. Après paiement, Stripe redirige vers **`GET /api/purchase/complete?session_id=…`** (vérif serveur + upsert `purchases` + cookie httpOnly `ac_report_unlock`).
5. Redirection vers **`/report`** : bannière « accès activé » si cookie valide.
6. L’UI lit le statut et affiche le rapport débloqué ; une ligne **`premium_reports`** (JSON + `pdf_url` futur) est synchronisée avec le snapshot quand il existe (`lib/purchase/upsert-premium-report.ts`).

---

## Flux paiement (Stripe)

1. **POST** `/api/checkout` : body `{ productKey, snapshot?: { profile, performance } }` → session Stripe ; metadata `productKey`, éventuellement `snapshot_id`.
2. Utilisateur paie sur Stripe Hosted Checkout.
3. **Webhook** `checkout.session.completed` (et `payment_intent.succeeded` si besoin) :
   - Vérifier la signature (`STRIPE_WEBHOOK_SECRET`).
   - Insérer / mettre à jour `purchases` (idempotent sur `session.id`) puis **`premium_reports`** si un `report_snapshot` est disponible.
   - Déclencher génération `premium_reports` (job async ou fonction immédiate selon charge).
4. L’UI lit le statut et affiche le rapport débloqué.

Sécurité : ne jamais faire confiance au front pour « paid » ; toujours valider via webhook ou récupération session côté serveur avec la clé secrète.

---

## Sécurité (rappels)

- Row Level Security (RLS) sur toutes les tables sensibles : un utilisateur ne lit que ses lignes.
- Clé **service role** Supabase uniquement côté serveur (jamais `NEXT_PUBLIC_*`).
- Webhooks Stripe : raw body + signature ; retries idempotents.
- Données de performance : traiter comme données personnelles sensibles (minimisation, durée de rétention, export/suppression RGPD en V2+).

---

## Plan d’implémentation V2 (ordre suggéré)

1. Projet Supabase + schéma SQL (tables ci-dessus) + RLS basique.
2. Auth (email magic link ou OAuth) — aligner `user_id`.
3. API route : sync profil / création `assessment` depuis le calcul existant (`computeScoreResult`).
4. Stripe : produits / prix en tableau de bord ; Checkout ; webhook dédié.
5. Déblocage UI `/report` selon `purchase` + `premium_reports.status`.
6. Email transactionnel (Resend, SendGrid, etc.) — hors scope V1.

### Routes API déjà présentes (squelette)

Sans variables d’environnement, elles répondent **503** ou métadonnées neutres — la V1 reste utilisable.

| Route | Description |
|-------|-------------|
| `GET /api/health/cloud` | Indique quelles intégrations sont configurées (sans secret). |
| `POST /api/checkout` | Crée une Stripe Checkout Session si les Price IDs sont définis. |
| `POST /api/webhooks/stripe` | Vérifie la signature ; hook `checkout.session.completed` (persistance à brancher). |
| `POST /api/plan/snapshot` | Snapshot plan 4 sem. → `plan_instances` (JWT / cookie achat optionnels). |
| `GET /api/plan/history` | Historique `plan_instances` filtré sync et/ou utilisateur. |
| `POST /api/assessments` | Bilan daté → `assessments` (**JWT Bearer** obligatoire). |
| `GET /api/assessments` | Liste des bilans de l’utilisateur connecté. |
| `GET /api/assessments/:id` | Détail JSON (snapshot profil + perfs + scores). |
| `GET /api/assessments/compare` | Delta entre deux UUID (`from`, `to`). |

Guide pas à pas : **[`docs/V2_SETUP.md`](V2_SETUP.md)** — tâches dashboard (Stripe, Resend, déploiement) : **[`docs/V2_A_FAIRE.md`](V2_A_FAIRE.md)**.

---

## Variables d’environnement futures

Voir **`.env.example`** à la racine du repo. Aucune de ces variables n’est requise pour la V1 locale.

---

## Types TypeScript

Les structures persistées et payloads rapport sont décrites dans **`lib/future/cloud-types.ts`** pour garder un seul vocabulaire entre front, API routes futures et schéma SQL.

---

## V3 — Bilans, historique et retest (~30 jours)

**Objectif** : une personne connectée retrouve **plusieurs bilans datés**, compare avant/après, et suit un **cadencement de retest** (sans promesse médicale).

### État actuel dans le repo

- Migration **`20260507120000_assessments.sql`** : table **`assessments`** + RLS pour le rôle **`authenticated`** (lecture / écriture sur ses propres `user_id`). Les routes Next.js valident le **JWT** puis insèrent via la **service role** (contourne RLS).
- **`POST /api/assessments`** : corps aligné sur le snapshot checkout (`profile`, `performance`) + optionnel `source`, `previousAssessmentId` (même utilisateur).
- **`GET /api/assessments`**, **`GET /api/assessments/:id`**, **`GET /api/assessments/compare`** : API liste, détail, comparaison.
- Pages **`/bilans`** et **`/bilans/[id]`** : liste + détail (cartes alignées sur l’écran Résultats).
- **`plan_instances`** + **`/api/plan/snapshot`** / **`/api/plan/history`** : historique des **plans** (JSON `weeks`).
- **`lib/future/cloud-types.ts`** : types bilan / liste / delta.
- Progression plan : **`localStorage`** (`plan-progress-storage`) — V4 pourra synchroniser.

### Schéma cible (extensions au schéma déjà migré)

Les colonnes `source` et `previous_assessment_id` sont déjà en base. Pistes suivantes :

| Table / colonne | Rôle |
| --- | --- |
| **`performance_tests`** (optionnel) | Une ligne par test au lieu du seul JSON `performance_snapshot`. |
| **`retest_reminders`** (optionnel) | `user_id`, `anchor_assessment_id`, `due_at`, `channel` (`email`), `sent_at` — rappels opt-in RGPD. |

**RLS** : `assessments` est couvert ; **`performance_tests`** / **`premium_reports`** — aligner sur `auth.uid() = user_id` (ou équivalent invité → compte).

### API routes (V3)

| Méthode | Route | Statut | Description |
| --- | --- | --- | --- |
| `POST` | `/api/assessments` | **Fait** | JWT Bearer + `{ profile, performance, source?, previousAssessmentId? }` → `computeScoreResult` → insert. |
| `GET` | `/api/assessments` | **Fait** | Liste (`?limit=`) : id, dates, scores, limiteur, source, chaîne retest. |
| `GET` | `/api/assessments/:id` | **Fait** | Détail + JSON complet (`profile_snapshot`, `breakdown`, etc.). |
| `GET` | `/api/assessments/compare?from=&to=` | **Fait** | Delta scores + indicateur changement de limiteur (ordre chronologique auto). |

### Écrans produit (V3)

- **Mes bilans** (`/bilans`) : liste, courbes (≥ 2 bilans), **choix explicite du bilan de référence** pour retest + lien protocole aligné sur ce choix.
- **Détail bilan** (`/bilans/[id]`) : cartes scoring + bloc progression si `previous_assessment_id`.
- **Retest 30 j** : prolonger **`/next-test`** avec date du dernier bilan, CTA « lancer retest », checklist des tests à refaire (déjà partiellement côté `?focus=` sur Performances).

---

## V4 — Plans adaptatifs

**Objectif** : le plan 4 semaines n’est pas figé : il **réagit** à la fréquence réelle, à un **feedback fatigue** simple, et aux **contraintes** mises à jour — tout en restant positionné **éducation / préparation**, pas prescription médicale.

### État actuel dans le repo

- **`plan_instances`** : snapshot JSON à chaque génération / sync ; empreinte **`fingerprint`** liée au profil + scoring.
- Génération : **`generateFourWeekPlan`** + réhydratation ; pas encore de boucle « régénérer la semaine N » côté serveur avec règles métier versionnées.

### Données cibles (V4)

| Entité | Rôle |
| --- | --- |
| **`plan_instances`** (existant) | Version complète du plan à un instant T ; garder l’historique pour audit et rollback UX (« revenir à la version du … »). |
| **`plan_week_feedback`** (nouvelle) | `plan_instance_id`, `week_index` (1–4), `fatigue` (`low` / `ok` / `high`), `sessions_completed` (int ou jsonb), `note` texte court, `created_at`. |
| **`plan_adaptation_events`** (nouvelle, optionnelle) | Traçabilité : `from_plan_instance_id`, `to_plan_instance_id`, `reason` (`profile_change`, `weekly_feedback`, `manual_regen`), `payload` jsonb (règle appliquée). |

La **régénération** peut rester une fonction TypeScript partagée (comme aujourd’hui) appelée depuis une **API route** après validation du feedback, pour éviter deux logiques divergentes.

### Règles métier (indicatif, à affiner produit)

- **Feedback fatigue « high »** sur la semaine courante : semaine suivante → volume −1 palier ou substitution « récup » dans les blocs (même moteur, paramètres différents).
- **Changement de fréquence** dans le profil : nouveau `fingerprint` → nouveau plan (déjà le cas localement) ; V4 = persister l’événement et proposer diff UI.
- **Mode « ≤ 3 j / semaine »** : flag profil ou plan → générateur restreint (déjà partiellement adressable par champs profil existants).

### API routes cibles (V4)

| Méthode | Route | Description |
| --- | --- | --- |
| `POST` | `/api/plan/week-feedback` | Lie au `plan_instance` courant (ou `client_sync_id`) + semaine ; upsert `plan_week_feedback`. |
| `POST` | `/api/plan/adapt` | Entrée : id plan courant + optionnel changement profil ; sortie : nouveau snapshot + insert `plan_instances` + event log. |

### Écrans produit (V4)

- **Semaine courante** : mise en avant + rappel feedback fin de semaine.
- **Ajustement guidé** : 1–3 questions (fatigue, séances faites, douleur → disclaimer + « consulter un pro » si douleur).
- Lien **équivalences** contextuel (déjà présent sur le plan) enrichi selon `equipment` du profil sync.

### Ordre d’implémentation suggéré (V3 → V4)

1. **Auth + RLS** sur données déjà persistées (`purchases`, futur `assessments`, `plan_instances` en lecture utilisateur).
2. **`POST/GET /api/assessments`**, détail, compare + pages **`/bilans`** (liste, courbes, retest) — fait ; raffinements retest e-mail **à faire**.
3. **Retest** : champ `source` + lien UI depuis dernier bilan.
4. **`plan_week_feedback`** + UI sur **`/plan`** puis **`/api/plan/adapt`** minimal (régénération serveur avec même générateur).

---

## Liens roadmap

Vision produit par version : **`ROADMAP.md`** (sections V3 et V4). Ce fichier documente la **cible technique** et les **artefacts** à faire évoluer en parallèle.
