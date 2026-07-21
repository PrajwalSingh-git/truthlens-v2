-- TruthLens AI v2 — Supabase database schema
-- Run this in your Supabase project: SQL Editor > New query > paste > Run

-- ============================================================
-- 1. profiles
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- 2. analyses
-- ============================================================
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  input_type text not null check (input_type in ('text', 'url')),
  input text not null,
  credibility numeric not null,
  confidence numeric not null,
  analysis_json jsonb not null,
  created_at timestamptz default now()
);

create index if not exists analyses_user_id_idx on public.analyses(user_id);
create index if not exists analyses_created_at_idx on public.analyses(created_at desc);

alter table public.analyses enable row level security;

create policy "Users can view their own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own analyses"
  on public.analyses for delete
  using (auth.uid() = user_id);


-- ============================================================
-- 3. saved_reports
-- ============================================================
create table if not exists public.saved_reports (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamptz default now()
);

create index if not exists saved_reports_user_id_idx on public.saved_reports(user_id);

alter table public.saved_reports enable row level security;

create policy "Users can view their own saved reports"
  on public.saved_reports for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saved reports"
  on public.saved_reports for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own saved reports"
  on public.saved_reports for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Notes:
-- - The FastAPI backend uses the SERVICE ROLE key, which bypasses RLS.
--   RLS above protects the tables if the frontend ever queries Supabase
--   directly with the anon key (it currently doesn't — all data access
--   goes through the FastAPI backend).
-- - Enable Google as an OAuth provider under Authentication > Providers,
--   and add your frontend URL(s) under Authentication > URL Configuration
--   > Redirect URLs (e.g. http://localhost:5173/dashboard and your
--   GitHub Pages URL).
-- ============================================================
