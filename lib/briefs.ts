import { BRIEF_PAYMENT_DEFAULT_CURRENCY } from '@/lib/constants/brief';
import { createLocalBriefStore } from '@/lib/storage/brief-store';
import type { BriefPaymentStatus, BriefRecord, BriefStatus, CreateBriefInput, UpdateBriefInput } from '@/lib/types/brief';

const briefStore = createLocalBriefStore();

export async function createBrief(input: CreateBriefInput) {
  return briefStore.createBrief(input);
}

export async function updateBrief(briefId: string, updates: UpdateBriefInput) {
  return briefStore.updateBrief(briefId, updates);
}

export async function getBriefById(briefId: string) {
  return briefStore.getBriefById(briefId);
}

export async function getBriefByStripeSessionId(stripeSessionId: string) {
  return briefStore.getBriefByStripeSessionId(stripeSessionId);
}

export async function getAllBriefs() {
  return briefStore.getAllBriefs();
}

export async function attachStripeSessionToBrief(params: {
  briefId: string;
  stripeSessionId: string;
  amountTotal?: number | null;
  currency?: string | null;
  paymentStatus?: BriefPaymentStatus;
}) {
  const { briefId, stripeSessionId, amountTotal = null, currency = BRIEF_PAYMENT_DEFAULT_CURRENCY, paymentStatus = 'pending' } = params;

  return updateBrief(briefId, {
    payment: {
      stripeSessionId,
      paymentStatus,
      amountTotal,
      currency,
      paidAt: null
    }
  });
}

export async function markBriefAsPaid(params: {
  briefId?: string | null;
  stripeSessionId?: string | null;
  amountTotal?: number | null;
  currency?: string | null;
  paidAt?: string;
  status?: BriefStatus;
}): Promise<BriefRecord | null> {
  const {
    briefId,
    stripeSessionId,
    amountTotal = null,
    currency = BRIEF_PAYMENT_DEFAULT_CURRENCY,
    paidAt = new Date().toISOString(),
    status = 'paid'
  } = params;

  const brief = briefId
    ? await getBriefById(briefId)
    : stripeSessionId
      ? await getBriefByStripeSessionId(stripeSessionId)
      : null;

  if (!brief) {
    return null;
  }

  return updateBrief(brief.id, {
    status,
    payment: {
      stripeSessionId: stripeSessionId ?? brief.payment.stripeSessionId,
      paymentStatus: 'paid',
      amountTotal,
      currency,
      paidAt
    }
  });
}
