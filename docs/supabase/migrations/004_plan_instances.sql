-- Miroir de supabase/migrations/20260505120000_plan_instances.sql

create table if not exists public.plan_instances (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_sync_id uuid not null,
  fingerprint text not null,
  weeks jsonb not null
);

create index if not exists plan_instances_client_created_idx
  on public.plan_instances (client_sync_id, created_at desc);

comment on table public.plan_instances is 'Historique plans 4 semaines (V3).';
alter table public.plan_instances enable row level security;
