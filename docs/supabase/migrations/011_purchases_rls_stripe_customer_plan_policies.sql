-- Client Stripe (portail facturation) + RLS lectures côté JWT (défense en profondeur).
-- Le serveur continue d’utiliser la service role (bypass RLS).

alter table public.purchases
  add column if not exists stripe_customer_id text null;

comment on column public.purchases.stripe_customer_id is 'Stripe Customer (cus_…) — portail facturation / historique.';

-- --- purchases : lecture uniquement pour les lignes liées au compte ---

alter table public.purchases enable row level security;

drop policy if exists purchases_select_own on public.purchases;
create policy purchases_select_own
  on public.purchases for select
  to authenticated
  using (user_id is not null and auth.uid() = user_id);

-- --- premium_reports : lecture si achat lié au JWT ---

drop policy if exists premium_reports_select_linked on public.premium_reports;
create policy premium_reports_select_linked
  on public.premium_reports for select
  to authenticated
  using (
    exists (
      select 1 from public.purchases p
      where p.stripe_checkout_session_id = premium_reports.stripe_checkout_session_id
        and p.user_id is not null
        and p.user_id = auth.uid()
    )
  );

-- --- plan_instances : CRUD lignes possédées (API admin inchangée) ---

drop policy if exists plan_instances_select_own on public.plan_instances;
create policy plan_instances_select_own
  on public.plan_instances for select
  to authenticated
  using (user_id is not null and auth.uid() = user_id);

drop policy if exists plan_instances_insert_own on public.plan_instances;
create policy plan_instances_insert_own
  on public.plan_instances for insert
  to authenticated
  with check (user_id is not null and auth.uid() = user_id);

drop policy if exists plan_instances_update_own on public.plan_instances;
create policy plan_instances_update_own
  on public.plan_instances for update
  to authenticated
  using (user_id is not null and auth.uid() = user_id)
  with check (user_id is not null and auth.uid() = user_id);

drop policy if exists plan_instances_delete_own on public.plan_instances;
create policy plan_instances_delete_own
  on public.plan_instances for delete
  to authenticated
  using (user_id is not null and auth.uid() = user_id);

-- --- checkout_snapshots : aucun accès client (file temporaire) ---

alter table public.checkout_snapshots enable row level security;
