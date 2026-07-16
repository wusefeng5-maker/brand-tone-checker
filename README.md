# Brand Tone Checker

Brand Tone Checker is a SaaS MVP for checking whether draft copy matches a saved brand voice profile.

## Phase 1 Scope

This phase only sets up the foundation:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL datasource configuration
- Initial Prisma schema
- Environment variable template

Authentication, landing page content, brand profile CRUD, AI calls, quota logic, and reports are intentionally left for later phases.

## Getting Started

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
copy .env.example .env
```

Generate the Prisma client:

```bash
npm run prisma:generate
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful Commands

```bash
npm run lint
npm run build
npm run prisma:generate
```
