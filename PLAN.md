# Pixi — Project Plan

## Milestone 1: Project Skeleton & CI

- [x] Next.js App Router + TypeScript scaffold
- [x] Vitest configured with first passing test
- [x] Playwright configured with first passing e2e test
- [x] ESLint + Prettier
- [x] GitHub Actions workflow (lint + test on push)

## Milestone 2: Database & Auth

- [ ] Turso (libSQL) schema: users, images, tracking_pixels
- [ ] Auth.js credentials provider (sign-up / sign-in / sign-out)
- [ ] Protected dashboard route (empty shell)
- [ ] Seed script for local dev

## Milestone 3: Image Upload & Pixel Injection

- [ ] Upload form (dashboard)
- [ ] Cloudflare R2 integration for storage
- [ ] Pixel injection into uploaded image metadata
- [ ] Unique tracking URL generation per image
- [ ] Image list view on dashboard

## Milestone 4: C2PA Content Credentials

- [ ] c2pa-node integration
- [ ] Sign image metadata on upload (who, when, via Pixi)
- [ ] Provenance chain: append signed manifest on each share/forward
- [ ] Verification endpoint: GET /verify/[id] — show provenance history
- [ ] Dashboard: display signing status and credential chain per image

## Milestone 5: Tracking Endpoint & Analytics

- [ ] GET /t/[id].png — serves 1x1 transparent pixel, logs open
- [ ] Record: IP, User-Agent, timestamp, referer
- [ ] Dashboard analytics: opens over time, unique vs. total
- [ ] Forward detection heuristic (same image, different IP)

## Milestone 6: Email Integration

- [ ] Resend SDK integration
- [ ] "Send tracked image via email" flow
- [ ] Email open tracking end-to-end

## Milestone 7: Polish & Deploy

- [ ] Landing page
- [ ] Error/loading states
- [ ] Rate limiting
- [ ] Production deploy on Vercel free tier
- [ ] README with setup instructions
