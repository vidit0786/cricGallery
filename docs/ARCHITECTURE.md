# Architecture Overview

Cricket AI Studio uses a modular Next.js architecture.

## Layers

```text
app/                 Next.js App Router pages and API routes
components/          Client and server UI components
config/              Runtime environment validation
lib/                 Shared domain constants and helpers
server/auth/         NextAuth configuration and session guards
server/controllers/  Request orchestration and validation
server/repositories/ Prisma data access with user ownership enforcement
server/security/     Rate limiting and request guards
server/observability Structured logging and provider-agnostic monitoring
services/            AI, prompt, image experience, export, queue, and quality services
utils/               Cross-cutting utilities
tests/               Unit, integration, and smoke/e2e tests
```

## Generation flow

```text
Authenticated request
→ same-origin check
→ rate limit
→ project ownership validation
→ file validation and MIME sniffing
→ image analysis with retry
→ prompt engine
→ generation queue
→ image generation with retry
→ quality score
→ save generated image
→ structured response
```

## Security model

- User routes require authenticated sessions.
- API routes use `requireUser()` where user data is accessed.
- Repository queries include `userId` ownership checks.
- Mutating routes enforce same-origin checks.
- Uploads are size-limited and MIME-sniffed.
- Secrets are read only server-side.
- Security headers and CSP are configured in `next.config.ts`.
