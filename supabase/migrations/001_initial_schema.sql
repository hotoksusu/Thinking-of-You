create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text check (char_length(nickname) <= 60), avatar_url text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null,
  summary text, description text, category text, difficulty text, estimated_minutes integer check (estimated_minutes between 1 and 1440),
  location_type text, cost_level text, image_url text, is_featured boolean not null default false,
  is_published boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  activity_slug text not null, created_at timestamptz not null default now(), unique(user_id, activity_slug)
);
create table if not exists public.user_activity_history (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  activity_slug text not null, status text not null check (status in ('saved','started','completed','skipped')),
  started_at timestamptz, completed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(user_id, activity_slug)
);
create table if not exists public.user_responses (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  question_key text not null, response_value jsonb not null, session_id uuid, created_at timestamptz not null default now()
);
create table if not exists public.recommendation_sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  input_summary jsonb not null default '{}'::jsonb, result jsonb not null,
  recommendation_source text not null check (recommendation_source in ('rule','ai','editorial')), created_at timestamptz not null default now()
);
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  feedback_type text not null, message text not null check (char_length(message) between 1 and 2000), page_path text,
  created_at timestamptz not null default now()
);
create table if not exists public.local_data_imports (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  storage_key text not null, payload jsonb not null, migrated_at timestamptz not null default now(), unique(user_id, storage_key)
);

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger activities_updated_at before update on public.activities for each row execute function public.set_updated_at();
create trigger activity_history_updated_at before update on public.user_activity_history for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.profiles(id, nickname) values (new.id, coalesce(new.raw_user_meta_data->>'nickname','')) on conflict do nothing; return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
