# Pixi

Pixel-tracking SaaS. Upload an image, get back a tracked version signed with
a cryptographic content credential, and monitor opens/forwards from a dashboard.

## Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS 4
- SQLite via Drizzle ORM (local `pixi.db`, swappable to Turso)
- Local filesystem storage at `./storage/images/` (swappable to R2)
- Auth.js v5 credentials provider + bcryptjs
- Resend for email
- Vitest + Playwright for tests

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
