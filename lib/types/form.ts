export type FormStepKey =
  | 'identity'
  | 'business'
  | 'offer'
  | 'design'
  | 'content'
  | 'contact'
  | 'review';

export type YesNo = 'yes' | 'no';

export type ClientFormData = {
  identity: {
    brandName: string;
    legalName: string;
    industry: string;
  };
  business: {
    audience: string;
    businessGoal: string;
  };
  offer: {
    coreOffer: string;
    pricingRange: string;
  };
  design: {
    visualDirection: string;
    inspirations: string;
  };
  content: {
    availableAssets: string;
    requiredPages: string;
  };
  contact: {
    email: string;
    whatsapp: string;
    desiredDeadline: string;
  };
};

export type ReviewSection = {
  key: Exclude<FormStepKey, 'review'>;
  title: string;
  description?: string;
  fields: Array<{
    label: string;
    value: string;
  }>;
};

export type FormStepDefinition = {
  key: FormStepKey;
  title: string;
  description: string;
  index: number;
};
