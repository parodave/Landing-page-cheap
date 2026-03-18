'use client';

import { StepProps } from './types';

export function ContentStep({ data, onSectionChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="availableAssets" className="text-sm font-medium text-foreground">
          Contenus déjà disponibles
        </label>
        <textarea
          id="availableAssets"
          value={data.content.availableAssets}
          onChange={(event) => onSectionChange('content', 'availableAssets', event.target.value)}
          className="min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          placeholder="Textes, photos, vidéos, témoignages..."
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="requiredPages" className="text-sm font-medium text-foreground">
          Sections / pages souhaitées
        </label>
        <textarea
          id="requiredPages"
          value={data.content.requiredPages}
          onChange={(event) => onSectionChange('content', 'requiredPages', event.target.value)}
          className="min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          placeholder="Ex. Hero, preuves sociales, FAQ, contact"
        />
      </div>
    </div>
  );
}
