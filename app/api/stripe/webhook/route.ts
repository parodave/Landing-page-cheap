import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { markBriefAsPaid, updateBrief, getBriefByStripeSessionId } from '@/lib/briefs';
import { sendInternalOrderEmail } from '@/lib/email/send-internal-order-email';
import { sendCustomerOrderConfirmationEmail } from '@/lib/email/send-customer-order-confirmation';
import { PAYMENT_METADATA } from '@/lib/constants/payment';
import { ordersRepository } from '@/lib/orders';
import { getStripeServerClient, getStripeWebhookSecret } from '@/lib/stripe';
import type { BriefRecord } from '@/lib/types/brief';
import type { CreateOrderInput, OrderRecord } from '@/lib/types/order';
import { captureApiException } from '@/lib/monitoring/sentry';

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

async function syncBriefFromCheckoutSession(session: Stripe.Checkout.Session, status: CreateOrderInput['status']) {
  const metadata = normalizeMetadata(session.metadata);
  const briefId = metadata.briefId || null;

  if (status === 'paid') {
    const paidBrief = await markBriefAsPaid({
      briefId,
      stripeSessionId: session.id,
      amountTotal: session.amount_total,
      currency: session.currency
    });

    if (paidBrief) {
      console.info(`[briefs] Brief ${paidBrief.id} marked as paid from session ${session.id}.`);
    }

    return paidBrief;
  }

  if (status === 'expired') {
    if (briefId) {
      const expiredBrief = await updateBrief(briefId, {
        payment: {
          stripeSessionId: session.id,
          paymentStatus: 'expired',
          amountTotal: session.amount_total,
          currency: session.currency,
          paidAt: null
        }
      });

      if (expiredBrief) {
        console.info(`[briefs] Brief ${expiredBrief.id} marked as payment expired for session ${session.id}.`);
        return expiredBrief;
      }
    }

    const briefBySession = await getBriefByStripeSessionId(session.id);

    if (briefBySession) {
      const updatedBrief = await updateBrief(briefBySession.id, {
        payment: {
          stripeSessionId: session.id,
          paymentStatus: 'expired',
          amountTotal: session.amount_total,
          currency: session.currency,
          paidAt: null
        }
      });
      console.info(`[briefs] Brief ${briefBySession.id} marked as payment expired for session ${session.id}.`);
      return updatedBrief;
    }
  }

  return null;
}

async function maybeSendInternalOrderEmail(params: { order: OrderRecord; brief: BriefRecord | null }) {
  const { order, brief } = params;

  if (!brief || order.status !== 'paid') {
    return;
  }

  if (order.notifications?.internalOrderEmail?.sentAt) {
    console.info(`[email] Internal email already sent for session ${order.stripeSessionId}.`);
    return;
  }

  try {
    const result = await sendInternalOrderEmail({ brief, order });

    await ordersRepository.markInternalOrderEmailSent({
      stripeSessionId: order.stripeSessionId,
      messageId: result.messageId
    });

    console.info(`[email] Internal order email sent for session ${order.stripeSessionId}.`);
  } catch (error) {
    console.error(`[email] Failed to send internal order email for session ${order.stripeSessionId}.`, error);
  }
}

async function maybeSendCustomerOrderConfirmationEmail(params: { order: OrderRecord; brief: BriefRecord | null }) {
  const { order, brief } = params;

  if (!brief || order.status !== 'paid') {
    return;
  }

  if (order.notifications?.customerOrderConfirmationEmail?.sentAt) {
    console.info(`[email] Customer confirmation email already sent for session ${order.stripeSessionId}.`);
    return;
  }

  try {
    const result = await sendCustomerOrderConfirmationEmail({ brief, order });

    await ordersRepository.markCustomerOrderConfirmationEmailSent({
      stripeSessionId: order.stripeSessionId,
      messageId: result.messageId
    });

    console.info(`[email] Customer confirmation email sent for session ${order.stripeSessionId}.`);
  } catch (error) {
    console.error(`[email] Failed to send customer confirmation email for session ${order.stripeSessionId}.`, error);
  }
}

async function handleCheckoutSessionEvent(session: Stripe.Checkout.Session, status: CreateOrderInput['status']) {
  const { created, order } = await ordersRepository.saveOrder(toOrderFromCheckoutSession(session, status));

  if (!created) {
    console.info(`[stripe-webhook] Session already handled in orders store: ${order.stripeSessionId}`);
  } else {
    console.info(`[stripe-webhook] Order saved for session ${order.stripeSessionId} with status ${order.status}.`);
  }

  const syncedBrief = await syncBriefFromCheckoutSession(session, status);

  await maybeSendInternalOrderEmail({
    order,
    brief: syncedBrief
  });

  await maybeSendCustomerOrderConfirmationEmail({
    order,
    brief: syncedBrief
  });
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
    await markBriefPaymentFailed(stripeSessionId, paymentIntent.amount, paymentIntent.currency);
    console.info(`[stripe-webhook] Saved payment failure for session ${stripeSessionId}.`);
  }
}

async function markBriefPaymentFailed(stripeSessionId: string, amountTotal: number, currency: string | null) {
  const brief = await getBriefByStripeSessionId(stripeSessionId);

  if (!brief) {
    return;
  }

  await updateBrief(brief.id, {
    payment: {
      stripeSessionId,
      paymentStatus: 'failed',
      amountTotal,
      currency,
      paidAt: null
    }
  });

  console.info(`[briefs] Brief ${brief.id} marked as payment failed for session ${stripeSessionId}.`);
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
    captureApiException(error, { route: '/api/stripe/webhook', feature: 'stripe_webhook_signature' });
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
    captureApiException(error, { route: '/api/stripe/webhook', feature: 'stripe_webhook_handler', payload: { eventType: event.type } });
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
