-- Historique des plans 4 semaines (V3) — regroupement par client_sync_id jusqu’à auth utilisateur.

create table if not exists public.plan_instances (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_sync_id uuid not null,
  fingerprint text not null,
  weeks jsonb not null
);

create index if not exists plan_instances_client_created_idx
  on public.plan_instances (client_sync_id, created_at desc);

comment on table public.plan_instances is 'Snapshots plan 4 semaines ; client_sync_id = identifiant navigateur (localStorage) avant user_id.';
comment on column public.plan_instances.client_sync_id is 'UUID stable côté client — ne pas traiter comme secret fort.';
comment on column public.plan_instances.weeks is 'Tableau JSON aligné sur PlanWeek[] (lib/plans/plan-types).';

alter table public.plan_instances enable row level security;
