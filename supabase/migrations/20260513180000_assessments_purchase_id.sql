-- Miroir de docs/supabase/migrations/013_assessments_purchase_id.sql

alter table public.assessments
  add column if not exists purchase_id uuid null references public.purchases (id) on delete set null;

create index if not exists assessments_purchase_id_idx
  on public.assessments (purchase_id)
  where purchase_id is not null;

comment on column public.assessments.purchase_id is 'Achat Stripe lié (cookie rapport + JWT au POST) — optionnel.';
