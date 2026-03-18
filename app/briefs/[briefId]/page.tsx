import { notFound } from 'next/navigation';
import { InternalBriefView } from '@/components/brief/internal-brief-view';
import { PageShell } from '@/components/shared/page-shell';
import { getBriefById } from '@/lib/briefs';
import { formatInternalBriefAsText, formatInternalBriefForReuse } from '@/lib/formatters/internal-brief';
import { mapBriefToInternalBrief } from '@/lib/mappers/brief-to-internal-brief';

type BriefPageProps = {
  params: {
    briefId: string;
  };
};

export default async function BriefPage({ params }: BriefPageProps) {
  const brief = await getBriefById(params.briefId);

  if (!brief) {
    notFound();
  }

  const internalBrief = mapBriefToInternalBrief(brief);
  const reusablePayload = formatInternalBriefForReuse(internalBrief);
  const internalBriefText = formatInternalBriefAsText(internalBrief);

  return (
    <PageShell
      title={`Brief interne #${brief.id}`}
      description="Version interne lisible et structurée du brief client, prête pour production et réutilisation future."
    >
      <InternalBriefView internalBrief={internalBrief} internalBriefText={`${internalBriefText}\n\n${JSON.stringify(reusablePayload, null, 2)}`} />
    </PageShell>
  );
}
