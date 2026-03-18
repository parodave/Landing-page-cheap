import { randomUUID } from 'node:crypto';
import type { BriefRecord } from '@/lib/types/brief';
import type { InternalBrief, InternalBriefChecklistItem, InternalBriefStatus } from '@/lib/types/internal-brief';

function normalizeText(value: string | null | undefined) {
  return (value ?? '').trim();
}

function splitList(value: string) {
  return value
    .split(/[\n,;•-]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasUsefulText(value: string, minLength = 3) {
  return normalizeText(value).length >= minLength;
}

function publicContacts(brief: BriefRecord) {
  const values = [brief.contact.publicEmail, brief.contact.publicPhone, brief.contact.publicWhatsapp]
    .map(normalizeText)
    .filter(Boolean);

  return Array.from(new Set(values));
}

function socialLinks(brief: BriefRecord) {
  return [brief.contact.instagramUrl, brief.contact.facebookUrl, brief.contact.tiktokUrl].map(normalizeText).filter(Boolean);
}

function buildRecommendedSections(brief: BriefRecord, hasContactInfo: boolean) {
  const sections = ['hero', 'bénéfices', 'offre'];

  if (brief.content.hasTestimonials) {
    sections.push('témoignages');
  }

  if (brief.content.wantsFAQ) {
    sections.push('FAQ');
  }

  if (hasContactInfo) {
    sections.push('contact');
  }

  sections.push('CTA final');

  return sections;
}

function buildWarningsAndMissingElements(brief: BriefRecord, hasContactInfo: boolean) {
  const warnings: string[] = [];
  const missingElements: string[] = [];

  if (!brief.design.hasLogo) {
    warnings.push('Pas de logo déclaré dans le brief.');
    missingElements.push('logo');
  }

  if (!brief.design.hasPhotos) {
    warnings.push('Pas de photos déclarées dans le brief.');
    missingElements.push('photos');
  }

  if (!hasUsefulText(brief.offer.mainCTA, 8)) {
    warnings.push('CTA principal trop vague ou absent.');
    missingElements.push('CTA précis');
  }

  if (!hasUsefulText(brief.content.heroTitle, 6)) {
    warnings.push('Titre principal faible ou absent.');
    missingElements.push('titre principal');
  }

  if (!hasUsefulText(brief.content.keyArguments, 20)) {
    warnings.push('Contenu argumentaire trop court pour une landing convaincante.');
    missingElements.push('arguments clés détaillés');
  }

  if (!hasContactInfo) {
    warnings.push('Aucun moyen de contact public exploitable.');
    missingElements.push('contact public');
  }

  const inspirations = [brief.design.inspirationSite1, brief.design.inspirationSite2].filter((item) => hasUsefulText(item));

  if (inspirations.length === 0) {
    warnings.push('Peu ou pas d’inspiration design fournie.');
    missingElements.push('inspirations design');
  }

  return {
    warnings,
    missingElements: Array.from(new Set(missingElements))
  };
}

function buildChecklist(brief: BriefRecord, hasContactInfo: boolean): InternalBriefChecklistItem[] {
  const heroReady = hasUsefulText(brief.content.heroTitle, 6) && hasUsefulText(brief.content.subtitle, 6);
  const ctaReady = hasUsefulText(brief.offer.mainCTA, 8);
  const contentReady = splitList(brief.content.keyArguments).length >= 3;
  const visualIdentityReady = brief.design.hasLogo || hasUsefulText(brief.design.desiredColors, 3);
  const assetsReady = brief.assets.logoFileNames.length > 0 || brief.assets.photoFileNames.length > 0;

  return [
    {
      label: 'Hero prêt',
      isReady: heroReady,
      note: heroReady ? 'Titre + sous-titre disponibles.' : 'Compléter un titre et un sous-titre orientés bénéfice.'
    },
    {
      label: 'CTA prêt',
      isReady: ctaReady,
      note: ctaReady ? 'CTA principal actionnable.' : 'Ajouter un CTA concret (ex: Réserver un appel).'
    },
    {
      label: 'Contenu suffisant',
      isReady: contentReady,
      note: contentReady ? 'Arguments clés exploitables.' : 'Ajouter au moins 3 arguments orientés valeur.'
    },
    {
      label: 'Contact public suffisant',
      isReady: hasContactInfo,
      note: hasContactInfo ? 'Un moyen de contact est publiable.' : 'Ajouter email, téléphone ou WhatsApp public.'
    },
    {
      label: 'Identité visuelle suffisante',
      isReady: visualIdentityReady,
      note: visualIdentityReady ? 'Base visuelle disponible.' : 'Préciser couleurs et/ou fournir un logo.'
    },
    {
      label: 'Assets présents',
      isReady: assetsReady,
      note: assetsReady ? 'Des fichiers sont déjà fournis.' : 'Prévoir logo et photos pour accélérer la prod.'
    }
  ];
}

function resolveCompletionLevel(checklist: InternalBriefChecklistItem[]) {
  const readyCount = checklist.filter((item) => item.isReady).length;

  if (readyCount >= 5) {
    return 'high' as const;
  }

  if (readyCount >= 3) {
    return 'medium' as const;
  }

  return 'low' as const;
}

function resolveInternalStatus(missingElements: string[]): InternalBriefStatus {
  if (missingElements.length === 0) {
    return 'ready';
  }

  if (missingElements.length <= 3) {
    return 'needs_review';
  }

  return 'incomplete';
}

export function mapBriefToInternalBrief(brief: BriefRecord): InternalBrief {
  const contacts = publicContacts(brief);
  const socials = socialLinks(brief);
  const hasContactInfo = contacts.length > 0;
  const checklist = buildChecklist(brief, hasContactInfo);
  const completionLevel = resolveCompletionLevel(checklist);
  const { warnings, missingElements } = buildWarningsAndMissingElements(brief, hasContactInfo);
  const recommendedSections = buildRecommendedSections(brief, hasContactInfo);

  return {
    id: randomUUID(),
    briefId: brief.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: resolveInternalStatus(missingElements),
    summary: {
      clientName: normalizeText(brief.customer.fullName) || 'Client non renseigné',
      businessName: normalizeText(brief.business.businessName) || 'Activité non renseignée',
      activityType: normalizeText(brief.business.activityType) || 'Type d’activité non renseigné',
      mainGoal: normalizeText(brief.business.mainGoal) || 'Objectif principal non renseigné',
      paymentStatus: brief.payment.paymentStatus,
      completionLevel
    },
    customerBlock: {
      identity: normalizeText(brief.customer.fullName) || 'Non renseigné',
      email: normalizeText(brief.customer.email) || 'Non renseigné',
      phoneOrWhatsapp: normalizeText(brief.customer.phoneOrWhatsapp) || 'Non renseigné'
    },
    businessBlock: {
      activity: normalizeText(brief.business.activityDescription) || normalizeText(brief.business.activityType) || 'Non renseigné',
      targetAudience: normalizeText(brief.business.targetAudience) || 'Non renseigné',
      promiseOrObjective: normalizeText(brief.business.mainGoal) || 'Non renseigné'
    },
    offerBlock: {
      mainOffer: normalizeText(brief.offer.mainOffer) || 'Non renseigné',
      primaryCTA: normalizeText(brief.offer.mainCTA) || 'Non renseigné',
      showPrice: normalizeText(brief.offer.showPrice) || 'Non renseigné',
      secondaryServices: splitList(brief.offer.secondaryServices)
    },
    designBlock: {
      desiredStyle: normalizeText(brief.design.desiredStyle) || 'Non renseigné',
      colors: normalizeText(brief.design.desiredColors) || 'Non renseigné',
      inspirations: [brief.design.inspirationSite1, brief.design.inspirationSite2].map(normalizeText).filter(Boolean),
      hasLogo: brief.design.hasLogo,
      hasPhotos: brief.design.hasPhotos
    },
    contentBlock: {
      heroTitle: normalizeText(brief.content.heroTitle) || 'Non renseigné',
      subtitle: normalizeText(brief.content.subtitle) || 'Non renseigné',
      keyArguments: splitList(brief.content.keyArguments),
      hasFAQ: brief.content.wantsFAQ,
      hasTestimonials: brief.content.hasTestimonials,
      mandatoryInformation: splitList(brief.content.mandatoryInformation)
    },
    contactBlock: {
      publicContacts: contacts,
      socialLinks: socials,
      domainStatus: brief.contact.hasExistingDomain
        ? 'Domaine existant'
        : hasUsefulText(brief.contact.desiredDomain)
          ? `Domaine souhaité : ${brief.contact.desiredDomain.trim()}`
          : 'Domaine non défini'
    },
    assetsBlock: {
      logoFileNames: brief.assets.logoFileNames,
      photoFileNames: brief.assets.photoFileNames,
      resourcesStatus:
        brief.assets.logoFileNames.length > 0 || brief.assets.photoFileNames.length > 0
          ? 'Ressources disponibles'
          : 'Ressources non fournies'
    },
    productionChecklist: checklist,
    warnings,
    missingElements,
    recommendedCTA: normalizeText(brief.offer.mainCTA) || 'Prendre contact maintenant',
    recommendedSections
  };
}
