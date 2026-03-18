import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PAYMENT_METADATA } from '@/lib/constants/payment';
import { ordersRepository } from '@/lib/orders';
import { getStripeServerClient, getStripeWebhookSecret } from '@/lib/stripe';
import type { CreateOrderInput } from '@/lib/types/order';

export const runtime = 'nodejs';

function normalizeMetadata(metadata: Stripe.Metadata | null | undefined): Record<string, string> {
  if (!metadata) {
    return {};
  }

  return Object.entries(metadata).reduce<Record<string, string>>((accumulator, [key, value]) => {
    if (typeof value === 'string') {
      accumulator[key] = value;
    }

    return accumulator;
  }, {});
}

function toOrderFromCheckoutSession(session: Stripe.Checkout.Session, status: CreateOrderInput['status']): CreateOrderInput {
  const metadata = normalizeMetadata(session.metadata);

  return {
    stripeSessionId: session.id,
    paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
    status,
    product: metadata.product || PAYMENT_METADATA.product,
    amountTotal: session.amount_total ?? 0,
    currency: session.currency ?? 'eur',
    customerEmail: session.customer_details?.email ?? session.customer_email ?? metadata.customerEmail ?? null,
    businessName: metadata.businessName || null,
    source: metadata.source || PAYMENT_METADATA.source,
    paidAt: status === 'paid' ? new Date().toISOString() : null,
    metadata
  };
}

function extractSessionIdFromPaymentIntent(paymentIntent: Stripe.PaymentIntent): string | null {
  const metadata = normalizeMetadata(paymentIntent.metadata);

  return metadata.stripeSessionId || metadata.checkoutSessionId || metadata.checkout_session_id || null;
}

async function handleCheckoutSessionEvent(session: Stripe.Checkout.Session, status: CreateOrderInput['status']) {
  const { created, order } = await ordersRepository.saveOrder(toOrderFromCheckoutSession(session, status));

  if (!created) {
    console.info(`[stripe-webhook] Session already handled: ${order.stripeSessionId}`);
    return;
  }

  console.info(`[stripe-webhook] Order saved for session ${order.stripeSessionId} with status ${order.status}.`);
}

async function handlePaymentIntentFailedEvent(paymentIntent: Stripe.PaymentIntent) {
  const stripeSessionId = extractSessionIdFromPaymentIntent(paymentIntent);

  if (!stripeSessionId) {
    console.info('[stripe-webhook] payment_intent.payment_failed received without checkout session reference.');
    return;
  }

  const existingOrder = await ordersRepository.getOrderByStripeSessionId(stripeSessionId);

  if (existingOrder) {
    console.info(`[stripe-webhook] Failure event ignored because session ${stripeSessionId} is already stored.`);
    return;
  }

  const metadata = normalizeMetadata(paymentIntent.metadata);

  const { created } = await ordersRepository.saveOrder({
    stripeSessionId,
    paymentIntentId: paymentIntent.id,
    status: 'payment_failed',
    product: metadata.product || PAYMENT_METADATA.product,
    amountTotal: paymentIntent.amount,
    currency: paymentIntent.currency,
    customerEmail: paymentIntent.receipt_email ?? metadata.customerEmail ?? null,
    businessName: metadata.businessName || null,
    source: metadata.source || PAYMENT_METADATA.source,
    paidAt: null,
    metadata
  });

  if (created) {
    console.info(`[stripe-webhook] Saved payment failure for session ${stripeSessionId}.`);
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripeServerClient();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, getStripeWebhookSecret());
  } catch (error) {
    console.error('[stripe-webhook] Signature verification failed.', error);
    return NextResponse.json({ error: 'Invalid Stripe signature.' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutSessionEvent(event.data.object as Stripe.Checkout.Session, 'paid');
        break;
      }
      case 'checkout.session.expired': {
        await handleCheckoutSessionEvent(event.data.object as Stripe.Checkout.Session, 'expired');
        break;
      }
      case 'payment_intent.payment_failed': {
        await handlePaymentIntentFailedEvent(event.data.object as Stripe.PaymentIntent);
        break;
      }
      default:
        console.info(`[stripe-webhook] Event ignored: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`[stripe-webhook] Failed to handle event ${event.type}.`, error);
    return NextResponse.json({ error: 'Webhook handler failure.' }, { status: 500 });
  }
}

/*
  Local test quick start (Stripe CLI):
  1) stripe listen --forward-to localhost:3000/api/stripe/webhook
  2) Put the shown signing secret in STRIPE_WEBHOOK_SECRET
  3) stripe trigger checkout.session.completed
*/
