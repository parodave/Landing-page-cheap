export type BriefStatus =
  | 'draft'
  | 'pending_payment'
  | 'paid'
  | 'in_production'
  | 'delivered'
  | 'archived';

export type BriefPaymentStatus = 'pending' | 'paid' | 'failed' | 'expired';

export type BriefRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: BriefStatus;
  source: string;
  customer: {
    fullName: string;
    email: string;
    phoneOrWhatsapp: string;
  };
  business: {
    businessName: string;
    activityType: string;
    activityDescription: string;
    mainGoal: string;
    targetAudience: string;
  };
  offer: {
    mainOffer: string;
    showPrice: string;
    mainCTA: string;
    secondaryServices: string;
  };
  design: {
    desiredStyle: string;
    desiredColors: string;
    inspirationSite1: string;
    inspirationSite2: string;
    hasLogo: boolean;
    hasPhotos: boolean;
  };
  content: {
    heroTitle: string;
    subtitle: string;
    keyArguments: string;
    hasTestimonials: boolean;
    wantsFAQ: boolean;
    mandatoryInformation: string;
  };
  contact: {
    publicEmail: string;
    publicPhone: string;
    publicWhatsapp: string;
    instagramUrl: string;
    facebookUrl: string;
    tiktokUrl: string;
    hasExistingDomain: boolean;
    desiredDomain: string;
  };
  assets: {
    logoFileNames: string[];
    photoFileNames: string[];
  };
  payment: {
    stripeSessionId: string | null;
    paymentStatus: BriefPaymentStatus;
    amountTotal: number | null;
    currency: string | null;
    paidAt: string | null;
  };
  internalNotes?: string;
};

export type CreateBriefInput = Omit<BriefRecord, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateBriefInput = Partial<Omit<BriefRecord, 'id' | 'createdAt'>>;
