import { NextResponse } from 'next/server';
import { z } from 'zod';
import { attachStripeSessionToBrief } from '@/lib/briefs';
import { LANDING_EXPRESS_PAYMENT, PAYMENT_METADATA } from '@/lib/constants/payment';
import { getAppUrl, getStripeServerClient } from '@/lib/stripe';
import { captureApiException } from '@/lib/monitoring/sentry';

const checkoutPayloadSchema = z.object({
  customerEmail: z.string().trim().email().optional(),
  businessName: z.string().trim().min(1).max(120).optional(),
  briefId: z.string().trim().min(1).optional()
});

export const runtime = 'nodejs';

type CheckoutRequestPayload = z.infer<typeof checkoutPayloadSchema>;

function sanitizePayload(payload: CheckoutRequestPayload) {
  return {
    customerEmail: payload.customerEmail?.trim() || undefined,
    businessName: payload.businessName?.trim() || undefined,
    briefId: payload.briefId?.trim() || undefined
  };
}

export async function POST(request: Request) {
  try {
    const parsedBody = checkoutPayloadSchema.safeParse(await request.json());

    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Payload invalide pour Checkout.' }, { status: 400 });
    }

    const appUrl = getAppUrl();
    const stripe = getStripeServerClient();
    const payload = sanitizePayload(parsedBody.data);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: payload.customerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: LANDING_EXPRESS_PAYMENT.currency,
            unit_amount: LANDING_EXPRESS_PAYMENT.amountInCents,
            product_data: {
              name: LANDING_EXPRESS_PAYMENT.name,
              description: LANDING_EXPRESS_PAYMENT.description
            }
          }
        }
      ],
      metadata: {
        ...PAYMENT_METADATA,
        customerEmail: payload.customerEmail ?? '',
        businessName: payload.businessName ?? '',
        briefId: payload.briefId ?? ''
      },
      success_url: `${appUrl}/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/formulaire?payment=cancelled`
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Impossible de créer la session Stripe.' }, { status: 500 });
    }

    if (payload.briefId) {
      await attachStripeSessionToBrief({
        briefId: payload.briefId,
        stripeSessionId: session.id,
        amountTotal: session.amount_total,
        currency: session.currency
      });
      console.info(`[briefs] Brief ${payload.briefId} attached to Stripe session ${session.id}.`);
    }

    return NextResponse.json({ url: session.url, briefId: payload.briefId ?? null });
  } catch (error) {
    captureApiException(error, { route: '/api/stripe/checkout', feature: 'stripe_checkout' });
    console.error('Stripe checkout session error', error);
    return NextResponse.json({ error: 'Erreur serveur pendant la création de session Stripe.' }, { status: 500 });
  }
}
