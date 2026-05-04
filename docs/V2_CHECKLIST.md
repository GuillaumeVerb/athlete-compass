# Checklist intégrations V2 — mémo

Référence rapide : ce qui est **déjà branché dans le code**, ce qui **reste côté toi** (config / produit), et ce qui est **volontairement plus tard** (hors périmètre actuel).

Guide détaillé pas à pas : **[`V2_SETUP.md`](V2_SETUP.md)**.

---

## État actuel (résumé)

| Bloc | Statut typique | Notes |
| --- | --- | --- |
| **Supabase** (URL, anon, service role + SQL `purchases` / snapshot) | Souvent **OK** une fois migrations appliquées | `GET /api/health/cloud` → `supabaseAdmin: true` |
| **Stripe Checkout** (clé secrète + 3 Price IDs) | **Souvent à finir** | Même endpoint → `stripeCheckout: true` quand tout est rempli |
| **Webhook Stripe** | **Local ou prod à brancher** | Sans `STRIPE_WEBHOOK_SECRET` valide, la route webhook répond **503** ; l’upsert `purchases` côté événement peut ne pas tourner |
| **Cookie rapport** | OK si `STRIPE_SECRET_KEY` ou `PURCHASE_SIGNING_SECRET` | Déblocage `/report` après redirect `purchase/complete` |

---

## Ce qu’il reste — Stripe (mémo)

Pour que l’app considère le paiement comme **activable** (`stripeCheckout: true` dans `/api/health/cloud`) :

1. **Dashboard Stripe** (mode **test** pour le dev) : [dashboard.stripe.com](https://dashboard.stripe.com/).
2. **Trois produits / prix** (one-time, `mode: payment` côté app) alignés avec :
   - `STRIPE_PRICE_BILAN_9`
   - `STRIPE_PRICE_PLAN_19`
   - `STRIPE_PRICE_PACK_29`  
   → valeurs = IDs `price_...` (pas les montants en euros dans l’env).
3. **`STRIPE_SECRET_KEY`** = `sk_test_...` (reste **serveur uniquement**, jamais dans le client).
4. **`STRIPE_WEBHOOK_SECRET`** = `whsec_...` :
   - **Local** : `stripe listen --forward-to localhost:PORT/api/webhooks/stripe` (remplacer `PORT` par celui de `npm run dev`, ex. `3000`), puis coller le secret affiché, **redémarrer** Next.
   - **Prod (Vercel, etc.)** : endpoint public `https://TON_DOMAINE/api/webhooks/stripe` + secret du **webhook configuré dans le dashboard** Stripe (pas celui de `stripe listen`).
5. **`NEXT_PUBLIC_APP_URL`** : même origine que l’URL où tourne l’app (succès / annulation Checkout). Si tu devs sur un autre port que 3000, mets l’URL complète correspondante.

**Optionnel aujourd’hui**

- **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`** : présent dans `.env.example` pour plus tard ; le flux actuel utilise **Stripe Hosted Checkout** (redirection) — le code ne lit pas encore cette clé pour du Stripe.js embarqué.
- **`PURCHASE_SIGNING_SECRET`** : sinon le cookie `ac_report_unlock` est signé avec un dérivé de `STRIPE_SECRET_KEY` (voir `V2_SETUP.md`).

**Vérification en 10 secondes**

```bash
curl -s "http://localhost:3000/api/health/cloud" | jq
```

Objectif : `stripeSecret: true` et `stripeCheckout: true`.

---

## Autre chose à regarder ? (hors « remplir Stripe »)

### Déjà couvert si tu as suivi la doc

- Migrations **`001` / `002` / `003`** (ou `supabase db push`) : `purchases`, snapshot checkout, **`premium_reports`**.
- Variables Supabase dans `.env` / hébergeur.

### À ne pas oublier au moment du déploiement

- **Recopier toutes les variables** sensibles sur **Vercel** (ou autre) : Stripe, Supabase, `NEXT_PUBLIC_APP_URL` en **https** avec le bon domaine.
- **Webhook prod** dans Stripe : URL + secret **dédiés** à l’environnement prod (pas le `whsec` du `stripe listen` local).

### Pas dans le code V1 / couche actuelle (pas bloquant pour « payer + voir le rapport »)

- **RLS** Supabase sur `purchases` / tables futures — aujourd’hui l’app passe par le **service role** côté serveur ; durcir quand il y aura auth utilisateur + accès client direct.
- **Rapport PDF / génération fichier** — `premium_reports.pdf_url` et job d’export ; la ligne **`premium_reports`** avec **`report_json`** est déjà synchronisée côté serveur après paiement si un snapshot checkout existe.
- **Lier un `user_id`** aux achats, compte utilisateur, portail client Stripe — évolutions produit.

### Qualité / confiance

- Faire **un paiement test** bout en bout : Checkout → redirect → `/report` → vérifier une ligne dans **`purchases`** et **`premium_reports`** (et **`report_snapshot`** si snapshot envoyé au checkout avec Supabase admin OK).

---

## Prochaines briques V2 (ordre suggéré)

1. **Appliquer la migration `003_premium_reports.sql`** sur ton projet Supabase (`db push` ou SQL Editor) — sans ça, l’upsert `premium_reports` log une erreur (l’achat `purchases` reste OK).
2. **Stripe** : clés + webhooks + paiement test (voir section Stripe ci-dessus).
3. **Email de confirmation** après `checkout.session.completed` (ex. Resend / SendGrid) — pas encore dans le code.
4. **PDF** : génération async + `pdf_url` (Supabase Storage ou S3) + lien dans l’UI `/report`.
5. **Auth** légère (magic link) et `user_id` sur `purchases` / `premium_reports` quand le modèle utilisateur sera posé.

---

_Dernière mise à jour : checklist à garder à côté de `V2_SETUP.md` lors des itérations Stripe / déploiement._
