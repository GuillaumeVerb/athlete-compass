-- Miroir de docs/supabase/migrations/011_purchases_rls_stripe_customer_plan_policies.sql

alter table public.purchases
  add column if not exists stripe_customer_id text null;

comment on column public.purchases.stripe_customer_id is 'Stripe Customer (cus_…) — portail facturation / historique.';

alter table public.purchases enable row level security;

drop policy if exists purchases_select_own on public.purchases;
create policy purchases_select_own
  on public.purchases for select
  to authenticated
  using (user_id is not null and auth.uid() = user_id);

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

alter table public.checkout_snapshots enable row level security;
