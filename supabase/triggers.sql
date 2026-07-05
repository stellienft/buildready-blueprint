-- =====================================================================
-- BuildReady Blueprint — Triggers & Functions
-- =====================================================================
-- Assumes schema.sql and (optionally) policies.sql have been applied.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Auto-create a profile row on signup
-- ---------------------------------------------------------------------
-- When a new row appears in auth.users, insert a matching public.profiles
-- row seeded with the user's email and metadata.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  -- Optional: flag admin if email is in ADMIN_EMAILS. The env list is not
  -- available in SQL, so admin promotion is instead handled in app code
  -- (see lib/auth). Left here as a hook for future server-side admin seeding.
  return new;
end;
$$;

-- Drop existing trigger (if re-running) then create.
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 2. Keep projects.updated_at fresh
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 3. Keep profiles.updated_at fresh
-- ---------------------------------------------------------------------
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 4. Keep blueprints.updated_at fresh
-- ---------------------------------------------------------------------
drop trigger if exists blueprints_set_updated_at on public.blueprints;
create trigger blueprints_set_updated_at
  before update on public.blueprints
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 5. Keep payments.updated_at fresh
-- ---------------------------------------------------------------------
drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at
  before update on public.payments
  for each row
  execute function public.set_updated_at();
