import { FormShell } from '@/components/form/form-shell';
import { PageShell } from '@/components/shared/page-shell';

export default function FormulairePage() {
  return (
    <PageShell
      title="Formulaire client"
      description="Complétez chaque étape pour partager vos besoins et générer une page adaptée à votre activité."
    >
      <FormShell />
    </PageShell>
  );
}
