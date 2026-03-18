'use client';

import { StepProps } from './types';

export function ContactDeliveryStep({ data, onSectionChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email de contact
        </label>
        <input
          id="email"
          type="email"
          value={data.contactDelivery.email}
          onChange={(event) => onSectionChange('contactDelivery', 'email', event.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          placeholder="vous@entreprise.com"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="whatsapp" className="text-sm font-medium text-foreground">
          Numéro WhatsApp
        </label>
        <input
          id="whatsapp"
          value={data.contactDelivery.whatsapp}
          onChange={(event) => onSectionChange('contactDelivery', 'whatsapp', event.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          placeholder="+33 ..."
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="desiredDeadline" className="text-sm font-medium text-foreground">
          Délai de livraison souhaité
        </label>
        <input
          id="desiredDeadline"
          type="date"
          value={data.contactDelivery.desiredDeadline}
          onChange={(event) => onSectionChange('contactDelivery', 'desiredDeadline', event.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
      </div>
    </div>
  );
}
