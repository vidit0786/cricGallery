# Troubleshooting

## Build fails because Prisma client is missing

Run:

```bash
npm run db:generate
```

## App cannot sign users in

Check:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- Google OAuth callback URL
- Database connectivity

## AI generation fails

Check:

- `OPENAI_API_KEY`
- Image is JPG, PNG, or WEBP for generation
- Upload is smaller than 15 MB
- API rate limits
- `/api/health`

## Docker app cannot connect to database

Use the compose service hostname:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/cricket_ai_studio?schema=public
```

## CSP blocks a resource

Review `next.config.ts`. Only add trusted domains and avoid weakening CSP unless required by the deployment provider.
