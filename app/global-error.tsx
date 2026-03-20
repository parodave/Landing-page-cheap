'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="max-w-lg space-y-3 text-center">
          <h1 className="text-2xl font-semibold">Une erreur inattendue est survenue</h1>
          <p className="text-sm text-muted">L’incident a été remonté automatiquement. Merci de réessayer.</p>
        </div>
      </body>
    </html>
  );
}
