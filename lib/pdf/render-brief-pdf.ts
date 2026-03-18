import type { BriefRecord } from '@/lib/types/brief';
import type { InternalBrief } from '@/lib/types/internal-brief';
import type { ProductionPrompt } from '@/lib/types/production-prompt';

export type BriefPdfField = {
  label: string;
  value: string;
};

export type BriefPdfSection = {
  title: string;
  fields?: BriefPdfField[];
  bullets?: string[];
};

export type BriefPdfContent = {
  title: string;
  subtitle: string;
  sections: BriefPdfSection[];
};

function valueOrFallback(value: string | null | undefined, fallback = 'Non renseigné') {
  const normalized = (value ?? '').trim();
  return normalized.length > 0 ? normalized : fallback;
}

function yesNo(value: boolean) {
  return value ? 'Oui' : 'Non';
}

function splitList(value: string, fallback: string) {
  const items = value
    .split(/[\n,;•]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : [fallback];
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC'
  }).format(date);
}

function formatMoney(amount: number | null, currency: string | null) {
  if (amount === null || !currency) {
    return 'Non payé';
  }

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(amount / 100);
}

function compact(values: Array<string | null | undefined>) {
  return values.map((value) => valueOrFallback(value, '')).filter(Boolean);
}

function summarizePrompt(prompt: ProductionPrompt) {
  return [
    ...prompt.mission.lines.slice(0, 2),
    ...prompt.recommendedStructure.lines.slice(0, 4).map((line) => line.replace(/^-\s*/, '')),
    ...prompt.technicalConstraints.qualityRules.slice(0, 3).map((rule) => `Contrainte: ${rule}`)
  ];
}

export function renderBriefPdfContent(params: {
  brief: BriefRecord;
  internalBrief: InternalBrief;
  productionPrompt: ProductionPrompt;
}): BriefPdfContent {
  const { brief, internalBrief, productionPrompt } = params;

  return {
    title: `Brief projet - ${valueOrFallback(brief.business.businessName, 'Projet')}`,
    subtitle: `Document interne • Généré le ${formatDate(new Date().toISOString())}`,
    sections: [
      {
        title: '1. En-tête',
        fields: [
          { label: 'Nom du projet', value: valueOrFallback(brief.business.businessName) },
          { label: 'ID brief', value: brief.id },
          { label: 'Créé le', value: formatDate(brief.createdAt) },
          { label: 'Statut', value: brief.status },
          {
            label: 'Paiement',
            value: `${brief.payment.paymentStatus} • ${formatMoney(brief.payment.amountTotal, brief.payment.currency)}`
          }
        ]
      },
      {
        title: '2. Informations client',
        fields: [
          { label: 'Nom complet', value: valueOrFallback(brief.customer.fullName) },
          { label: 'Email', value: valueOrFallback(brief.customer.email) },
          { label: 'Téléphone / WhatsApp', value: valueOrFallback(brief.customer.phoneOrWhatsapp) }
        ]
      },
      {
        title: '3. Activité',
        fields: [
          { label: 'Nom activité', value: valueOrFallback(brief.business.businessName) },
          { label: 'Type', value: valueOrFallback(brief.business.activityType) },
          { label: 'Description', value: valueOrFallback(brief.business.activityDescription) },
          { label: 'Cible', value: valueOrFallback(brief.business.targetAudience) },
          { label: 'Objectif principal', value: valueOrFallback(brief.business.mainGoal) }
        ]
      },
      {
        title: '4. Offre',
        fields: [
          { label: 'Offre principale', value: valueOrFallback(brief.offer.mainOffer) },
          { label: 'CTA principal', value: valueOrFallback(brief.offer.mainCTA) },
          { label: 'Prix affiché', value: valueOrFallback(brief.offer.showPrice) },
          { label: 'Services secondaires', value: splitList(brief.offer.secondaryServices, 'Aucun').join(' • ') }
        ]
      },
      {
        title: '5. Direction visuelle',
        fields: [
          { label: 'Style souhaité', value: valueOrFallback(brief.design.desiredStyle) },
          { label: 'Couleurs', value: valueOrFallback(brief.design.desiredColors) },
          {
            label: 'Inspirations',
            value: compact([brief.design.inspirationSite1, brief.design.inspirationSite2]).join(' • ') || 'Aucune'
          },
          { label: 'Logo disponible', value: yesNo(brief.design.hasLogo) },
          { label: 'Photos disponibles', value: yesNo(brief.design.hasPhotos) }
        ]
      },
      {
        title: '6. Contenu',
        fields: [
          { label: 'Titre principal', value: valueOrFallback(brief.content.heroTitle) },
          { label: 'Sous-titre', value: valueOrFallback(brief.content.subtitle) },
          { label: 'Arguments clés', value: splitList(brief.content.keyArguments, 'Aucun argument').join(' • ') },
          { label: 'FAQ', value: yesNo(brief.content.wantsFAQ) },
          { label: 'Témoignages', value: yesNo(brief.content.hasTestimonials) },
          {
            label: 'Infos obligatoires',
            value: splitList(brief.content.mandatoryInformation, 'Aucune information obligatoire').join(' • ')
          }
        ]
      },
      {
        title: '7. Contact public',
        fields: [
          { label: 'Email', value: valueOrFallback(brief.contact.publicEmail) },
          { label: 'Téléphone', value: valueOrFallback(brief.contact.publicPhone) },
          { label: 'WhatsApp', value: valueOrFallback(brief.contact.publicWhatsapp) },
          {
            label: 'Réseaux sociaux',
            value: compact([brief.contact.instagramUrl, brief.contact.facebookUrl, brief.contact.tiktokUrl]).join(' • ') || 'Aucun'
          },
          {
            label: 'Domaine',
            value: brief.contact.hasExistingDomain
              ? 'Domaine existant'
              : valueOrFallback(brief.contact.desiredDomain, 'Aucun domaine souhaité')
          }
        ]
      },
      {
        title: '8. Synthèse interne',
        fields: [
          {
            label: 'Résumé',
            value: `${internalBrief.summary.clientName} • ${internalBrief.summary.businessName} • ${internalBrief.summary.mainGoal}`
          },
          {
            label: 'Checklist de production',
            value: internalBrief.productionChecklist
              .map((item) => `${item.isReady ? 'OK' : 'À vérifier'}: ${item.label}`)
              .join(' • ')
          },
          { label: 'Warnings', value: internalBrief.warnings.join(' • ') || 'Aucun warning' },
          { label: 'Éléments manquants', value: internalBrief.missingElements.join(' • ') || 'Aucun' },
          { label: 'Sections recommandées', value: internalBrief.recommendedSections.join(' • ') || 'Non défini' }
        ]
      },
      {
        title: '9. Instructions de production (résumé)',
        bullets: summarizePrompt(productionPrompt)
      }
    ]
  };
}
