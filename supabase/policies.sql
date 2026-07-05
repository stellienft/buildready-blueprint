-- =====================================================================
-- BuildReady Blueprint — Row Level Security (RLS) Policies
-- =====================================================================
-- Assumes schema.sql has been applied.
-- Model: users see & manage their own data; admins see everything;
-- anonymous (public) users may create projects (so signup → first project
-- flow works) but cannot read/update others' projects.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Enable RLS on every table
-- ---------------------------------------------------------------------
alter table public.profiles   enable row level security;
alter table public.projects   enable row level security;
alter table public.blueprints enable row level security;
alter table public.payments   enable row level security;
alter table public.downloads  enable row level security;

-- ---------------------------------------------------------------------
-- Helper: is the current user an admin?
-- Reused across policies. Returns boolean.
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- =====================================================================
-- profiles
-- =====================================================================

-- A user can read & update their own profile.
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- A user may insert their own profile row (e.g. on signup completion).
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Admins see all profiles.
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

-- =====================================================================
-- projects
-- =====================================================================

-- Owner can do everything to their own projects.
create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Public (even unauthenticated) may create a project so the
-- questionnaire → preview flow works before signup completes.
-- NOTE: `user_id` is nullable-safe only when handled by a trigger/service
-- role; in practice projects are created post-auth. Kept permissive as spec.
create policy "Public can create projects"
  on public.projects for insert
  to anon, authenticated
  with check (true);

-- Admins can view/manage all projects.
create policy "Admins can view all projects"
  on public.projects for select
  using (public.is_admin());

create policy "Admins can update all projects"
  on public.projects for update
  using (public.is_admin());

create policy "Admins can delete all projects"
  on public.projects for delete
  using (public.is_admin());

-- =====================================================================
-- blueprints
-- =====================================================================

-- Visible to the project owner (preview is locked but still viewable
-- by the owner; full unlock is gated client-side / by is_locked).
create policy "Users can view own blueprints"
  on public.blueprints for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = blueprints.project_id
        and p.user_id = auth.uid()
    )
  );

create policy "Users can insert own blueprints"
  on public.blueprints for insert
  with check (
    exists (
      select 1 from public.projects p
      where p.id = blueprints.project_id
        and p.user_id = auth.uid()
    )
  );

create policy "Users can update own blueprints"
  on public.blueprints for update
  using (
    exists (
      select 1 from public.projects p
      where p.id = blueprints.project_id
        and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = blueprints.project_id
        and p.user_id = auth.uid()
    )
  );

create policy "Users can delete own blueprints"
  on public.blueprints for delete
  using (
    exists (
      select 1 from public.projects p
      where p.id = blueprints.project_id
        and p.user_id = auth.uid()
    )
  );

-- Admins see & manage all blueprints.
create policy "Admins can view all blueprints"
  on public.blueprints for select
  using (public.is_admin());

create policy "Admins can manage all blueprints"
  on public.blueprints for all
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================================
-- payments
-- =====================================================================

-- Owner can view their own payments (e.g. receipt history).
create policy "Users can view own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Users can insert own payments"
  on public.payments for insert
  with check (auth.uid() = user_id);

create policy "Users can update own payments"
  on public.payments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admins see & manage all payments.
create policy "Admins can view all payments"
  on public.payments for select
  using (public.is_admin());

create policy "Admins can manage all payments"
  on public.payments for all
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================================
-- downloads
-- =====================================================================

create policy "Users can view own downloads"
  on public.downloads for select
  using (auth.uid() = user_id);

create policy "Users can insert own downloads"
  on public.downloads for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own downloads"
  on public.downloads for delete
  using (auth.uid() = user_id);

-- Admins see all downloads (audit).
create policy "Admins can view all downloads"
  on public.downloads for select
  using (public.is_admin());

create policy "Admins can manage all downloads"
  on public.downloads for all
  using (public.is_admin())
  with check (public.is_admin());
