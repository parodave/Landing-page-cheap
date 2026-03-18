import { ClientFormData } from '@/lib/types/form';

export type FormData = ClientFormData;

export type FormFilesData = {
  logo: File[];
  photos: File[];
};

export type StepProps = {
  data: FormData;
  files: FormFilesData;
  onSectionChange: <K extends keyof FormData>(section: K, field: keyof FormData[K], value: string) => void;
  onFilesChange: (field: keyof FormFilesData, files: File[]) => void;
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

export const INITIAL_FORM_FILES: FormFilesData = {
  logo: [],
  photos: []
};
