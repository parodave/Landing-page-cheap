import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createBrief, updateBrief } from '@/lib/briefs';
import { mapFormToBrief } from '@/lib/mappers/form-to-brief';
import { captureApiException } from '@/lib/monitoring/sentry';

export const runtime = 'nodejs';

const briefFormPayloadSchema = z.object({
  identity: z.object({
    brandName: z.string(),
    legalName: z.string(),
    industry: z.string()
  }),
  business: z.object({
    audience: z.string(),
    businessGoal: z.string()
  }),
  offer: z.object({
    coreOffer: z.string(),
    pricingRange: z.string()
  }),
  design: z.object({
    visualDirection: z.string(),
    inspirations: z.string()
  }),
  content: z.object({
    availableAssets: z.string(),
    requiredPages: z.string()
  }),
  contact: z.object({
    email: z.string(),
    whatsapp: z.string(),
    desiredDeadline: z.string()
  })
});

const briefPayloadSchema = z.object({
  briefId: z.string().trim().min(1).optional(),
  formData: briefFormPayloadSchema,
  assets: z
    .object({
      logoFileNames: z.array(z.string()).optional(),
      photoFileNames: z.array(z.string()).optional()
    })
    .optional()
});

export async function POST(request: Request) {
  try {
    const parsedBody = briefPayloadSchema.safeParse(await request.json());

    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Payload brief invalide.' }, { status: 400 });
    }

    const payload = parsedBody.data;
    const mappedBrief = mapFormToBrief({
      formData: payload.formData,
      assets: payload.assets
    });

    if (payload.briefId) {
      const updatedBrief = await updateBrief(payload.briefId, mappedBrief);

      if (!updatedBrief) {
        const createdBrief = await createBrief(mappedBrief);
        return NextResponse.json({ briefId: createdBrief.id, status: createdBrief.status }, { status: 201 });
      }

      return NextResponse.json({ briefId: updatedBrief.id, status: updatedBrief.status }, { status: 200 });
    }

    const brief = await createBrief(mappedBrief);
    return NextResponse.json({ briefId: brief.id, status: brief.status }, { status: 201 });
  } catch (error) {
    captureApiException(error, { route: '/api/briefs', feature: 'brief_save' });
    console.error('[briefs] Failed to save brief.', error);
    return NextResponse.json({ error: 'Erreur serveur pendant la sauvegarde du brief.' }, { status: 500 });
  }
}
