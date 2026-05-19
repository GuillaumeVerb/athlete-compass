# V2 — À faire (config hors code)

Tout ce qui demande un **compte externe**, des **clés** ou le **dashboard** Stripe / Resend. Le code est déjà branché : tu coches ici quand c’est prêt.

**Avant la première commande** : `pnpm check:v2` (ou `npm run check:v2`) — liste ce qui manque dans `.env` / `.env.local` **sans afficher de secrets**.

Guide technique détaillé (commandes, curl, fichiers) : **[`V2_SETUP.md`](V2_SETUP.md)** — ce fichier est la **liste d’actions** à ne pas oublier.

**Checklist post-merge / prod** (migrations, env, backlog V2–V3) : **[`A_FAIRE_OPERATEUR.md`](A_FAIRE_OPERATEUR.md)**.

---

## Supabase — alerte « Table publicly accessible » (RLS)

Si le **Security Advisor** signale **`rls_disabled_in_public`** sur le projet `athlete_compass` : en général il s’agit de **`public.purchases`** et/ou **`public.checkout_snapshots`**, créées sans RLS dans les migrations `001` / `002`, tant que la migration **`011`** n’a pas été appliquée.

1. **Minimum (couper l’accès public anon)** : exécuter dans le SQL Editor Supabase le fichier  
   **`docs/supabase/migrations/012_hotfix_rls_purchases_checkout_snapshots.sql`**  
   (ou `supabase db push` / migration `20260513170000_…` si tu utilises la CLI).
2. **Complet (recommandé)** : appliquer aussi **`011_purchases_rls_stripe_customer_plan_policies.sql`** — policies `SELECT` pour les JWT, `plan_instances`, `premium_reports`, colonne `stripe_customer_id`, etc.

**Vérification** (SQL Editor) :

```sql
select relname, relrowsecurity
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
  and relname in ('purchases', 'checkout_snapshots', 'premium_reports', 'plan_instances')
order by 1;
```

`relrowsecurity` = **true** pour chaque table exposée à l’API anon.

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
- [ ] **Stripe Customer Portal** : Dashboard → *Settings* → *Billing* → *Customer portal* — activer au minimum l’historique / factures ; sinon `POST /api/stripe/customer-portal` peut échouer (502, message dans la réponse).
- [ ] Vérifier : `curl -s "http://localhost:PORT/api/health/cloud" | jq` → `stripeSecret: true`, `stripeCheckout: true`.
- [ ] **Paiement test** (carte `4242…`) : Checkout → `/report` → ligne **`purchases`** (et **`premium_reports`** si snapshot au checkout).

**Optionnel**

- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — pas requis pour Hosted Checkout actuel.
- [ ] `PURCHASE_SIGNING_SECRET` — sinon signature du cookie rapport = dérivé de `STRIPE_SECRET_KEY`.

---

## Resend (email de confirmation post-achat)

Peut être **reporté** : le flux paiement → cookie → `/report` fonctionne sans Resend ; un bandeau sur le rapport rappelle l’accès navigateur tant que l’email n’est pas branché.

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

## Supabase Auth — magic link « Compte Supabase » sur `/report` (**plus tard**)

Quand tu voudras que les utilisateurs utilisent le **lien magique** (email) depuis la section *Compte Supabase* du rapport débloqué :

- [ ] Dashboard Supabase → **Authentication** → **URL Configuration** : ajouter en **Redirect URLs** (ou *Site URL* selon version) au minimum :
  - [ ] `http://localhost:3000/report` (dev)
  - [ ] `https://TON_DOMAINE/report` (prod)
- [ ] Vérifier que l’**email** autorisé côté Auth correspond bien à celui saisi au Checkout Stripe (sinon la liaison `user_id` refusera par design).

Sans cette config, le bouton **Recevoir le lien** peut échouer silencieusement ou renvoyer une erreur Supabase côté client.

---

## Suite produit / code (hors ce fichier)

Priorités typiques après la config ci-dessus : **RLS** côté client, **portail client Stripe**, **auth** (magic link produit global). Voir **[`V2_CHECKLIST.md`](V2_CHECKLIST.md)** et **[`FUTURE_ARCHITECTURE.md`](FUTURE_ARCHITECTURE.md)**. Cadrage **suivi long terme** (bilans / jalons vs journal d’entraînement) : **[`ROADMAP.md`](../ROADMAP.md)** § *Suivi long terme — cadrage produit*.
