-- Lien plan → utilisateur auth (V3+) et achat optionnel (V2).

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

comment on column public.plan_instances.user_id is 'Renseigné quand la requête porte un JWT Supabase valide.';
comment on column public.plan_instances.purchase_id is 'Réserve : rattachement explicite à un achat (webhook / portail).';
