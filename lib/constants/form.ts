import { FormStepKey } from '@/lib/types/form';

type FieldOption = {
  value: string;
  label: string;
  description?: string;
};

type FormStepUxDefinition = {
  key: FormStepKey;
  label: string;
  description: string;
};

export const FORM_STEPS: FormStepUxDefinition[] = [
  {
    key: 'identity',
    label: 'Identité',
    description: 'Présentez votre marque pour cadrer le ton et la proposition de valeur.'
  },
  {
    key: 'business',
    label: 'Activité',
    description: 'Décrivez votre activité et votre audience pour un message orienté conversion.'
  },
  {
    key: 'offer',
    label: 'Offre',
    description: 'Précisez l’offre à vendre et le résultat attendu pour vos prospects.'
  },
  {
    key: 'design',
    label: 'Design',
    description: 'Choisissez un style visuel cohérent avec votre image de marque.'
  },
  {
    key: 'content',
    label: 'Contenu',
    description: 'Indiquez les contenus existants et les sections à produire.'
  },
  {
    key: 'contact',
    label: 'Contact / livraison',
    description: 'Partagez les coordonnées utiles et les contraintes de délai.'
  },
  {
    key: 'review',
    label: 'Récapitulatif',
    description: 'Validez chaque réponse avant envoi pour éviter les retours.'
  }
];

export const BUSINESS_TYPES: FieldOption[] = [
  {
    value: 'freelance',
    label: 'Freelance / Solopreneur',
    description: 'Consultant, coach, expert indépendant.'
  },
  {
    value: 'agency',
    label: 'Agence / Studio',
    description: 'Équipe de services marketing, design ou développement.'
  },
  {
    value: 'ecommerce',
    label: 'E-commerce',
    description: 'Vente de produits physiques ou digitaux en ligne.'
  },
  {
    value: 'local_business',
    label: 'Commerce local',
    description: 'Restaurant, salon, cabinet, boutique de proximité.'
  },
  {
    value: 'saas',
    label: 'SaaS / Produit tech',
    description: 'Outil logiciel par abonnement ou application web.'
  },
  {
    value: 'association',
    label: 'Association / ONG',
    description: 'Organisation à mission sociale ou communautaire.'
  }
];

export const PAGE_GOALS: FieldOption[] = [
  {
    value: 'book_call',
    label: 'Obtenir des rendez-vous',
    description: 'Faire réserver un appel découverte.'
  },
  {
    value: 'generate_leads',
    label: 'Collecter des leads',
    description: 'Récupérer des emails qualifiés via formulaire.'
  },
  {
    value: 'sell_offer',
    label: 'Vendre une offre',
    description: 'Transformer le trafic en achats ou inscriptions.'
  },
  {
    value: 'present_service',
    label: 'Présenter un service',
    description: 'Expliquer clairement ce que vous faites.'
  },
  {
    value: 'prequalify',
    label: 'Préqualifier les prospects',
    description: 'Attirer les bons clients et filtrer le reste.'
  }
];

export const DESIGN_STYLES: FieldOption[] = [
  { value: 'minimal', label: 'Minimal', description: 'Simple, épuré, centré sur l’essentiel.' },
  { value: 'premium', label: 'Premium', description: 'Haut de gamme, élégant, rassurant.' },
  { value: 'bold', label: 'Audacieux', description: 'Contrastes marqués, impact visuel fort.' },
  { value: 'friendly', label: 'Chaleureux', description: 'Accessible, humain, ton conversationnel.' },
  { value: 'corporate', label: 'Corporate', description: 'Professionnel, structuré, institutionnel.' }
];

export const CTA_OPTIONS: FieldOption[] = [
  { value: 'book_call', label: 'Réserver un appel' },
  { value: 'request_quote', label: 'Demander un devis' },
  { value: 'contact_whatsapp', label: 'Contacter sur WhatsApp' },
  { value: 'buy_now', label: 'Acheter maintenant' },
  { value: 'download_guide', label: 'Télécharger le guide' },
  { value: 'join_waitlist', label: 'Rejoindre la liste d’attente' }
];

export const YES_NO_OPTIONS: FieldOption[] = [
  { value: 'yes', label: 'Oui' },
  { value: 'no', label: 'Non' }
];

export const SUMMARY_SECTION_LABELS: Record<Exclude<FormStepKey, 'review'>, string> = {
  identity: 'Identité de marque',
  business: 'Activité & objectifs',
  offer: 'Offre commerciale',
  design: 'Préférences design',
  content: 'Contenu à intégrer',
  contact: 'Coordonnées & livraison'
};

export const FORM_UX_HINTS = {
  brandNamePlaceholder: 'Ex: Atelier Nova',
  legalNamePlaceholder: 'Ex: NOVA STUDIO SAS',
  industryPlaceholder: 'Ex: Coaching carrière, Restaurant italien, SaaS RH',
  audiencePlaceholder:
    'Qui voulez-vous convaincre ? Ex: dirigeants de PME, jeunes parents, e-commerçants',
  coreOfferPlaceholder: 'Ex: Audit SEO en 5 jours, Menu dégustation, Formation IA débutant',
  pricingRangePlaceholder: 'Ex: 300€ - 900€ ou “à partir de 49€/mois”',
  inspirationsPlaceholder:
    'Ajoutez 1 à 3 liens de sites que vous aimez (même hors de votre secteur).',
  availableAssetsPlaceholder:
    'Précisez ce que vous avez déjà: logo, photos, témoignages, plaquette, vidéos…',
  requiredPagesPlaceholder:
    'Ex: Hero, bénéfices, preuve sociale, FAQ, section contact',
  desiredDeadlinePlaceholder: 'Ex: idéalement avant le 30 avril'
} as const;
