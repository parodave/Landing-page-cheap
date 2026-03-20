import type { Metadata } from 'next';
import { FormShell } from '@/components/form/form-shell';
import { PageShell } from '@/components/shared/page-shell';
import { FormOpenTracker } from './form-open-tracker';

export const metadata: Metadata = {
  title: 'Formulaire client',
  description: 'Complétez le formulaire multi-étapes pour lancer votre landing page en production.',
  alternates: {
    canonical: '/formulaire'
  },
  openGraph: {
    title: 'Formulaire client',
    description: 'Complétez le formulaire multi-étapes pour lancer votre landing page en production.',
    url: '/formulaire'
  }
};

export default function FormulairePage() {
  return (
    <PageShell
      title="Formulaire client"
      description="Complétez chaque étape pour partager vos besoins et générer une page adaptée à votre activité."
    >
      <FormOpenTracker />
      <FormShell />
    </PageShell>
  );
}
