# Pixi

Pixel-tracking SaaS. Upload an image, get back a tracked version,
monitor opens/forwards from a dashboard.

## Stack

- Next.js (App Router), TypeScript
- Turso (libSQL) for database
- Cloudflare R2 for image storage
- Resend for email
- Lucia or Auth.js (credentials) for auth
- Vitest + Playwright for tests
- Hosted on Vercel free tier

Any dependency that isn't free-tier friendly must be flagged before adding.

## Development Rules

- Test-driven development, always. Failing test → implementation → refactor.
- Small vertical slices. Each milestone must be independently demo-able.
- All tests must pass before committing.
- Work from PLAN.md. Check off milestones as they land.

## Commit & Repo Rules (STRICT)

- Conventional commits: feat:, fix:, test:, refactor:, chore:, docs:
- One logical change per commit. Keep them small and focused.
- Never include Co-Authored-By, "Generated with", robot emoji, or any
  reference to AI, Claude, Anthropic, assistants, or tooling used.
- No AI attribution anywhere in commits, PRs, code comments, README,
  or any file in the repo. The repo must read as solo human work.

## Before Making Changes

- If an architectural decision would meaningfully change cost or
  complexity, ask before proceeding.
- Otherwise, work autonomously within the current milestone.
