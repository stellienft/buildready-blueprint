# BuildReady Blueprint

AI website blueprint generator. Users answer a guided questionnaire, get an AI-generated website blueprint, preview for free, and pay to unlock the full blueprint with AI build prompts.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (database, auth, storage)
- Stripe (payments)
- OpenAI (blueprint generation)
- React Hook Form + Zod (forms/validation)

## Quick Start

```bash
# Install dependencies
npm install

# Copy env file and fill in values
cp .env.example .env.local

# Run database migrations
# Go to Supabase SQL Editor and run:
#   1. supabase/schema.sql
#   2. supabase/policies.sql
#   3. supabase/triggers.sql

# Start dev server
npm run dev
```

## Environment Variables

See `.env.example` for all required variables:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` — Supabase project
- `OPENAI_API_KEY` — OpenAI API key (falls back to mock if not set)
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe
- `STRIPE_BLUEPRINT_PRICE_ID` / `STRIPE_PRO_PRICE_ID` — Stripe price IDs
- `ADMIN_EMAILS` — Comma-separated admin emails
- `RESEND_API_KEY` / `EMAIL_FROM` — Email (optional, mock fallback)

## Project Structure

```
/app
  /(marketing)        — Marketing pages (home, pricing, examples, faq, contact)
  /(auth)             — Auth pages (signup, login, forgot-password)
  /start              — Multi-step questionnaire
  /generating         — AI generation loading screen
  /preview/[projectId]— Blueprint preview (free sections + locked)
  /unlock/[projectId] — Pricing/paywall
  /dashboard          — User dashboard
  /dashboard/project/[projectId] — Full blueprint view
  /admin              — Admin dashboard
  /api
    /generate         — AI blueprint generation
    /stripe           — Stripe checkout + webhook
    /download/[projectId]/{txt,json,pdf} — File downloads
    /auth/logout      — Logout
/components
  /ui                 — Button, Card, Input, Textarea, Badge, Progress
  /marketing          — Navbar, Footer
/lib
  /supabase           — Client, server, middleware
  /stripe             — Client, server
  /ai                 — Blueprint generation
  /openai             — OpenAI client
  /email              — Email sender (mock/Resend)
  /utils              — cn() helper
/types               — TypeScript types
/supabase
  schema.sql          — Database tables
  policies.sql        — RLS policies
  triggers.sql        — Database triggers
```

## Features

- **Questionnaire** — 12-step guided form with progress bar, card selection, pill buttons
- **AI Generation** — OpenAI-powered blueprint with mock fallback for dev
- **Preview/Paywall** — Free preview with locked sections, blur effect
- **Stripe Payments** — Checkout for Blueprint Kit ($49) and Pro Prompt Kit ($99)
- **Dashboard** — Project cards with status badges, create new blueprint
- **Full Blueprint** — All sections with copy-to-clipboard for each prompt
- **Downloads** — TXT, JSON, and basic PDF export
- **Admin** — Stats: users, projects, revenue, recent activity
- **Auth** — Supabase auth with signup, login, forgot password

## Cloudways Deployment

1. Create new application on Cloudways (Node.js)
2. Connect GitHub repo
3. Add all environment variables
4. Set build command: `npm install && npm run build`
5. Set start command: `npm run start`
6. Deploy
7. Test: auth, questionnaire, generation, checkout, dashboard

## Stripe Webhook Setup

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select event: `checkout.session.completed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

## Testing

1. Homepage loads
2. User can start questionnaire
3. User can complete all steps
4. Form validates correctly
5. AI generation works (mock or OpenAI)
6. Preview page loads with locked sections
7. User can sign up / log in
8. Stripe checkout starts
9. Dashboard shows projects
10. Paid user can download files
11. Admin route is protected
12. Mobile layout works
13. Production build succeeds

## Notes

- Without `OPENAI_API_KEY`, the app generates a mock blueprint for development
- Without Stripe keys, checkout will fail gracefully
- Email sending is mocked (console.log) without Resend API key
- PDF download uses a minimal built-in PDF generator (no external deps)
