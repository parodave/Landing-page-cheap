'use client';

import { StepProps } from './types';

export function OfferStep({ data, onSectionChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="coreOffer" className="text-sm font-medium text-foreground">
          Offre principale
        </label>
        <input
          id="coreOffer"
          value={data.offer.coreOffer}
          onChange={(event) => onSectionChange('offer', 'coreOffer', event.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          placeholder="Ex. Création de landing page + maintenance"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="pricingRange" className="text-sm font-medium text-foreground">
          Gamme de prix
        </label>
        <input
          id="pricingRange"
          value={data.offer.pricingRange}
          onChange={(event) => onSectionChange('offer', 'pricingRange', event.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          placeholder="Ex. 500€ à 1500€"
        />
      </div>
    </div>
  );
}
