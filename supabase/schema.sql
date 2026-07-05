-- =====================================================================
-- BuildReady Blueprint — Database Schema
-- =====================================================================
-- Run this in the Supabase SQL editor (or `supabase db push`).
-- Designed for PostgreSQL 15+ (Supabase default).
-- =====================================================================

-- Required extensions ------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "uuid-ossp";  -- uuid helper (optional)

-- ---------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  full_name   text,
  avatar_url  text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'User profile, 1:1 with auth.users.';

-- ---------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.profiles(id) on delete cascade,
  name                 text not null,
  slug                 text not null,
  status               text not null default 'draft'
                       check (status in ('draft','questionnaire','preview','unlocked','expired')),
  questionnaire_data   jsonb,
  preview_blueprint_id uuid,  -- fk added below (self/cross ref to blueprints)
  blueprint_id         uuid,  -- full (unlocked) blueprint
  stripe_session_id    text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (user_id, slug)
);

comment on table public.projects is 'A user’s project; holds questionnaire answers and blueprint references.';

-- ---------------------------------------------------------------------
-- blueprints
-- ---------------------------------------------------------------------
create table if not exists public.blueprints (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  stage         text not null default 'preview'
                check (stage in ('preview','full')),
  content       jsonb not null,                  -- BlueprintJSON structure
  model         text,                            -- e.g. 'gpt-4o'
  tokens_used   integer,
  is_locked     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.blueprints is 'AI-generated blueprint artifacts (preview = locked, full = unlocked).';

-- Now wire the project → blueprint references (deferred to allow the cross-ref).
alter table public.projects
  add constraint projects_preview_blueprint_fk
  foreign key (preview_blueprint_id) references public.blueprints(id) on delete set null;

alter table public.projects
  add constraint projects_blueprint_fk
  foreign key (blueprint_id) references public.blueprints(id) on delete set null;

-- ---------------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------------
create table if not exists public.payments (
  id                         uuid primary key default gen_random_uuid(),
  project_id                 uuid not null references public.projects(id) on delete cascade,
  user_id                    uuid not null references public.profiles(id) on delete cascade,
  tier                       text not null check (tier in ('blueprint','pro')),
  amount                     integer not null,           -- cents
  currency                   text not null default 'usd',
  status                     text not null default 'pending'
                             check (status in ('pending','paid','failed','refunded')),
  stripe_payment_intent_id   text,
  stripe_session_id          text,
  receipt_url                text,
  paid_at                    timestamptz,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

comment on table public.payments is 'Stripe payment records tied to a project.';

-- ---------------------------------------------------------------------
-- downloads
-- ---------------------------------------------------------------------
create table if not exists public.downloads (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  blueprint_id  uuid not null references public.blueprints(id) on delete cascade,
  format        text not null check (format in ('json','markdown','pdf')),
  ip_address    inet,
  created_at    timestamptz not null default now()
);

comment on table public.downloads is 'Audit log of blueprint downloads.';

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
create index if not exists idx_projects_user_id          on public.projects(user_id);
create index if not exists idx_projects_status           on public.projects(status);
create index if not exists idx_blueprints_project_id     on public.blueprints(project_id);
create index if not exists idx_payments_project_id        on public.payments(project_id);
create index if not exists idx_payments_user_id           on public.payments(user_id);
create index if not exists idx_payments_status           on public.payments(status);
create index if not exists idx_downloads_user_id          on public.downloads(user_id);
create index if not exists idx_downloads_blueprint_id     on public.downloads(blueprint_id);
