-- Hotfix alerte Supabase « Table publicly accessible » (rls_disabled_in_public).
-- Cible typique : `purchases`, `checkout_snapshots` créées avant la migration 011.
-- Idempotent. Enchaîne ensuite **011** (policies + stripe_customer_id + plan_instances, etc.).

alter table if exists public.purchases enable row level security;
alter table if exists public.checkout_snapshots enable row level security;
