import { NextResponse } from 'next/server';
import { getBriefById } from '@/lib/briefs';
import { generateBriefPdf } from '@/lib/pdf/brief-pdf';
import { renderBriefPdfContent } from '@/lib/pdf/render-brief-pdf';
import { mapBriefToInternalBrief } from '@/lib/mappers/brief-to-internal-brief';
import { mapInternalBriefToProductionPrompt } from '@/lib/mappers/internal-brief-to-production-prompt';

export async function GET(_: Request, context: { params: { briefId: string } }) {
  const { briefId } = context.params;
  const brief = await getBriefById(briefId);

  if (!brief) {
    return NextResponse.json({ error: 'Brief introuvable' }, { status: 404 });
  }

  const internalBrief = mapBriefToInternalBrief(brief);
  const productionPrompt = mapInternalBriefToProductionPrompt(internalBrief);
  const content = renderBriefPdfContent({ brief, internalBrief, productionPrompt });
  const pdfBytes = await generateBriefPdf(content);
  const filename = `brief-${brief.id}.pdf`;

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'no-store'
    }
  });
}
