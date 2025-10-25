# Next.js Starter

Next.js starter with auth and database pre-configured.

## Setup

```bash
pnpm install
cp .env.example .env.local
# Add your credentials to .env.local
pnpm db:push
pnpm dev
```

## Stack

- Next.js 16 + TypeScript
- PostgreSQL (Neon) + Drizzle ORM
- Better Auth (email/password)
- Tailwind CSS + shadcn/ui

## Scripts

- `pnpm dev` - Start dev server
- `pnpm build` - Build for production
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open database GUI

## Auth

**Client:** `import { useSession, signIn, signOut } from '@/lib/auth/client'`

**Server:** `import { getSession, requireAuth } from '@/lib/auth/server'`

## Routes

- `/login` `/signup` - Auth pages
- `/dashboard` - Protected example
