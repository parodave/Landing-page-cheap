'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ProductionPromptViewProps = {
  briefId: string;
  promptText: string;
};

export function ProductionPromptView({ briefId, promptText }: ProductionPromptViewProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button href={`/briefs/${briefId}`} variant="ghost">
          Retour au brief interne
        </Button>
        <Button type="button" onClick={handleCopy}>
          {copied ? 'Copié ✅' : 'Copier le prompt'}
        </Button>
      </div>

      <Card className="space-y-3 bg-zinc-950 text-zinc-100">
        <h2 className="text-lg font-semibold text-zinc-100">Prompt de production prêt à copier</h2>
        <p className="text-sm text-zinc-300">
          Prompt déterministe basé sur le brief interne. Utilisable directement dans un agent de développement.
        </p>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-xs text-zinc-200">
          {promptText}
        </pre>
      </Card>
    </div>
  );
}
