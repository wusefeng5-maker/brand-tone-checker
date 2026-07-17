# Brand Tone Checker

Brand Tone Checker is the internal project name for 对味（Duìwèi AI）, a SaaS MVP that checks whether draft copy matches a saved brand voice profile before publishing.

## Current Version

Release Candidate 1.

Included scope:

- Public marketing landing page
- Clerk authentication
- Protected app shell
- Brand profile CRUD
- AI tone check MVP
- Saved check history and detail pages
- Read-only admin overview, users, and AI logs
- Prompt template abstraction
- Loading, skeleton, empty, and error states

## Architecture

- Next.js App Router
- TypeScript
- Tailwind CSS
- Clerk for authentication
- PostgreSQL with Prisma ORM
- OpenAI-compatible AI provider abstraction
- Vercel-ready deployment

The AI provider is selected through configuration. Business logic calls the provider abstraction and does not bind directly to a specific model vendor.

## Environment Variables

Create `.env` from `.env.example` and fill in the required values manually.

Required:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/dashboard"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/dashboard"

ADMIN_EMAILS="admin@example.com"

AI_PROVIDER="openai-compatible"
OPENAI_COMPATIBLE_BASE_URL="https://api.openai.com/v1"
OPENAI_COMPATIBLE_API_KEY=""
OPENAI_COMPATIBLE_MODEL="gpt-5.5"
```

Do not commit real API keys or secrets.

## Local Setup

Install dependencies:

```bash
pnpm install
```

Generate Prisma Client:

```bash
pnpm prisma:generate
```

Run database migrations:

```bash
pnpm prisma:migrate
```

Start the development server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Quality Checks

Run lint:

```bash
pnpm lint
```

Run all tests:

```bash
pnpm test
```

Run a production build:

```bash
pnpm build
```

## Deployment

1. Configure the same environment variables in Vercel.
2. Point `DATABASE_URL` to the production PostgreSQL database.
3. Run Prisma migrations against production using the deployment workflow.
4. Deploy the Next.js app on Vercel.
5. Verify `/`, `/sign-in`, `/dashboard`, `/profiles`, `/check`, `/checks`, and `/admin`.

## Notes

- Stripe/payment is not part of the current MVP.
- Supabase may be used as Postgres only; Supabase Auth and RLS are not required by this app.
- Admin access is controlled by `ADMIN_EMAILS`.
