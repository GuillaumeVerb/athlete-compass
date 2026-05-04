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

### Supabase (plus tard)

Quand le projet Supabase existe :

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — client navigateur (`lib/supabase/browser-client.ts`).
- `SUPABASE_SERVICE_ROLE_KEY` — **serveur uniquement** (`lib/supabase/admin-client.ts`).

Aucun composant V1 ne dépend encore de ces clients.

## Fichiers concernés

| Fichier | Rôle |
|--------|------|
| `lib/env/cloud-ready.ts` | Détection config |
| `lib/stripe/server.ts` | Client Stripe lazy |
| `lib/supabase/*.ts` | Clients Supabase optionnels |
| `app/api/health/cloud/route.ts` | Santé intégrations |
| `app/api/checkout/route.ts` | Session Checkout |
| `app/api/webhooks/stripe/route.ts` | Webhook (signature vérifiée) |
| `components/checkout/checkout-context.tsx` | Provider : état Stripe pour toute la zone `(app)` |
| `components/checkout/checkout-button.tsx` | CTA : Checkout ou lien de secours |
| `components/pricing/pricing-card.tsx` | Cartes offres branchées sur `productKey` |

## UI (parcours débloquer)

- **Layout** `app/(app)/layout.tsx` enveloppe les pages authentifiées/shell avec `<CheckoutProvider>` (un appel à `/api/health/cloud` au montage).
- **Tarifs** `/pricing` : chaque `PricingCard` a un `productKey` (`bilan_9`, `plan_19`, `pack_29`). Si Stripe est prêt → bouton **Payer (test)** ouvre Checkout ; sinon libellé **Bientôt disponible** + notice ambre.
- **Résultats** : « Débloquer mon rapport » appelle le **Pack complet** si Stripe est prêt ; sinon le bouton se comporte comme un lien vers `/report` (`fallbackHref`).
- **Rapport** : mêmes cartes avec `productKey` pour tester depuis la page verrouillée.
- Retour Stripe : `success_url` / `cancel_url` pointent vers `/pricing?checkout=success` ou `cancel` — bannière informative en haut de page tarifs.

Schéma SQL cible : `docs/FUTURE_ARCHITECTURE.md`.
