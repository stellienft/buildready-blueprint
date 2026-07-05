-- =====================================================================
-- BuildReady Blueprint — Database Schema
-- Matches the Next.js application code exactly.
-- =====================================================================

-- Required extensions
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- profiles (1:1 with auth.users)
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
  business_name        text not null,
  business_type        text,
  main_offer           text,
  target_audience      text,
  website_goal         text,
  brand_style          text,
  tone_of_voice        text,
  colour_preferences   text,
  existing_branding    text,
  pages_needed         text[],
  preferred_builder    text,
  questionnaire_data   jsonb,
  status               text not null default 'preview'
                       check (status in ('preview','unlocked','expired')),
  payment_status       text not null default 'pending'
                       check (payment_status in ('pending','paid','failed')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

comment on table public.projects is 'A user project; holds questionnaire answers and payment status.';

-- ---------------------------------------------------------------------
-- blueprints
-- ---------------------------------------------------------------------
create table if not exists public.blueprints (
  id                    uuid primary key default gen_random_uuid(),
  project_id            uuid not null references public.projects(id) on delete cascade,
  preview_json          jsonb,
  full_blueprint_json   jsonb,
  master_prompt         text,
  bolt_prompt           text,
  lovable_prompt        text,
  framer_prompt         text,
  webflow_prompt        text,
  cursor_prompt         text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

comment on table public.blueprints is 'AI-generated blueprint with preview JSON and full blueprint JSON.';

-- ---------------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------------
create table if not exists public.payments (
  id                          uuid primary key default gen_random_uuid(),
  user_id                     uuid not null references public.profiles(id) on delete cascade,
  project_id                  uuid not null references public.projects(id) on delete cascade,
  stripe_checkout_session_id  text,
  stripe_payment_intent_id    text,
  stripe_customer_id          text,
  amount                      integer not null,  -- cents
  currency                    text not null default 'aud',
  status                      text not null default 'pending'
                              check (status in ('pending','paid','failed','refunded')),
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

comment on table public.payments is 'Stripe payment records tied to a project.';

-- ---------------------------------------------------------------------
-- downloads
-- ---------------------------------------------------------------------
create table if not exists public.downloads (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  project_id    uuid not null references public.projects(id) on delete cascade,
  download_type text not null check (download_type in ('txt','json','pdf')),
  created_at    timestamptz not null default now()
);

comment on table public.downloads is 'Audit log of blueprint downloads.';

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
create index if not exists idx_projects_user_id       on public.projects(user_id);
create index if not exists idx_projects_status        on public.projects(status);
create index if not exists idx_projects_payment_status on public.projects(payment_status);
create index if not exists idx_blueprints_project_id on public.blueprints(project_id);
create index if not exists idx_payments_project_id   on public.payments(project_id);
create index if not exists idx_payments_user_id      on public.payments(user_id);
create index if not exists idx_payments_status       on public.payments(status);
create index if not exists idx_downloads_user_id     on public.downloads(user_id);
create index if not exists idx_downloads_project_id  on public.downloads(project_id);
