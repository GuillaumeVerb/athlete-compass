-- Feedback hebdo plan (V4) + trace d’adaptation.

create table if not exists public.plan_week_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_sync_id uuid not null,
  fingerprint text not null,
  week_index integer not null check (week_index >= 1 and week_index <= 4),
  fatigue text not null check (fatigue in ('low', 'ok', 'high')),
  sessions_completed integer null,
  note text null,
  plan_instance_id uuid null references public.plan_instances (id) on delete set null
);

create index if not exists plan_week_feedback_user_created_idx
  on public.plan_week_feedback (user_id, created_at desc);

create index if not exists plan_week_feedback_client_fp_week_idx
  on public.plan_week_feedback (client_sync_id, fingerprint, week_index);

comment on table public.plan_week_feedback is 'Ressenti fin de semaine — V4 plan adaptatif.';

alter table public.plan_week_feedback enable row level security;

create policy plan_week_feedback_select_own
  on public.plan_week_feedback for select
  to authenticated
  using (auth.uid() = user_id);

create policy plan_week_feedback_insert_own
  on public.plan_week_feedback for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy plan_week_feedback_update_own
  on public.plan_week_feedback for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy plan_week_feedback_delete_own
  on public.plan_week_feedback for delete
  to authenticated
  using (auth.uid() = user_id);

create table if not exists public.plan_adaptation_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  from_plan_instance_id uuid null references public.plan_instances (id) on delete set null,
  to_plan_instance_id uuid not null references public.plan_instances (id) on delete cascade,
  reason text not null check (reason in ('weekly_feedback', 'manual_regen', 'profile_change')),
  payload jsonb null
);

create index if not exists plan_adaptation_events_user_created_idx
  on public.plan_adaptation_events (user_id, created_at desc);

comment on table public.plan_adaptation_events is 'Chaîne de régénérations plan (audit UX).';

alter table public.plan_adaptation_events enable row level security;

create policy plan_adaptation_events_select_own
  on public.plan_adaptation_events for select
  to authenticated
  using (auth.uid() = user_id);
