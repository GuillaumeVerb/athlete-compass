-- Miroir de docs/supabase/migrations/003_premium_reports.sql

create table if not exists public.premium_reports (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique
    references public.purchases (stripe_checkout_session_id) on delete cascade,
  product_key text not null check (product_key in ('bilan_9', 'plan_19', 'pack_29')),
  status text not null default 'ready' check (status in ('draft', 'ready', 'failed')),
  report_json jsonb not null,
  pdf_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists premium_reports_created_at_idx
  on public.premium_reports (created_at desc);

comment on table public.premium_reports is 'Rapport premium V2 — JSON servi à l’UI ; pdf_url réservé génération PDF.';
comment on column public.premium_reports.report_json is 'Payload structuré (snapshot + métadonnées produit).';

alter table public.premium_reports enable row level security;
