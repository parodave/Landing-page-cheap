'use client';

import { StepProps } from './types';

export function DesignStep({ data, onSectionChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="visualDirection" className="text-sm font-medium text-foreground">
          Direction visuelle
        </label>
        <textarea
          id="visualDirection"
          value={data.design.visualDirection}
          onChange={(event) => onSectionChange('design', 'visualDirection', event.target.value)}
          className="min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          placeholder="Ex. Minimaliste premium, orienté conversion"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="inspirations" className="text-sm font-medium text-foreground">
          Inspirations / références
        </label>
        <textarea
          id="inspirations"
          value={data.design.inspirations}
          onChange={(event) => onSectionChange('design', 'inspirations', event.target.value)}
          className="min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          placeholder="Liens de sites, marques ou univers visuels"
        />
      </div>
    </div>
  );
}
