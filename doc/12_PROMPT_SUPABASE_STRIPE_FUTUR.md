# Prompt 12 — Préparer Supabase et Stripe pour plus tard

Prépare l’architecture future Supabase + Stripe pour **Athlete Compass**, sans l’implémenter complètement maintenant.

## Objectif

La V1 doit rester simple, mais le code doit pouvoir évoluer vers :

- comptes utilisateurs ;
- historique des bilans ;
- rapports premium ;
- paiement Stripe ;
- accès au rapport après achat ;
- version coach plus tard.

## Important

Ne pas casser la V1 locale. Ne pas rendre Supabase ou Stripe obligatoires pour lancer l’app.

## À faire maintenant

### 1. Ajouter un document d’architecture

Créer `docs/FUTURE_ARCHITECTURE.md` avec :

- modèle de données futur ;
- flux utilisateur ;
- flux paiement ;
- sécurité ;
- limites V1 ;
- plan d’implémentation V2.

### 2. Préparer les types

Créer des types TypeScript réutilisables :

- `UserProfile` ;
- `PerformanceInput` ;
- `Assessment` ;
- `ScoreBreakdown` ;
- `PremiumReport` ;
- `Plan4Weeks` ;
- `Purchase`.

### 3. Modèle de données futur Supabase

Proposer les tables :

#### users

- id ;
- email ;
- created_at.

#### profiles

- id ;
- user_id ;
- age ;
- sex ;
- height_cm ;
- weight_kg ;
- waist_cm ;
- goal ;
- training_frequency ;
- constraints ;
- equipment ;
- created_at ;
- updated_at.

#### assessments

- id ;
- user_id ;
- profile_id ;
- hybrid_score ;
- athletic_age ;
- reliability ;
- profile_label ;
- limiter ;
- next_best_move ;
- created_at.

#### performance_tests

- id ;
- assessment_id ;
- test_key ;
- value ;
- unit ;
- score ;
- category ;
- created_at.

#### premium_reports

- id ;
- user_id ;
- assessment_id ;
- status ;
- report_json ;
- pdf_url ;
- created_at.

#### purchases

- id ;
- user_id ;
- stripe_checkout_session_id ;
- stripe_payment_intent_id ;
- product_key ;
- amount ;
- currency ;
- status ;
- created_at.

### 4. Flux Stripe futur

Documenter :

1. utilisateur calcule son score ;
2. il clique sur “Débloquer mon rapport” ;
3. création Stripe Checkout Session ;
4. paiement ;
5. webhook Stripe ;
6. génération du rapport ;
7. accès au rapport via page sécurisée ou magic link.

### 5. Variables d’environnement futures

Documenter dans `.env.example` :

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Ne pas rendre ces variables obligatoires pour lancer la V1.

## Contraintes

- Pas d’intégration Stripe réelle maintenant.
- Pas de migration Supabase obligatoire maintenant.
- Ne pas bloquer le lancement local.
- L’objectif est uniquement de préparer proprement la suite.

