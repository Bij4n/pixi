# Pixi — Project Plan

## Milestone 1: Project Skeleton & CI

- [x] Next.js App Router + TypeScript scaffold
- [x] Vitest configured with first passing test
- [x] Playwright configured with first passing e2e test
- [x] ESLint + Prettier
- [x] GitHub Actions workflow (lint + test on push)

## Milestone 2: Database & Auth

- [x] SQLite schema via Drizzle ORM (users, images, events)
- [x] Auth.js credentials provider (sign-up / sign-in / sign-out)
- [x] Protected dashboard route
- [ ] Seed script for local dev

## Milestone 3: Image Upload & Pixel Injection

- [x] Upload form (dashboard)
- [x] Local filesystem storage (swappable to R2 later)
- [x] Pixel injection into uploaded image
- [x] Unique tracking URL generation per image
- [x] Image list view on dashboard with thumbnails

## Milestone 4: C2PA Content Credentials

- [x] HMAC-SHA256 signing on upload (pragmatic C2PA-compatible trailer)
- [x] Verification endpoint: GET /verify/[slug] — shows provenance
- [x] Dashboard: signing status and recipient chain per image
- [ ] Migrate to official c2pa-node when native Rust dep risk is acceptable

## Milestone 5: Tracking Endpoint & Analytics

- [x] GET /t/[slug] — serves 1x1 transparent pixel, logs open
- [x] Records IP, User-Agent, timestamp, referer
- [x] Dashboard analytics: views, unique IPs, event log
- [x] Forward detection heuristic (recipient chain by IP grouping)
- [x] CSV export of image events

## Milestone 6: Email Integration

- [x] Resend SDK integration (gracefully degrades without API key)
- [x] "Send tracked image via email" flow from detail page

## Milestone 7: Polish & Deploy

- [x] Landing page
- [x] Privacy + Terms pages
- [x] Rate limiting (in-memory token bucket)
- [ ] Stripe billing
- [ ] Production database (Turso)
- [ ] Production storage (Cloudflare R2)
- [ ] Vercel deploy
- [ ] Email verification, 2FA, password reset
