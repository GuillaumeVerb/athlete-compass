# Mise en route V2 — Stripe & Supabase (local)

**À faire (Stripe, Resend, déploiement)** : [`docs/V2_A_FAIRE.md`](V2_A_FAIRE.md). **Mémo intégrations** : [`docs/V2_CHECKLIST.md`](V2_CHECKLIST.md).

La V1 tourne **sans** ces étapes. Utilise ce guide quand tu veux activer les routes API optionnelles.

## Vérifier l’état des intégrations

**Sans serveur** (lecture `.env` / `.env.local` uniquement) :

```bash
pnpm check:v2
```

En dev, une fois le serveur lancé :

```bash
curl -s http://localhost:3000/api/health/cloud | jq
```

Réponse typique sans configuration :

```json
{
  "supabaseBrowser": false,
  "supabaseAdmin": false,
  "stripeSecret": false,
  "stripeCheckout": false,
  "resendEmail": false
}
```

## Variables d’environnement

Copie `.env.example` vers `.env.local` et renseigne au besoin. Rien n’est **obligatoire** pour `npm run dev` ou `npm run build`.

### Stripe (Checkout test)

**Liste à cocher (variables, webhooks, prod)** : **[`V2_A_FAIRE.md`](V2_A_FAIRE.md)**.

Variables attendues : `STRIPE_SECRET_KEY`, les trois `STRIPE_PRICE_*`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL` — détail et ordre dans ce fichier.

**Tester le Checkout (API)** une fois les clés + prix renseignés :

```bash
curl -s -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"productKey":"bilan_9"}' | jq
```

Réponse attendue : `{ "url": "https://checkout.stripe.com/...", "sessionId": "cs_..." }`.

**Webhook local** : `stripe listen --forward-to localhost:PORT/api/webhooks/stripe` (adapter `PORT`), puis coller le `whsec_...` dans `STRIPE_WEBHOOK_SECRET` et redémarrer Next.

> La route webhook répond **503** si le secret n’est pas défini.

### Supabase (persistance `purchases`)

1. Crée un projet sur [Supabase](https://supabase.com/) et récupère l’URL + clés.
2. Applique le schéma (au choix) :
   - **SQL Editor** : colle **`docs/supabase/migrations/001_purchases.sql`**, puis **`002_report_snapshot.sql`**, puis **`003_premium_reports.sql`** ;
   - **CLI** (depuis la racine **`athlete_compass`**, pas un dossier parent) : une fois `supabase link` fait avec ton *project ref*, `supabase db push` applique les fichiers dans **`supabase/migrations/`** (miroir du même SQL).
3. Renseigne `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` dans `.env` ou `.env.local`.

> **Erreurs fréquentes en CLI** : `open supabase/config.toml: no such file` → lancer `supabase init` dans **`athlete_compass`** (dossier où vit `package.json`). Les lignes de doc qui commencent par `#` sont des **commentaires** : ne les colle pas dans le terminal (sinon `command not found: #`).

Sans cette table, le **webhook** et la route **`/api/purchase/complete`** journalisent une erreur côté serveur mais le paiement reste valide côté Stripe ; le **cookie de déblocage** `/report` fonctionne dès que `STRIPE_SECRET_KEY` (ou `PURCHASE_SIGNING_SECRET`) est défini.

### Email post-achat (Resend, optionnel)

**Checklist** : **[`V2_A_FAIRE.md`](V2_A_FAIRE.md)** (section Resend). Variables : `RESEND_API_KEY`, `RESEND_FROM_EMAIL`. Sans elles, aucun envoi (comportement normal). Idempotence Resend : `purchase-confirm-{session_id}`.

### Cookie rapport

- Optionnel : `PURCHASE_SIGNING_SECRET` — sinon la signature du cookie réutilise `STRIPE_SECRET_KEY` (serveur uniquement, jamais exposée au client).

Aucun composant V1 ne dépend du client navigateur Supabase pour l’instant.

## Fichiers concernés

| Fichier | Rôle |
|--------|------|
| `lib/env/cloud-ready.ts` | Détection config |
| `lib/stripe/server.ts` | Client Stripe lazy |
| `lib/supabase/*.ts` | Clients Supabase optionnels |
| `app/api/health/cloud/route.ts` | Santé intégrations (+ Resend optionnel) |
| `app/api/checkout/route.ts` | Session Checkout |
| `GET /api/report/pdf` | PDF aperçu (cookie déblocage + bilan serveur) |
| `lib/purchase/*` | Ligne d’insert Stripe → SQL, cookie signé |
| `docs/supabase/migrations/001_purchases.sql` | Table `purchases` minimale (SQL Editor) |
| `docs/supabase/migrations/002_report_snapshot.sql` | Snapshot bilan (SQL Editor) |
| `docs/supabase/migrations/003_premium_reports.sql` | Table `premium_reports` (JSON rapport, `pdf_url` futur) |
| `lib/email/send-purchase-confirmation.ts` | Email Resend post-achat (optionnel) |
| `lib/purchase/upsert-premium-report.ts` | Sync `premium_reports` après achat si snapshot |
| `supabase/config.toml` | Config locale générée par `supabase init` |
| `supabase/migrations/*.sql` | Mêmes migrations pour `supabase db push` |
| `components/checkout/checkout-context.tsx` | Provider : état Stripe pour toute la zone `(app)` |
| `components/checkout/checkout-button.tsx` | CTA : Checkout ou lien de secours |
| `components/pricing/pricing-card.tsx` | Cartes offres branchées sur `productKey` |

## UI (parcours débloquer)

- **Layout** `app/(app)/layout.tsx` enveloppe les pages authentifiées/shell avec `<CheckoutProvider>` (un appel à `/api/health/cloud` au montage).
- **Tarifs** `/pricing` : chaque `PricingCard` a un `productKey` (`bilan_9`, `plan_19`, `pack_29`). Si Stripe est prêt → bouton **Payer (test)** ouvre Checkout ; sinon libellé **Bientôt disponible** + notice ambre.
- **Résultats** : « Débloquer mon rapport » appelle le **Pack complet** si Stripe est prêt ; sinon le bouton se comporte comme un lien vers `/report` (`fallbackHref`).
- **Rapport débloqué** : sans cookie, grille verrouillée + offres. Avec cookie valide : **`ReportUnlockedBody`** affiche d’abord le **bilan figé au paiement** (`purchases.report_snapshot`) si Supabase l’a enregistré ; sinon profil / performances **localStorage** (ou démo) et recalcul sur l’appareil. Synthèse, Performance Gap, profil, limiteur, Next Best Move, objectifs 4 semaines + liens vers `/results`, `/plan`, `/equivalences`.
- **Après paiement** : `success_url` → `GET /api/purchase/complete?session_id={CHECKOUT_SESSION_ID}` → redirection **`/report?unlocked=1`** avec cookie **`ac_report_unlock`** (7 j). Une bannière ponctuelle rappelle l’accès **navigateur** (cookie) et l’absence d’email si Resend n’est pas configuré ; bouton « Compris » enlève le paramètre d’URL.
- **Échec** : session introuvable / non payée → `/pricing?checkout=fail`.
- **Annulation** : `cancel_url` → `/pricing?checkout=cancel` (bannière informative).
- **Succès manuel** : si tu reviens sur `/pricing?checkout=success` (lien partagé), une bannière rappelle d’ouvrir `/report`.

Schéma SQL cible : `docs/FUTURE_ARCHITECTURE.md`.
