'use client';

import { FormData } from './types';

type SummaryStepProps = {
  data: FormData;
};

export function SummaryStep({ data }: SummaryStepProps) {
  return (
    <div className="space-y-4 text-sm text-muted">
      <p>Vérifiez les informations avant d&apos;envoyer le formulaire (soumission front-only).</p>
      <pre className="overflow-x-auto rounded-md border border-border bg-background p-4 text-xs text-foreground">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
