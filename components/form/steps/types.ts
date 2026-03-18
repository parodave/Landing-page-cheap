export type FormData = {
  identity: {
    brandName: string;
    legalName: string;
    industry: string;
  };
  activity: {
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
  contactDelivery: {
    email: string;
    whatsapp: string;
    desiredDeadline: string;
  };
};

export type StepProps = {
  data: FormData;
  onSectionChange: <K extends keyof FormData>(section: K, field: keyof FormData[K], value: string) => void;
};

export const INITIAL_FORM_DATA: FormData = {
  identity: {
    brandName: '',
    legalName: '',
    industry: ''
  },
  activity: {
    audience: '',
    businessGoal: ''
  },
  offer: {
    coreOffer: '',
    pricingRange: ''
  },
  design: {
    visualDirection: '',
    inspirations: ''
  },
  content: {
    availableAssets: '',
    requiredPages: ''
  },
  contactDelivery: {
    email: '',
    whatsapp: '',
    desiredDeadline: ''
  }
};
