# Pixi

Pixi embeds an invisible tracking pixel into any image you share and signs it
with a cryptographic content credential, so you can see who opened it, catch
when it gets forwarded, and prove it hasn't been altered — long after it left
your hands. Because sending something shouldn't mean going blind.

## What it does

- Embeds an invisible tracking pixel into any image you upload
- Signs the image with an HMAC-based content credential trailer
- Generates a tracked link (`/t/:slug`) that logs every view
- Detects forwarding by grouping views by IP address
- Lets you email tracked images via Resend
- Verifies image authenticity at `/verify/:slug` for anyone to check

## Stack

- Next.js 16 App Router + TypeScript
- SQLite via Drizzle ORM (swappable to Turso)
- Local filesystem storage (swappable to R2)
- Auth.js v5 with credentials provider + bcrypt
- Resend for email
- Tailwind CSS 4
- Vitest + Playwright for tests

## Run it locally

```bash
# 1. Install dependencies
npm install

# 2. Copy the example env file and fill in secrets
cp .env.example .env.local
# Generate an AUTH_SECRET:
openssl rand -base64 32
# Paste it into .env.local. RESEND_API_KEY is optional (email flow
# gracefully degrades without it).

# 3. Push the schema to a local SQLite database
npx drizzle-kit push

# 4. Start the dev server
npm run dev -- --port 3100
```

Open http://localhost:3100 and click "Try it free" to create an account.

## Core user flow

1. Sign up (email + password, at least 8 chars)
2. Upload an image from `/dashboard/upload` (PNG/JPEG/GIF/WebP, 10MB max)
3. Copy the tracked URL from the image detail page
4. Send that URL to anyone — email, social, docs — and every open is logged
5. Check `/dashboard/images/:id` to see the recipient chain, forward count,
   and recent views

## Tests

```bash
npm test            # Vitest unit tests
npm run test:e2e    # Playwright e2e tests
npm run lint        # ESLint
npm run format      # Prettier
```

## Project layout

```
src/
├── app/
│   ├── page.tsx               # Landing page
│   ├── login/, signup/        # Auth forms
│   ├── privacy/, terms/       # Legal pages
│   ├── dashboard/             # Protected app routes
│   │   ├── page.tsx           # Image list
│   │   ├── upload/            # Upload form
│   │   ├── images/[id]/       # Detail + send
│   │   └── settings/          # Profile + change password
│   ├── verify/[slug]/         # Public C2PA verification
│   ├── t/[slug]/              # Tracking pixel endpoint
│   └── api/                   # Route handlers
├── db/
│   ├── schema.ts              # Drizzle schema (users, images, events)
│   └── client.ts              # SQLite connection
├── lib/
│   ├── auth.ts                # Auth.js config
│   ├── c2pa.ts                # Content signing + verification
│   ├── storage.ts              # File storage abstraction
│   ├── tracking.ts             # Slug gen + event logging
│   ├── rate-limit.ts           # In-memory token bucket
│   ├── forward-detection.ts    # Recipient chain analysis
│   └── email.ts                # Resend wrapper
├── proxy.ts                    # Protects /dashboard routes
└── __tests__/                  # Vitest unit tests

e2e/                            # Playwright end-to-end tests
storage/images/                 # Uploaded files (gitignored)
pixi.db                         # SQLite database (gitignored)
```

## Known limitations

This is a local-first MVP. Before it can be deployed or take payments:

- Stripe billing is not wired up
- Storage is on local disk (won't survive a deploy without R2 or similar)
- Database is a single SQLite file (swap to Turso for production)
- C2PA credentials use an HMAC-signed trailer, not the official C2PA
  standard (compatible `c2pa-node` has native Rust deps and was skipped for
  now — the round-trip verify still works end-to-end)
- No email verification, 2FA, or password reset
- Rate limiting is in-memory and won't work across multiple instances

## License

Private.
