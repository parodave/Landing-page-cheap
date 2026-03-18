'use client';

import { Button } from '@/components/ui/button';
import { ClientFormData, FormStepKey } from '@/lib/types/form';

type ReviewValue = string | string[] | boolean | null | undefined;

type ReviewField = {
  label: string;
  value: ReviewValue;
  optional?: boolean;
};

type ReviewSection = {
  step: Exclude<FormStepKey, 'review'>;
  title: string;
  fields: ReviewField[];
};

type ReviewStepProps = {
  data: ClientFormData;
  onEditSection: (step: FormStepKey) => void;
};

const EMPTY_VALUE_LABEL = 'Non renseigné';

function formatReviewValue(value: ReviewValue, optional = false) {
  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return optional ? 'Optionnel — non renseigné' : EMPTY_VALUE_LABEL;
    }

    return value.join(', ');
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      return optional ? 'Optionnel — non renseigné' : EMPTY_VALUE_LABEL;
    }

    return trimmedValue;
  }

  return optional ? 'Optionnel — non renseigné' : EMPTY_VALUE_LABEL;
}

export function ReviewStep({ data, onEditSection }: ReviewStepProps) {
  const sections: ReviewSection[] = [
    {
      step: 'identity',
      title: 'Identité',
      fields: [
        { label: 'Nom de marque', value: data.identity.brandName },
        { label: 'Raison sociale', value: data.identity.legalName, optional: true },
        { label: 'Secteur', value: data.identity.industry }
      ]
    },
    {
      step: 'business',
      title: 'Activité',
      fields: [
        { label: 'Audience cible', value: data.business.audience },
        { label: 'Objectif principal', value: data.business.businessGoal }
      ]
    },
    {
      step: 'offer',
      title: 'Offre',
      fields: [
        { label: 'Offre principale', value: data.offer.coreOffer },
        { label: 'Gamme de prix', value: data.offer.pricingRange, optional: true }
      ]
    },
    {
      step: 'design',
      title: 'Design',
      fields: [
        { label: 'Direction visuelle', value: data.design.visualDirection },
        { label: 'Inspirations', value: data.design.inspirations, optional: true }
      ]
    },
    {
      step: 'content',
      title: 'Contenu',
      fields: [
        { label: 'Contenus disponibles', value: data.content.availableAssets, optional: true },
        { label: 'Sections souhaitées', value: data.content.requiredPages }
      ]
    },
    {
      step: 'contact',
      title: 'Contact & livraison',
      fields: [
        { label: 'Email', value: data.contact.email },
        { label: 'WhatsApp', value: data.contact.whatsapp, optional: true },
        { label: 'Délai souhaité', value: data.contact.desiredDeadline, optional: true }
      ]
    }
  ];

  return (
    <div className="space-y-4 text-sm text-muted">
      <p>Relisez vos réponses et modifiez une section si nécessaire avant validation.</p>

      <div className="space-y-4">
        {sections.map((section) => (
          <section key={section.step} className="rounded-md border border-border bg-background p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              <Button
                type="button"
                variant="ghost"
                className="h-9 px-3 text-xs"
                onClick={() => onEditSection(section.step)}
              >
                Modifier
              </Button>
            </div>

            <dl className="space-y-2">
              {section.fields.map((field) => (
                <div key={field.label} className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-3">
                  <dt className="text-xs uppercase tracking-wide text-muted">{field.label}</dt>
                  <dd className="sm:col-span-2 text-foreground">
                    {formatReviewValue(field.value, field.optional)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
