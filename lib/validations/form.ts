import { z } from 'zod';

const requiredText = (label: string, min = 2) =>
  z
    .string()
    .trim()
    .min(1, `${label} est requis.`)
    .min(min, `${label} doit contenir au moins ${min} caractères.`);

const permissivePhoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?(?:[\s./-]*[0-9]){6,14}$/;

const identitySchema = z.object({
  brandName: requiredText('Le nom de marque'),
  legalName: requiredText('La raison sociale'),
  industry: requiredText('Le secteur')
});

const businessSchema = z.object({
  audience: requiredText('La cible', 10),
  businessGoal: requiredText('L’objectif business', 10)
});

const offerSchema = z.object({
  coreOffer: requiredText('L’offre principale', 10),
  pricingRange: requiredText('La gamme de prix')
});

const designSchema = z.object({
  visualDirection: requiredText('La direction visuelle', 10),
  inspirations: requiredText('Les inspirations', 10)
});

const contentSchema = z.object({
  availableAssets: requiredText('Les assets disponibles', 10),
  requiredPages: requiredText('Les sections attendues', 10)
});

const contactSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'L’email est requis.')
    .email('Veuillez renseigner un email valide.'),
  whatsapp: z
    .string()
    .trim()
    .min(1, 'Le téléphone est requis.')
    .refine((value) => permissivePhoneRegex.test(value), {
      message: 'Veuillez renseigner un numéro de téléphone valide (format international tolérant).'
    }),
  desiredDeadline: z.string().trim().min(1, 'Le délai souhaité est requis.')
});

export const clientFormSchema = z.object({
  identity: identitySchema,
  business: businessSchema,
  offer: offerSchema,
  design: designSchema,
  content: contentSchema,
  contact: contactSchema
});

export const stepSchemas = {
  identity: identitySchema,
  business: businessSchema,
  offer: offerSchema,
  design: designSchema,
  content: contentSchema,
  contact: contactSchema
} as const;

export type ClientFormSchema = z.infer<typeof clientFormSchema>;
