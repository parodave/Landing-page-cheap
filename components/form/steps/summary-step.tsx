'use client';

import { ReviewSection } from '@/lib/types/form';
import { FormData, FormFilesData } from './types';

type SummaryStepProps = {
  data: FormData;
  files: FormFilesData;
};

export function SummaryStep({ data, files }: SummaryStepProps) {
  const logoSummary = files.logo.map((file) => file.name).join(', ');
  const photosSummary = files.photos.map((file) => file.name).join(', ');

  const sections: ReviewSection[] = [
    {
      key: 'identity',
      title: 'Identité',
      fields: [
        { label: 'Nom de marque', value: data.identity.brandName },
        { label: 'Raison sociale', value: data.identity.legalName },
        { label: 'Secteur', value: data.identity.industry },
        { label: 'Logo', value: logoSummary }
      ]
    },
    {
      key: 'business',
      title: 'Activité',
      fields: [
        { label: 'Audience cible', value: data.business.audience },
        { label: 'Objectif principal', value: data.business.businessGoal }
      ]
    },
    {
      key: 'offer',
      title: 'Offre',
      fields: [
        { label: 'Offre principale', value: data.offer.coreOffer },
        { label: 'Gamme de prix', value: data.offer.pricingRange }
      ]
    },
    {
      key: 'design',
      title: 'Design',
      fields: [
        { label: 'Direction visuelle', value: data.design.visualDirection },
        { label: 'Inspirations', value: data.design.inspirations },
        { label: 'Photos', value: photosSummary }
      ]
    },
    {
      key: 'content',
      title: 'Contenu',
      fields: [
        { label: 'Contenus disponibles', value: data.content.availableAssets },
        { label: 'Sections souhaitées', value: data.content.requiredPages }
      ]
    },
    {
      key: 'contact',
      title: 'Contact',
      fields: [
        { label: 'Email', value: data.contact.email },
        { label: 'WhatsApp', value: data.contact.whatsapp },
        { label: 'Délai souhaité', value: data.contact.desiredDeadline }
      ]
    }
  ];

  return (
    <div className="space-y-4 text-sm text-muted">
      <p>Vérifiez les informations avant d&apos;envoyer le formulaire (soumission front-only).</p>
      <div className="space-y-4">
        {sections.map((section) => (
          <section key={section.key} className="rounded-md border border-border bg-background p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">{section.title}</h3>
            <dl className="space-y-2">
              {section.fields.map((field) => (
                <div key={field.label} className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-3">
                  <dt className="text-xs uppercase tracking-wide text-muted">{field.label}</dt>
                  <dd className="sm:col-span-2 text-foreground">{field.value || '—'}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
