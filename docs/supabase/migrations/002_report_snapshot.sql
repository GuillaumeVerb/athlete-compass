-- Snapshot bilan au moment du checkout + table temporaire Stripe metadata

alter table public.purchases
  add column if not exists report_snapshot jsonb null;

create table if not exists public.checkout_snapshots (
  id uuid primary key,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists checkout_snapshots_created_at_idx
  on public.checkout_snapshots (created_at desc);

comment on column public.purchases.report_snapshot is 'Bilan figé (profil + perfs + ScoreResult) au paiement — V2.';
comment on table public.checkout_snapshots is 'File temporaire snapshot_id → payload avant merge dans purchases (webhook / complete).';
