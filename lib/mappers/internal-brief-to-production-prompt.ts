import type { InternalBrief } from '@/lib/types/internal-brief';
import type { ProductionPrompt } from '@/lib/types/production-prompt';

function isFilled(value: string) {
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 && normalized !== 'non renseigné';
}

function joinOrFallback(values: string[], fallback: string) {
  return values.length > 0 ? values.join(' | ') : fallback;
}

function optionalList(items: string[], emptyLabel: string) {
  return items.length > 0 ? items : [emptyLabel];
}

export function mapInternalBriefToProductionPrompt(internalBrief: InternalBrief): ProductionPrompt {
  const hasFaq = internalBrief.contentBlock.hasFAQ;
  const hasTestimonials = internalBrief.contentBlock.hasTestimonials;

  return {
    briefId: internalBrief.briefId,
    generatedAt: new Date().toISOString(),
    context: {
      title: 'CONTEXTE',
      lines: [
        `Projet: Landing page pour ${internalBrief.summary.businessName}.`,
        'Nature de la demande: Transformer un brief interne en page commerciale one-page prête à publier.',
        `Objectif business: ${internalBrief.summary.mainGoal}.`
      ]
    },
    mission: {
      title: 'MISSION',
      lines: [
        'Créer une landing page 1 page, simple, professionnelle, responsive et rapide à mettre en ligne.',
        'Prioriser la clarté de l’offre, la crédibilité et la conversion.',
        `CTA principal attendu: ${internalBrief.recommendedCTA}.`
      ]
    },
    visualStyle: {
      title: 'STYLE VISUEL',
      lines: [
        `Style demandé: ${internalBrief.designBlock.desiredStyle}.`,
        `Couleurs souhaitées: ${internalBrief.designBlock.colors}.`,
        `Inspirations: ${joinOrFallback(internalBrief.designBlock.inspirations, 'Aucune inspiration fournie')}.`,
        `Niveau de sobriété: ${internalBrief.summary.completionLevel === 'high' ? 'élevé' : 'standard'}.`,
        'Ambiance générale: premium minimal, orientée confiance et lisibilité.'
      ]
    },
    clientContent: {
      title: 'CONTENU CLIENT',
      lines: [
        `Nom activité: ${internalBrief.summary.businessName}.`,
        `Titre principal: ${internalBrief.contentBlock.heroTitle}.`,
        `Sous-titre: ${internalBrief.contentBlock.subtitle}.`,
        `Arguments clés: ${joinOrFallback(internalBrief.contentBlock.keyArguments, 'Arguments non fournis')}.`,
        `Offre principale: ${internalBrief.offerBlock.mainOffer}.`,
        `CTA principal: ${internalBrief.offerBlock.primaryCTA}.`,
        `Services secondaires: ${joinOrFallback(internalBrief.offerBlock.secondaryServices, 'Aucun service secondaire fourni')}.`,
        `FAQ: ${hasFaq ? 'Disponible (prévoir une section FAQ).' : 'Non disponible (ne pas inventer de questions).'}`,
        `Témoignages: ${
          hasTestimonials
            ? 'Disponibles (prévoir une section preuve sociale).'
            : 'Non disponibles (prévoir placeholders sobres sans faux témoignages).'
        }`
      ]
    },
    contact: {
      title: 'CONTACT',
      lines: [
        `Email: ${internalBrief.customerBlock.email}.`,
        `Téléphone: ${internalBrief.customerBlock.phoneOrWhatsapp}.`,
        `WhatsApp: ${isFilled(internalBrief.customerBlock.phoneOrWhatsapp) ? internalBrief.customerBlock.phoneOrWhatsapp : 'Non renseigné'}.`,
        `Réseaux sociaux: ${joinOrFallback(internalBrief.contactBlock.socialLinks, 'Aucun réseau social public')}.`,
        `Domaine: ${internalBrief.contactBlock.domainStatus}.`
      ]
    },
    recommendedStructure: {
      title: 'STRUCTURE RECOMMANDÉE',
      lines: optionalList(internalBrief.recommendedSections, 'hero • bénéfices • offre • contact • CTA final').map(
        (section) => `- ${section}`
      )
    },
    technicalConstraints: {
      framework: 'Next.js 14+',
      language: 'TypeScript',
      router: 'App Router',
      styling: 'Tailwind CSS',
      visualDirection: 'Design premium minimal, mobile first.',
      qualityRules: [
        'Code propre et lisible',
        'Composants factorisés',
        'SEO minimal (title, description, hiérarchie Hn)',
        'Accessibilité de base (labels, contraste, focus visible)',
        'Pas de dépendances inutiles'
      ]
    },
    attentionPoints: {
      title: 'POINTS D\'ATTENTION',
      lines: optionalList(internalBrief.warnings, 'Aucun warning spécifique').concat(
        optionalList(
          internalBrief.missingElements.map((item) => `Élément manquant: ${item}`),
          'Aucun élément manquant détecté'
        )
      )
    },
    expectedDeliverable: {
      title: 'LIVRABLE ATTENDU',
      lines: [
        'Code complet de la landing page prêt à copier-coller.',
        'Sections clairement nommées dans le code.',
        'Rendu responsive cohérent visuellement sur mobile et desktop.',
        'Aucun texte inventé: respecter strictement les données client et signaler les trous.'
      ]
    },
    warnings: internalBrief.warnings,
    missingElements: internalBrief.missingElements
  };
}
