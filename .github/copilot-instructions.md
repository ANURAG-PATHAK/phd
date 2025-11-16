# Copilot Instructions for phd

These notes orient AI contributors so they can ship features fast without asking for basic context.

## Vision & Scope
- Build a fullstack, multi-tenant PhD Management System (Research X) with role dashboards for Scholar, Supervisor, Admin, and Developer personas plus public marketing pages.
- Prioritize Prisma + PostgreSQL for persistence, Shadcn UI for component library, and Next.js App Router for routing and server actions.
- Enforce RBAC across API routes and server components; every request must carry tenant + role context.

## Project Layout
- `app/` uses the Next.js App Router. Group tenant-aware routes under `app/(tenant)/[tenantSlug]/...` and public marketing under `app/(public)/...`.
- Co-locate server actions and data loaders in `app/**/actions.ts` files; prefer async server components for dashboard shells.
- Shared client-only widgets live in `components/`; use `shadcn add <component>` to scaffold (config lives in `components.json`).
- `lib/` houses cross-cutting helpers. Existing `lib/utils.ts` exposes `cn()` (Tailwind class merge) — reuse instead of duplicating class utilities.

## Data & Persistence
- Create `lib/db.ts` exporting a singleton Prisma client. Use schema-first modeling with multi-tenancy: add `tenantId` to every tenant-owned table and enforce unique constraints scoped by tenant.
- Model admissions pathway, scholarships, documents, communications, meeting logs, notifications, and audit trails explicitly — map the requirement doc before coding.
- Store file metadata in Postgres and binary blobs in S3-compatible storage; generate signed URLs in server actions.

## AuthN/Z
- Implement credential flow with NextAuth or custom email-first auth. Always hash passwords (argon2 preferred) and store refresh tokens securely.
- Encode role + tenant in JWT/session; add middleware in `middleware.ts` to guard protected routes and attach context to `request`. Include developer sandbox accounts seeded via Prisma migrations.

## Feature Pillars
- Dashboards must surface widget cards (deadlines, fees, pending approvals) per persona. Build reusable card components with loading skeletons.
- Admissions module tracks status pipeline (`Applied → Verified → FeePending → Enrolled`). Tailor required steps based on pathway (NET/JRF, GATE, etc.).
- Communication: implement messages + notifications tables; expose API routes for scholar↔supervisor threads and admin broadcasts.
- Document workflow: enforce state machine `Draft → Submitted → UnderReview → Approved/Rejected` with version history.
- Scholarship ledger: capture funding source, amounts, disbursement schedule, and uploaded proofs per scholar.

## Workflows & Tooling
- Dev server: `npm run dev`. Run linting with `npm run lint`; add Playwright/Cypress + Jest later per REQUIREMENTS doc.
- After editing Prisma schema run `npx prisma migrate dev --name <change>`; seed critical reference data via `prisma/seed.ts`.
- Use background jobs (BullMQ + Redis) for reminders/notifications; keep scheduling logic in `lib/jobs/`.

## UI & Theming
- Tailwind CSS and Shadcn is active. Use CSS variables for theme tokens and tenant branding; inject tenant theme data via layout loader.
- Favor composition over sprawling pages. Break dashboards into `app/(tenant)/[tenantSlug]/(routes)/dashboard/_components/*`.
- For charts use client components built with Recharts; lazy-load heavy visualizations.

Ping the maintainer if any requirement here conflicts with live code or is unclear.