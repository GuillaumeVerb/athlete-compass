# Checklist intégrations V2 — mémo

Référence rapide : ce qui est **déjà branché dans le code**, ce qui **reste côté toi** (config / produit), et ce qui est **volontairement plus tard** (hors périmètre actuel).

**Config Stripe + Resend + déploiement (listes à cocher)** : **[`V2_A_FAIRE.md`](V2_A_FAIRE.md)** — à faire quand tu branches monétisation et emails.

Guide technique pas à pas : **[`V2_SETUP.md`](V2_SETUP.md)**.

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

- Migrations **`001` / `002` / `003`** (ou `supabase db push`) : `purchases`, snapshot checkout, **`premium_reports`**.
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

1. **Migration `003`** déjà appliquée sur ton instance ? sinon `db push` ou SQL Editor.
2. **Stripe + Resend + prod** : suivre **`V2_A_FAIRE.md`**.
3. **PDF** : route **`GET /api/report/pdf`** (aperçu `pdf-lib`, cookie requis) ; stockage **`pdf_url`** + bucket Supabase — à faire.
4. **Auth** (magic link) + `user_id` sur achats / rapports.

---

_Checklist courte ; tâches « dashboard » centralisées dans `V2_A_FAIRE.md`._
