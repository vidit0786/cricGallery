# Cricket AI Studio Deployment Guide

## Required production services

- Node.js 20 runtime
- PostgreSQL 16+
- OpenAI API key
- Google OAuth application
- HTTPS-enabled deployment platform

## Required environment variables

```env
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.example
NEXTAUTH_SECRET=<long random secret>
DATABASE_URL=postgresql://user:password@host:5432/cricket_ai_studio?schema=public
GOOGLE_CLIENT_ID=<google oauth client id>
GOOGLE_CLIENT_SECRET=<google oauth client secret>
OPENAI_API_KEY=<openai api key>
```

Optional:

```env
OPENAI_VISION_MODEL=gpt-4o-mini
OPENAI_IMAGE_MODEL=gpt-image-1
OPENAI_IMAGE_SIZE=1024x1024
OPENAI_IMAGE_QUALITY=auto
AI_REQUEST_TIMEOUT_MS=120000
```

## Deployment steps

1. Provision PostgreSQL.
2. Configure environment variables.
3. Install dependencies with `npm ci`.
4. Generate Prisma client with `npm run db:generate`.
5. Run migrations with `npm run db:migrate` or `npx prisma migrate deploy` in production.
6. Run `npm run build`.
7. Start with `npm run start` or deploy the standalone Docker image.

## Docker

```bash
docker compose up --build
```

For production, replace default secrets and use a managed PostgreSQL database.

## Health check

```text
GET /api/health
```

Returns service status and environment validation state.
