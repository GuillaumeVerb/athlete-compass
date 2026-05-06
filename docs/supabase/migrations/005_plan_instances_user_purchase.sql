-- Miroir de supabase/migrations/20260506120001_plan_instances_user_purchase.sql

alter table public.plan_instances
  add column if not exists user_id uuid references auth.users (id) on delete set null;

alter table public.plan_instances
  add column if not exists purchase_id uuid references public.purchases (id) on delete set null;

create index if not exists plan_instances_user_created_idx
  on public.plan_instances (user_id, created_at desc)
  where user_id is not null;

create index if not exists plan_instances_purchase_idx
  on public.plan_instances (purchase_id)
  where purchase_id is not null;
