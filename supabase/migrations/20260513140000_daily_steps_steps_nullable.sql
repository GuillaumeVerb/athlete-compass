-- Permet d’enregistrer l’objectif pas / jour sans nombre de pas (synchro web honnête).

alter table public.daily_steps alter column steps drop not null;
