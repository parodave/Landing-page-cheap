export type InternalBriefStatus = 'ready' | 'needs_review' | 'incomplete';

export type InternalBriefSummary = {
  clientName: string;
  businessName: string;
  activityType: string;
  mainGoal: string;
  paymentStatus: string;
  completionLevel: 'high' | 'medium' | 'low';
};

export type InternalBriefCustomerBlock = {
  identity: string;
  email: string;
  phoneOrWhatsapp: string;
};

export type InternalBriefBusinessBlock = {
  activity: string;
  targetAudience: string;
  promiseOrObjective: string;
};

export type InternalBriefOfferBlock = {
  mainOffer: string;
  primaryCTA: string;
  showPrice: string;
  secondaryServices: string[];
};

export type InternalBriefDesignBlock = {
  desiredStyle: string;
  colors: string;
  inspirations: string[];
  hasLogo: boolean;
  hasPhotos: boolean;
};

export type InternalBriefContentBlock = {
  heroTitle: string;
  subtitle: string;
  keyArguments: string[];
  hasFAQ: boolean;
  hasTestimonials: boolean;
  mandatoryInformation: string[];
};

export type InternalBriefContactBlock = {
  publicContacts: string[];
  socialLinks: string[];
  domainStatus: string;
};

export type InternalBriefAssetsBlock = {
  logoFileNames: string[];
  photoFileNames: string[];
  resourcesStatus: string;
};

export type InternalBriefChecklistItem = {
  label: string;
  isReady: boolean;
  note: string;
};

export type InternalBrief = {
  id: string;
  briefId: string;
  createdAt: string;
  updatedAt: string;
  status: InternalBriefStatus;
  summary: InternalBriefSummary;
  customerBlock: InternalBriefCustomerBlock;
  businessBlock: InternalBriefBusinessBlock;
  offerBlock: InternalBriefOfferBlock;
  designBlock: InternalBriefDesignBlock;
  contentBlock: InternalBriefContentBlock;
  contactBlock: InternalBriefContactBlock;
  assetsBlock: InternalBriefAssetsBlock;
  productionChecklist: InternalBriefChecklistItem[];
  warnings: string[];
  missingElements: string[];
  recommendedCTA: string;
  recommendedSections: string[];
};
