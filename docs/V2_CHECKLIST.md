# Checklist intégrations V2 — mémo

Référence rapide : ce qui est **déjà branché dans le code**, ce qui **reste côté toi** (config / produit), et ce qui est **volontairement plus tard** (hors périmètre actuel).

**Config Stripe + Resend + déploiement (cases à cocher détaillées)** : **[`V2_A_FAIRE.md`](V2_A_FAIRE.md)**.

Guide technique pas à pas : **[`V2_SETUP.md`](V2_SETUP.md)**. Variables d’exemple : **`.env.example`**.

---

## Vérification rapide (local ou prod)

```bash
curl -s "$NEXT_PUBLIC_APP_URL/api/health/cloud" | jq
```

(En local sans `NEXT_PUBLIC_APP_URL` : `curl -s http://localhost:3000/api/health/cloud | jq`.)

**Sans lancer le serveur** : `pnpm check:v2` — même logique que l’API health, lecture seule des fichiers `.env` / `.env.local`.

| Clé | Signification |
| --- | --- |
| `supabaseBrowser` | `NEXT_PUBLIC_SUPABASE_*` présents |
| `supabaseAdmin` | `SUPABASE_SERVICE_ROLE_KEY` présent |
| `stripeSecret` | `STRIPE_SECRET_KEY` présente |
| `stripeWebhook` | `STRIPE_WEBHOOK_SECRET` présent |
| `stripeCheckout` | secret + **les trois** `STRIPE_PRICE_*` (voir `isStripeCheckoutConfigured` dans `lib/env/cloud-ready.ts`) ; `NEXT_PUBLIC_APP_URL` **recommandé** pour les URLs de retour Stripe en prod |
| `resendEmail` | `RESEND_API_KEY` + `RESEND_FROM_EMAIL` |
| `cronRetestReminders` | `CRON_SECRET` (rappels retest — optionnel) |

Tant que `stripeCheckout` est `false`, les CTA checkout restent en **navigation démo** (fallback) côté UI.

---

## Phases recommandées

1. **Phase A — Données** : appliquer les migrations **`001` … `008`** (`docs/supabase/migrations/`) sur ton projet Supabase ; vérifier `supabaseAdmin: true`.
2. **Phase B — Paiement test** : suivre **`V2_A_FAIRE.md`** (Stripe test + webhook local) jusqu’à `stripeCheckout: true` ; enchaîner un paiement `4242…` → `/report` + lignes `purchases` / `premium_reports` si snapshot checkout.
3. **Phase C — Emails** : Resend (optionnel) jusqu’à `resendEmail: true`.
4. **Phase D — Prod** : recopier les env sur l’hébergeur, webhook Stripe prod, domaine Resend aligné sur l’URL publique.

---

## État actuel (résumé)

| Bloc | Statut typique | Notes |
| --- | --- | --- |
| **Supabase** (URL, anon, service role + SQL) | Souvent **OK** une fois migrations appliquées | `GET /api/health/cloud` → `supabaseAdmin: true` |
| **Stripe** | **À configurer** | Détail : **`V2_A_FAIRE.md`** — `stripeCheckout: true` quand tout est rempli |
| **Resend** | **Optionnel** | **`V2_A_FAIRE.md`** — `resendEmail: true` |
| **Cookie rapport** | OK si `STRIPE_SECRET_KEY` ou `PURCHASE_SIGNING_SECRET` | Déblocage `/report` après redirect `purchase/complete` |

---

## Déjà couvert côté code / schéma

- Migrations **`001` … `008`** dans `docs/supabase/migrations/` : `purchases`, snapshot checkout, **`premium_reports`**, **`plan_instances`** (+ `user_id` / `purchase_id`), **`assessments`**, feedback plan, **rappels retest** (`008`) — à appliquer sur l’instance (`supabase db push` ou SQL Editor).
- Variables Supabase dans `.env` / hébergeur (hors Stripe/Resend : voir `V2_SETUP`).

---

## Autre chose à regarder ?

### À ne pas oublier au moment du déploiement

- Recopier les variables sur l’hébergeur — **liste** : **`V2_A_FAIRE.md`** (section déploiement).

### Pas bloquant pour « payer + voir le rapport » une fois Stripe OK

- **RLS** avancée — service role serveur pour l’instant.
- **Rapport PDF** — aperçu **`GET /api/report/pdf`** ; persistance **`pdf_url`** + Storage — à venir.
- **`user_id`** / compte / portail client Stripe — évolutions produit.

### Qualité / confiance

- Paiement test bout en bout (après **`V2_A_FAIRE.md` Stripe**) : Checkout → `/report` → **`purchases`** + **`premium_reports`** + **`report_snapshot`** si snapshot checkout.

---

## Prochaines briques V2 (code / produit)

1. **Migrations** sur l’instance : au minimum **`001`–`008`** ; pour la prod sereine et le reste du lot, suivre **`docs/A_FAIRE_OPERATEUR.md`** (**`009`–`013`**, **`011`/`012`** RLS).
2. **Stripe (+ optionnel Resend) + prod** : suivre **`V2_A_FAIRE.md`** + curl health ci-dessus.
3. **PDF** : la route **`GET /api/report/pdf`** (aperçu) est là ; la **persistance `pdf_url` + bucket Storage** reste côté opérateur (**migration `009`**, variable bucket).
4. **Auth** (magic link, redirect `/report`) + polish `user_id` sur achats / rapports — produit plus tard ; le flux cookie + checkout fonctionne sans.

---

_Checklist courte ; tâches « dashboard » centralisées dans `V2_A_FAIRE.md`._
