# Landing Express 10€

Base technique Next.js 14+ pour un service de landing page simple orienté conversion.

## Démarrage

```bash
npm install
npm run dev
```

## Variables d'environnement (production / Vercel)

Configurer les variables suivantes dans Vercel Project Settings :

- `NEXT_PUBLIC_APP_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `INTERNAL_NOTIFICATION_EMAIL`
- `CUSTOMER_SUPPORT_EMAIL`
- `CUSTOMER_SUPPORT_WHATSAPP`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_DSN`
- `SENTRY_ORG` (optionnel, pour upload sourcemaps)
- `SENTRY_PROJECT` (optionnel, pour upload sourcemaps)

## Scripts

- `npm run dev` : serveur de développement
- `npm run build` : build de production
- `npm run start` : démarrage après build
- `npm run lint` : vérification ESLint
- `npm run type-check` : vérification TypeScript
