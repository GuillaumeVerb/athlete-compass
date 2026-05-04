# V2 — À faire (config hors code)

Tout ce qui demande un **compte externe**, des **clés** ou le **dashboard** Stripe / Resend. Le code est déjà branché : tu coches ici quand c’est prêt.

Guide technique détaillé (commandes, curl, fichiers) : **[`V2_SETUP.md`](V2_SETUP.md)** — ce fichier est la **liste d’actions** à ne pas oublier.

---

## Stripe (paiement test puis prod)

- [ ] [Dashboard Stripe](https://dashboard.stripe.com/) — mode **test** pour le dev.
- [ ] Créer **trois prix** one-time (`mode: payment` côté app) et récupérer les **`price_...`**.
- [ ] Renseigner dans `.env` / `.env.local` / hébergeur :
  - [ ] `STRIPE_SECRET_KEY` (`sk_test_...`)
  - [ ] `STRIPE_PRICE_BILAN_9`, `STRIPE_PRICE_PLAN_19`, `STRIPE_PRICE_PACK_29`
  - [ ] `STRIPE_WEBHOOK_SECRET` (`whsec_...`)
  - [ ] `NEXT_PUBLIC_APP_URL` = URL réelle de l’app (port inclus en local, `https` en prod).
- [ ] **Webhook local** : `stripe listen --forward-to localhost:PORT/api/webhooks/stripe` → copier le signing secret → redémarrer Next.
- [ ] **Webhook prod** : dans Stripe, endpoint `https://TON_DOMAINE/api/webhooks/stripe` + secret **dédié** (pas celui de `stripe listen`).
- [ ] Vérifier : `curl -s "http://localhost:PORT/api/health/cloud" | jq` → `stripeSecret: true`, `stripeCheckout: true`.
- [ ] **Paiement test** (carte `4242…`) : Checkout → `/report` → ligne **`purchases`** (et **`premium_reports`** si snapshot au checkout).

**Optionnel**

- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — pas requis pour Hosted Checkout actuel.
- [ ] `PURCHASE_SIGNING_SECRET` — sinon signature du cookie rapport = dérivé de `STRIPE_SECRET_KEY`.

---

## Resend (email de confirmation post-achat)

- [ ] Compte [Resend](https://resend.com/) → clé API.
- [ ] Renseigner :
  - [ ] `RESEND_API_KEY`
  - [ ] `RESEND_FROM_EMAIL` — dev : ex. `onboarding@resend.dev` ; prod : **domaine vérifié** chez Resend.
- [ ] Vérifier : `GET /api/health/cloud` → `resendEmail: true`.
- [ ] Paiement test avec **email** saisi au Checkout → réception du mail (webhook et/ou `purchase/complete` ; idempotence `purchase-confirm-{session_id}`).

---

## Déploiement (quand tu pousses en prod)

- [ ] Recopier **toutes** les variables (Supabase, Stripe, Resend, `NEXT_PUBLIC_APP_URL`, secrets webhook) sur **Vercel** (ou autre).
- [ ] Aligner **webhooks Stripe** et **domaine Resend** sur l’URL de prod.

---

## Suite produit / code (hors ce fichier)

Priorités typiques après la config ci-dessus : **PDF** (`pdf_url`), **auth** + `user_id`, **RLS** côté client. Voir **[`V2_CHECKLIST.md`](V2_CHECKLIST.md)** et **[`FUTURE_ARCHITECTURE.md`](FUTURE_ARCHITECTURE.md)**.
