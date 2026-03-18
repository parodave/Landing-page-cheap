import { FormShell } from '@/components/form/form-shell';
import { PageShell } from '@/components/shared/page-shell';

export default function FormulairePage() {
  return (
    <PageShell
      title="Formulaire client"
      description="Partagez vos besoins en 7 étapes pour cadrer rapidement votre landing page."
    >
      <FormShell />
    </PageShell>
  );
}
