import { ClientFormData } from '@/lib/types/form';

export type FormData = ClientFormData;

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
  business: {
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
  contact: {
    email: '',
    whatsapp: '',
    desiredDeadline: ''
  }
};
