-- Table minimale des achats Stripe (V2).
-- Miroir de docs/supabase/migrations/001_purchases.sql

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text null,
  product_key text not null check (product_key in ('bilan_9', 'plan_19', 'pack_29')),
  amount_cents integer not null default 0,
  currency text not null default 'eur',
  status text not null default 'paid' check (status in ('pending', 'paid', 'refunded')),
  customer_email text null,
  created_at timestamptz not null default now()
);

create index if not exists purchases_created_at_idx on public.purchases (created_at desc);

comment on table public.purchases is 'Achats Stripe — RLS à activer selon modèle auth (V2).';
