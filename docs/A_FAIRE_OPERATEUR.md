# À faire opérateur — après merge / avant prod sereine

Liste **centralisée** des actions hors code (ou après `git pull`). Le détail Stripe / Resend / déploiement reste dans **[`V2_A_FAIRE.md`](V2_A_FAIRE.md)**.

---

## Supabase (instance `athlete_compass`)

- [ ] **Migrations SQL** appliquées dans l’ordre attendu sur le projet (SQL Editor ou `supabase db push`) :
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
| Moyenne | **Lier achat ↔ bilan** (`assessment` / `purchase_id`) | Voir `docs/FUTURE_ARCHITECTURE.md` ; aujourd’hui bilan cloud = action manuelle depuis Résultats. |
| Moyenne | **Analytics** (tunnel profil → perf → résultats → pricing) | Pas branché dans le repo. |
| V3 | **Retest 30 j** guidé + rappels cron | Migrations `008` + `CRON_SECRET` — `V2_A_FAIRE.md`. |
| V3 | **Courbes cloud** alignées sur l’historique local `/results` | Données `assessments` + UX comparaison. |

---

_Dernière mise à jour : alignée sur le lot V2 (rapport, PDF, liaison compte, portail Stripe, RLS)._
