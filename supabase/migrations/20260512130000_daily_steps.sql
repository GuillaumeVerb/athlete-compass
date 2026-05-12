-- Pas quotidiens (optionnel) — aligné sur la saisie /daily et future synchro API.

create table if not exists public.daily_steps (
  id uuid primary key default gen_random_uuid(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  steps integer not null check (steps >= 0 and steps <= 300000),
  steps_goal integer not null check (steps_goal >= 2000 and steps_goal <= 80000),
  unique (user_id, day)
);

create index if not exists daily_steps_user_day_idx
  on public.daily_steps (user_id, day desc);

comment on table public.daily_steps is 'Pas du jour par utilisateur ; upsert depuis l’app web authentifiée.';

alter table public.daily_steps enable row level security;

create policy daily_steps_select_own
  on public.daily_steps for select
  to authenticated
  using (auth.uid() = user_id);

create policy daily_steps_insert_own
  on public.daily_steps for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy daily_steps_update_own
  on public.daily_steps for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy daily_steps_delete_own
  on public.daily_steps for delete
  to authenticated
  using (auth.uid() = user_id);
