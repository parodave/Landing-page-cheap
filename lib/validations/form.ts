import { z } from 'zod';

const requiredText = (label: string, min = 2) =>
  z
    .string()
    .trim()
    .min(1, `${label} est requis.`)
    .min(min, `${label} doit contenir au moins ${min} caractères.`);

const optionalUrl = (label: string) =>
  z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.string().url().safeParse(value).success, {
      message: `${label} doit être une URL valide.`
    });

const permissivePhoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?(?:[\s./-]*[0-9]){6,14}$/;

const socialFieldSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => {
      if (!value) return true;
      if (value.startsWith('@')) return value.length > 2;
      if (/^[a-zA-Z0-9._-]{3,30}$/.test(value)) return true;

      return z.string().url().safeParse(value).success;
    },
    {
      message: 'Renseignez un handle (@compte), un identifiant simple ou une URL valide.'
    }
  );

const identitySchema = z.object({
  brandName: requiredText('Le nom de marque'),
  legalName: requiredText('La raison sociale'),
  industry: requiredText('Le secteur')
});

const businessSchema = z
  .object({
    audience: requiredText('La cible', 10),
    businessGoal: requiredText('L’objectif business', 10),
    hasExistingDomain: z.enum(['yes', 'no'], {
      required_error: 'Veuillez préciser si vous avez déjà un nom de domaine.'
    }),
    desiredDomain: z.string().trim().optional()
  })
  .superRefine(({ hasExistingDomain, desiredDomain }, ctx) => {
    if (hasExistingDomain === 'no' && !desiredDomain) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['desiredDomain'],
        message: 'Le nom de domaine souhaité est requis si vous n’en avez pas encore.'
      });
      return;
    }

    if (desiredDomain && !z.string().url().safeParse(desiredDomain).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['desiredDomain'],
        message: 'Le nom de domaine souhaité doit être une URL valide.'
      });
    }
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
  requiredPages: requiredText('Les sections attendues', 10),
  keyArguments: requiredText('Les arguments clés', 20),
  detailedDescription: requiredText('La description détaillée', 30)
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
  desiredDeadline: requiredText('Le délai souhaité'),
  websiteUrl: optionalUrl('Le site web'),
  socials: z
    .object({
      instagram: socialFieldSchema,
      linkedin: socialFieldSchema,
      facebook: socialFieldSchema,
      x: socialFieldSchema,
      tiktok: socialFieldSchema,
      youtube: socialFieldSchema
    })
    .optional()
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
