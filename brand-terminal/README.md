# Brand Terminal

Brand Terminal turns a GitHub profile into a living, terminal-inspired experience. Generate a terminal README, SVG header, and GitHub Action that keeps everything synced automatically.

## Features

- GitHub OAuth login powered by NextAuth/Auth.js
- Prisma/PostgreSQL models for profiles, subscriptions, and API keys
- Terminal and neon README/SVG templates with auto-branding controls
- GitHub sync utilities to fetch profile data and push README updates
- API endpoints for preview generation, remote sync, and API key issuance
- Dashboard UI for tagline tweaks, live previews, and copy-to-clipboard actions
- Stripe helper (stub) ready for paid plan upgrades

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- Prisma ORM + PostgreSQL
- NextAuth with GitHub provider
- Stripe SDK (test-mode ready)
- pnpm & Vercel-friendly deployment

## Quickstart

```bash
pnpm install
cp env/.env.example .env.local
# fill in GitHub OAuth, database, Stripe, and NextAuth secrets

pnpm prisma migrate dev --name init
pnpm dev
```

Open `http://localhost:3000` to view the landing page. Visit `/app` to sign in with GitHub and access the dashboard.

## Environment

Key variables live in `env/.env.example`:

- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- `DATABASE_URL` for your PostgreSQL instance
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PRICE_ID`

## Notes

- Run `pnpm prisma generate` whenever the `schema.prisma` changes.
- The `/api/sync` endpoint expects a `Bearer` token created via `/api/api-keys`.
- Stripe usage is optional today; `lib/stripe.ts` exposes a helper once keys are configured.
