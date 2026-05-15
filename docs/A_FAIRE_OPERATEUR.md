# À faire opérateur — après merge / avant prod sereine

Liste **centralisée** des actions hors code (ou après `git pull`). Le détail Stripe / Resend / déploiement reste dans **[`V2_A_FAIRE.md`](V2_A_FAIRE.md)**.

---

## V2 « prêt à vendre » (minimum)

Côté **code**, le parcours principal (checkout → webhook / `purchase/complete` → rapport débloqué, PDF aperçu, portail Stripe, bilans cloud, comparaison local/cloud sur **`/results`**, lien achat ↔ bilan si cookie + JWT) est **en place**. Pour un **MVP exploitable**, il reste surtout à **valider sur ton instance** :

1. **Migrations** dans l’ordre utile : **`011`** / **`012`** (RLS / Security Advisor), **`013`** (lien bilan ↔ achat), **`009`** + env bucket si tu veux le **PDF en Storage** — voir section Supabase ci-dessous.
2. **Stripe** (test puis prod) jusqu’à ce que `pnpm check:v2` ou `GET /api/health/cloud` indique un checkout utilisable (`stripeCheckout: true` dans la logique health).
3. **Un paiement test** bout en bout (carte test → `/report` → lignes `purchases` / `premium_reports` comme dans **`V2_A_FAIRE.md`**).
4. **Optionnel** : Resend (email post-achat déjà branché dans le code), Customer Portal Stripe, URLs magic link `/report` quand tu ouvres l’auth produit.

Quand **1 à 3** sont cochés sur une instance réelle, le **MVP V2 est fonctionnel** ; le reste (analytics, rétention V3 poussée) est au-delà du « premier euro ».

---

## Supabase (instance `athlete_compass`)

- [ ] **Migrations SQL** appliquées dans l’ordre attendu sur le projet (SQL Editor ou `supabase db push`) :
  - [ ] **`013`** — `assessments.purchase_id` (lien bilan cloud ↔ achat Stripe).
  - [ ] **`012`** — hotfix RLS `purchases` + `checkout_snapshots` (alerte *Table publicly accessible*).
  - [ ] **`011`** — RLS complètes, policies `plan_instances` / `premium_reports`, colonne `stripe_customer_id`.
  - [ ] **`009_report_pdf_storage_bucket.sql`** — bucket Storage `report-pdfs` (privé).
- [ ] **Variables** : `SUPABASE_REPORT_PDF_BUCKET=report-pdfs` (si tu veux la persistance PDF côté Storage).
- [ ] **Auth — plus tard** : URLs de redirection pour le magic link sur `/report` (section dédiée dans `V2_A_FAIRE.md`).
- [ ] **Security Advisor** : revérifier après migrations ; requête de contrôle dans `V2_A_FAIRE.md` (section RLS).

---

## Stripe

- [ ] Tout le bloc checklist **[`V2_A_FAIRE.md`](V2_A_FAIRE.md) § Stripe** (prix, webhook prod, `NEXT_PUBLIC_APP_URL`, etc.).
- [ ] **Customer Portal** activé (facturation / reçus) — sinon le bouton « Facturation & reçus » sur `/report` renvoie une erreur.

---

## Hébergeur (ex. Vercel)

- [ ] Recopier les variables d’environnement (Supabase, Stripe, `NEXT_PUBLIC_APP_URL`, secrets webhook, optionnel Resend / bucket PDF).
- [ ] Redéployer après changement d’env.

---

## V2 / V3 — suite produit & tech (backlog court)

| Priorité | Sujet | Note |
| --- | --- | --- |
| Haute | **Resend** post-achat | Optionnel mais utile — `V2_A_FAIRE.md` § Resend. |
| Moyenne | **Lier achat ↔ bilan** (`assessment` / `purchase_id`) | Migration **`013`** + cookie rapport au POST ; badge « Mes bilans ». |
| Moyenne | **Analytics** (tunnel profil → perf → résultats → pricing) | Pas branché dans le repo. |
| V3 | **Retest 30 j** guidé + rappels cron | Migrations `008` + `CRON_SECRET` — `V2_A_FAIRE.md`. |
| V3 | **Courbes cloud** alignées sur l’historique local `/results` | Données `assessments` + UX comparaison. |

---

_Dernière mise à jour : MVP V2 côté code ; fin de boucle = instance (migrations + Stripe test) + section « prêt à vendre » ci-dessus._
