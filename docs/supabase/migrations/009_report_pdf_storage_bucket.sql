-- Bucket Storage privé pour les PDF d’aperçu rapport (V2).
-- Ensuite : définir SUPABASE_REPORT_PDF_BUCKET=report-pdfs côté serveur (voir .env.example).

insert into storage.buckets (id, name, public)
values ('report-pdfs', 'report-pdfs', false)
on conflict (id) do nothing;
