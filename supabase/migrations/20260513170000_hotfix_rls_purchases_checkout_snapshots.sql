-- Miroir de docs/supabase/migrations/012_hotfix_rls_purchases_checkout_snapshots.sql

alter table if exists public.purchases enable row level security;
alter table if exists public.checkout_snapshots enable row level security;
