import { BRIEF_DEFAULT_STATUS, BRIEF_SOURCE } from '@/lib/constants/brief';
import type { CreateBriefInput } from '@/lib/types/brief';
import type { ClientFormData } from '@/lib/types/form';

export type BriefCreationPayload = {
  formData: ClientFormData;
  assets?: {
    logoFileNames?: string[];
    photoFileNames?: string[];
  };
};

function splitInspirations(inspirations: string) {
  const [first = '', second = ''] = inspirations
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    first,
    second
  };
}

export function mapFormToBrief(payload: BriefCreationPayload): CreateBriefInput {
  const { formData, assets } = payload;
  const inspirationSites = splitInspirations(formData.design.inspirations);

  return {
    status: BRIEF_DEFAULT_STATUS,
    source: BRIEF_SOURCE,
    customer: {
      fullName: formData.identity.legalName,
      email: formData.contact.email,
      phoneOrWhatsapp: formData.contact.whatsapp
    },
    business: {
      businessName: formData.identity.brandName,
      activityType: formData.identity.industry,
      activityDescription: formData.content.availableAssets,
      mainGoal: formData.business.businessGoal,
      targetAudience: formData.business.audience
    },
    offer: {
      mainOffer: formData.offer.coreOffer,
      showPrice: formData.offer.pricingRange,
      mainCTA: formData.business.businessGoal,
      secondaryServices: ''
    },
    design: {
      desiredStyle: formData.design.visualDirection,
      desiredColors: '',
      inspirationSite1: inspirationSites.first,
      inspirationSite2: inspirationSites.second,
      hasLogo: (assets?.logoFileNames?.length ?? 0) > 0,
      hasPhotos: (assets?.photoFileNames?.length ?? 0) > 0
    },
    content: {
      heroTitle: formData.identity.brandName,
      subtitle: '',
      keyArguments: formData.content.requiredPages,
      hasTestimonials: false,
      wantsFAQ: false,
      mandatoryInformation: formData.content.availableAssets
    },
    contact: {
      publicEmail: formData.contact.email,
      publicPhone: formData.contact.whatsapp,
      publicWhatsapp: formData.contact.whatsapp,
      instagramUrl: '',
      facebookUrl: '',
      tiktokUrl: '',
      hasExistingDomain: false,
      desiredDomain: ''
    },
    assets: {
      logoFileNames: assets?.logoFileNames ?? [],
      photoFileNames: assets?.photoFileNames ?? []
    },
    payment: {
      stripeSessionId: null,
      paymentStatus: 'pending',
      amountTotal: null,
      currency: null,
      paidAt: null
    }
  };
}
