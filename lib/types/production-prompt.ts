export type ProductionPromptSection = {
  title: string;
  lines: string[];
};

export type ProductionPromptTechnicalConstraints = {
  framework: 'Next.js 14+';
  language: 'TypeScript';
  router: 'App Router';
  styling: 'Tailwind CSS';
  visualDirection: string;
  qualityRules: string[];
};

export type ProductionPrompt = {
  briefId: string;
  generatedAt: string;
  context: ProductionPromptSection;
  mission: ProductionPromptSection;
  visualStyle: ProductionPromptSection;
  clientContent: ProductionPromptSection;
  contact: ProductionPromptSection;
  recommendedStructure: ProductionPromptSection;
  technicalConstraints: ProductionPromptTechnicalConstraints;
  attentionPoints: ProductionPromptSection;
  expectedDeliverable: ProductionPromptSection;
  warnings: string[];
  missingElements: string[];
};
