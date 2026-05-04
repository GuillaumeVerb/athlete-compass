# Architecture future — Supabase & Stripe (V2+)

Ce document décrit la cible technique **sans implémenter** le backend dans la V1. L’app actuelle reste **100 % client + localStorage**.

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

Un **bilan** calculé à un instant T (résultat du moteur).

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK | |
| `profile_id` | `uuid` FK nullable | Profil utilisé pour le calcul |
| `hybrid_score`, `athletic_age`, `reliability` | `numeric` / `int` | |
| `profile_label`, `limiter` | `text` | |
| `next_best_move` | `jsonb` | Objet type `NextBestMovePlan` |
| `breakdown` | `jsonb` | `ScoreBreakdown` |
| `goals_4_weeks` | `jsonb` | `string[]` |
| `performance_snapshot` | `jsonb` | Copie de `PerformanceInput` utilisée |
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
| `created_at` | `timestamptz` | |

Script SQL minimal versionné : **`docs/supabase/migrations/001_purchases.sql`**.

---

## Flux utilisateur (V2)

1. L’utilisateur complète profil + performances (comme V1, éventuellement sync vers `profiles` / `assessments`).
2. Il consulte l’aperçu résultats (gratuit).
3. Clic « Débloquer mon rapport » → redirection ou **Stripe Checkout Session** créée côté serveur (Route Handler Next.js).
4. Après paiement, Stripe redirige vers **`GET /api/purchase/complete?session_id=…`** (vérif serveur + upsert `purchases` + cookie httpOnly `ac_report_unlock`).
5. Redirection vers **`/report`** : bannière « accès activé » si cookie valide.
6. Le rapport détaillé (JSON / PDF) reste à brancher dans `premium_reports` (V2+).

---

## Flux paiement (Stripe)

1. **POST** `/api/checkout` (exemple) : body `{ productKey, assessmentId }` → vérif user → `stripe.checkout.sessions.create`.
2. Utilisateur paie sur Stripe Hosted Checkout.
3. **Webhook** `checkout.session.completed` (et `payment_intent.succeeded` si besoin) :
   - Vérifier la signature (`STRIPE_WEBHOOK_SECRET`).
   - Insérer / mettre à jour `purchases` (idempotent sur `session.id`).
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

Guide pas à pas : **[`docs/V2_SETUP.md`](V2_SETUP.md)**.

---

## Variables d’environnement futures

Voir **`.env.example`** à la racine du repo. Aucune de ces variables n’est requise pour la V1 locale.

---

## Types TypeScript

Les structures persistées et payloads rapport sont décrites dans **`lib/future/cloud-types.ts`** pour garder un seul vocabulaire entre front, API routes futures et schéma SQL.
