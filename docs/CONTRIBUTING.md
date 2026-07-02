# Contributing Guide

## Local checks

Before opening a pull request, run:

```bash
npm run env:validate
npm run lint
npm run type-check
npm run test:coverage
npm run build
```

## Code standards

- Use TypeScript for all new code.
- Keep UI, controllers, repositories, and services separated.
- Never expose API keys or secrets to client components.
- Add or update tests for security-sensitive, prompt, upload, and generation-flow changes.
- Keep comments useful and concise.

## Security expectations

- Validate all API inputs with Zod or equivalent strict checks.
- Sanitize user-generated names/descriptions.
- Enforce authenticated ownership for project and image data.
- Avoid logging sensitive user data.

## Branching

Use short descriptive branch names:

```text
feature/export-presets
fix/upload-validation
security/rate-limit-api
```
