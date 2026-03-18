import { notFound } from 'next/navigation';
import { ProductionPromptView } from '@/components/brief/production-prompt-view';
import { PageShell } from '@/components/shared/page-shell';
import { getBriefById } from '@/lib/briefs';
import { formatProductionPromptAsText } from '@/lib/formatters/production-prompt';
import { mapBriefToInternalBrief } from '@/lib/mappers/brief-to-internal-brief';
import { mapInternalBriefToProductionPrompt } from '@/lib/mappers/internal-brief-to-production-prompt';

type BriefPromptPageProps = {
  params: {
    briefId: string;
  };
};

export default async function BriefPromptPage({ params }: BriefPromptPageProps) {
  const brief = await getBriefById(params.briefId);

  if (!brief) {
    notFound();
  }

  const internalBrief = mapBriefToInternalBrief(brief);
  const productionPrompt = mapInternalBriefToProductionPrompt(internalBrief);
  const productionPromptText = formatProductionPromptAsText(productionPrompt);

  return (
    <PageShell
      title={`Prompt de production #${brief.id}`}
      description="Version texte structurée et déterministe pour générer rapidement la landing page du client."
    >
      <ProductionPromptView briefId={brief.id} promptText={productionPromptText} />
    </PageShell>
  );
}
