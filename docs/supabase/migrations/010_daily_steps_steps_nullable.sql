-- Miroir de supabase/migrations/20260513140000_daily_steps_steps_nullable.sql

alter table public.daily_steps alter column steps drop not null;
