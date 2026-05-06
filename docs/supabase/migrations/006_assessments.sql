-- Miroir de supabase/migrations/20260507120000_assessments.sql

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  profile_id uuid null,
  hybrid_score numeric not null,
  athletic_age numeric not null,
  reliability_pct numeric not null,
  profile_label text not null,
  profile_key text not null,
  limiter text not null,
  next_best_move jsonb not null,
  breakdown jsonb not null,
  goals_4_weeks jsonb not null,
  performance_snapshot jsonb not null,
  profile_snapshot jsonb not null,
  source text not null default 'manual'
    check (source in ('manual', 'retest_30d', 'import')),
  previous_assessment_id uuid references public.assessments (id) on delete set null
);

create index if not exists assessments_user_created_idx
  on public.assessments (user_id, created_at desc);

create index if not exists assessments_previous_idx
  on public.assessments (previous_assessment_id)
  where previous_assessment_id is not null;

comment on table public.assessments is 'Bilan hybride persisté ; lecture RLS côté client authentifié.';
comment on column public.assessments.profile_key is 'Identifiant profil athlétique (ex. strength_gap) — aligné ScoreResult.profileId.';
comment on column public.assessments.next_best_move is 'Objet NextBestMovePlan (JSON).';
comment on column public.assessments.profile_snapshot is 'Profil utilisé pour le calcul (reproductibilité).';

alter table public.assessments enable row level security;

create policy assessments_select_own
  on public.assessments for select
  to authenticated
  using (auth.uid() = user_id);

create policy assessments_insert_own
  on public.assessments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy assessments_update_own
  on public.assessments for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy assessments_delete_own
  on public.assessments for delete
  to authenticated
  using (auth.uid() = user_id);
