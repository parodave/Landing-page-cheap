import type { InternalBrief } from '@/lib/types/internal-brief';

function formatList(items: string[], fallback = 'Non renseigné') {
  if (items.length === 0) {
    return fallback;
  }

  return items.join(' • ');
}

export function formatInternalBriefAsText(internalBrief: InternalBrief) {
  return [
    `Résumé: ${internalBrief.summary.clientName} | ${internalBrief.summary.businessName}`,
    `Objectif: ${internalBrief.summary.mainGoal}`,
    `Statut: ${internalBrief.status} (${internalBrief.summary.completionLevel})`,
    `CTA recommandé: ${internalBrief.recommendedCTA}`,
    `Sections recommandées: ${formatList(internalBrief.recommendedSections)}`,
    `Warnings: ${formatList(internalBrief.warnings, 'Aucun warning')}`,
    `Manquants: ${formatList(internalBrief.missingElements, 'Aucun élément manquant')}`
  ].join('\n');
}

export function formatInternalBriefForReuse(internalBrief: InternalBrief) {
  return {
    metadata: {
      id: internalBrief.id,
      briefId: internalBrief.briefId,
      status: internalBrief.status,
      createdAt: internalBrief.createdAt,
      updatedAt: internalBrief.updatedAt
    },
    summary: internalBrief.summary,
    blocks: {
      customer: internalBrief.customerBlock,
      business: internalBrief.businessBlock,
      offer: internalBrief.offerBlock,
      design: internalBrief.designBlock,
      content: internalBrief.contentBlock,
      contact: internalBrief.contactBlock,
      assets: internalBrief.assetsBlock
    },
    production: {
      checklist: internalBrief.productionChecklist,
      warnings: internalBrief.warnings,
      missingElements: internalBrief.missingElements,
      recommendedCTA: internalBrief.recommendedCTA,
      recommendedSections: internalBrief.recommendedSections
    },
    text: formatInternalBriefAsText(internalBrief)
  };
}
