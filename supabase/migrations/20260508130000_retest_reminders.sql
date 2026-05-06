-- Rappels retest (V3) — persistance ; envoi e-mail / cron à brancher.

create table if not exists public.retest_reminders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  anchor_assessment_id uuid not null references public.assessments (id) on delete cascade,
  due_at timestamptz not null,
  channel text not null default 'email' check (channel in ('email')),
  sent_at timestamptz null,
  cancelled_at timestamptz null
);

create index if not exists retest_reminders_user_due_idx
  on public.retest_reminders (user_id, due_at);

comment on table public.retest_reminders is 'Rappel opt-in retest — envoi Resend / job à implémenter.';

alter table public.retest_reminders enable row level security;

create policy retest_reminders_select_own
  on public.retest_reminders for select
  to authenticated
  using (auth.uid() = user_id);

create policy retest_reminders_insert_own
  on public.retest_reminders for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy retest_reminders_update_own
  on public.retest_reminders for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy retest_reminders_delete_own
  on public.retest_reminders for delete
  to authenticated
  using (auth.uid() = user_id);
