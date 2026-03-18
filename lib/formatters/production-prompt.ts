import type { ProductionPrompt, ProductionPromptSection } from '@/lib/types/production-prompt';

function formatSection(section: ProductionPromptSection, index: number) {
  const lines = section.lines.map((line) => `- ${line.replace(/^-\s*/, '')}`).join('\n');
  return `${index}. ${section.title}\n${lines}`;
}

function formatTechnicalConstraints(prompt: ProductionPrompt, index: number) {
  const rules = prompt.technicalConstraints.qualityRules.map((rule) => `- ${rule}`).join('\n');

  return [
    `${index}. CONTRAINTES TECHNIQUES`,
    `- ${prompt.technicalConstraints.framework}`,
    `- ${prompt.technicalConstraints.language}`,
    `- ${prompt.technicalConstraints.router}`,
    `- ${prompt.technicalConstraints.styling}`,
    `- ${prompt.technicalConstraints.visualDirection}`,
    rules
  ].join('\n');
}

export function formatProductionPromptAsText(prompt: ProductionPrompt) {
  const sections = [
    formatSection(prompt.context, 1),
    formatSection(prompt.mission, 2),
    formatSection(prompt.visualStyle, 3),
    formatSection(prompt.clientContent, 4),
    formatSection(prompt.contact, 5),
    formatSection(prompt.recommendedStructure, 6),
    formatTechnicalConstraints(prompt, 7),
    formatSection(prompt.attentionPoints, 8),
    formatSection(prompt.expectedDeliverable, 9)
  ];

  return [
    'INSTRUCTION DE PRODUCTION - LANDING PAGE CLIENT',
    `Brief source: ${prompt.briefId}`,
    '',
    ...sections,
    '',
    'RÈGLE FINALE',
    '- Ne rien inventer quand une donnée est absente.',
    '- Garder un ton professionnel, direct, sans blabla.',
    '- Produire un résultat immédiatement exploitable en production.'
  ].join('\n');
}

export function formatProductionPromptForReuse(prompt: ProductionPrompt) {
  return {
    metadata: {
      briefId: prompt.briefId,
      generatedAt: prompt.generatedAt
    },
    prompt,
    text: formatProductionPromptAsText(prompt)
  };
}
