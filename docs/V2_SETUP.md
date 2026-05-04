# Mise en route V2 — Stripe & Supabase (local)

La V1 tourne **sans** ces étapes. Utilise ce guide quand tu veux activer les routes API optionnelles.

## Vérifier l’état des intégrations

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
  "stripeCheckout": false
}
```

## Variables d’environnement

Copie `.env.example` vers `.env.local` et renseigne au besoin. Rien n’est **obligatoire** pour `npm run dev` ou `npm run build`.

### Stripe (Checkout test)

1. [Dashboard Stripe](https://dashboard.stripe.com/) → mode test.
2. Crée **trois prix** (Payment, récurrent ou one-shot au choix ; le code utilise `mode: "payment"` avec un prix one-time conseillé).
3. Récupère les **Price IDs** (`price_...`).
4. Renseigne dans `.env.local` :

- `STRIPE_SECRET_KEY` (`sk_test_...`)
- `STRIPE_PRICE_BILAN_9`, `STRIPE_PRICE_PLAN_19`, `STRIPE_PRICE_PACK_29`
- `STRIPE_WEBHOOK_SECRET` (après écoute du webhook, voir ci-dessous)
- `NEXT_PUBLIC_APP_URL=http://localhost:3000` (ou URL Vercel en prod)

### Tester le Checkout (API)

```bash
curl -s -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"productKey":"bilan_9"}' | jq
```

Si tout est bon, tu reçois `{ "url": "https://checkout.stripe.com/...", "sessionId": "cs_..." }`.

### Webhook local

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copie le **signing secret** (`whsec_...`) dans `STRIPE_WEBHOOK_SECRET`, redémarre `npm run dev`, puis déclenche un paiement test depuis l’URL Checkout.

> La route webhook répond **503** si le secret n’est pas défini : c’est normal en V1.

### Supabase (persistance `purchases`)

1. Crée un projet sur [Supabase](https://supabase.com/) et récupère l’URL + clés.
2. Dans l’éditeur SQL, exécute le script **`docs/supabase/migrations/001_purchases.sql`** (table `public.purchases`).
3. Renseigne `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local`.

Sans cette table, le **webhook** et la route **`/api/purchase/complete`** journalisent une erreur côté serveur mais le paiement reste valide côté Stripe ; le **cookie de déblocage** `/report` fonctionne dès que `STRIPE_SECRET_KEY` (ou `PURCHASE_SIGNING_SECRET`) est défini.

### Cookie rapport

- Optionnel : `PURCHASE_SIGNING_SECRET` — sinon la signature du cookie réutilise `STRIPE_SECRET_KEY` (serveur uniquement, jamais exposée au client).

Aucun composant V1 ne dépend du client navigateur Supabase pour l’instant.

## Fichiers concernés

| Fichier | Rôle |
|--------|------|
| `lib/env/cloud-ready.ts` | Détection config |
| `lib/stripe/server.ts` | Client Stripe lazy |
| `lib/supabase/*.ts` | Clients Supabase optionnels |
| `app/api/health/cloud/route.ts` | Santé intégrations |
| `app/api/checkout/route.ts` | Session Checkout |
| `app/api/purchase/complete/route.ts` | Après paiement Stripe : vérifie la session, upsert `purchases`, cookie httpOnly, redirect `/report` |
| `lib/purchase/*` | Ligne d’insert Stripe → SQL, cookie signé |
| `docs/supabase/migrations/001_purchases.sql` | Table `purchases` minimale |
| `components/checkout/checkout-context.tsx` | Provider : état Stripe pour toute la zone `(app)` |
| `components/checkout/checkout-button.tsx` | CTA : Checkout ou lien de secours |
| `components/pricing/pricing-card.tsx` | Cartes offres branchées sur `productKey` |

## UI (parcours débloquer)

- **Layout** `app/(app)/layout.tsx` enveloppe les pages authentifiées/shell avec `<CheckoutProvider>` (un appel à `/api/health/cloud` au montage).
- **Tarifs** `/pricing` : chaque `PricingCard` a un `productKey` (`bilan_9`, `plan_19`, `pack_29`). Si Stripe est prêt → bouton **Payer (test)** ouvre Checkout ; sinon libellé **Bientôt disponible** + notice ambre.
- **Résultats** : « Débloquer mon rapport » appelle le **Pack complet** si Stripe est prêt ; sinon le bouton se comporte comme un lien vers `/report` (`fallbackHref`).
- **Rapport** : mêmes cartes avec `productKey` pour tester depuis la page verrouillée.
- **Après paiement** : `success_url` → `GET /api/purchase/complete?session_id={CHECKOUT_SESSION_ID}` → redirection **`/report`** avec cookie **`ac_report_unlock`** (7 j). La page rapport affiche une bannière « accès activé » si le cookie est valide.
- **Échec** : session introuvable / non payée → `/pricing?checkout=fail`.
- **Annulation** : `cancel_url` → `/pricing?checkout=cancel` (bannière informative).
- **Succès manuel** : si tu reviens sur `/pricing?checkout=success` (lien partagé), une bannière rappelle d’ouvrir `/report`.

Schéma SQL cible : `docs/FUTURE_ARCHITECTURE.md`.
