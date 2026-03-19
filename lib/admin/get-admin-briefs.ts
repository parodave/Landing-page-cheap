import { getAllBriefs } from '@/lib/briefs';
import { getOrderByStripeSessionId } from '@/lib/orders';
import type { BriefPaymentStatus, BriefStatus } from '@/lib/types/brief';

export type AdminBriefRow = {
  briefId: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  businessName: string;
  briefStatus: BriefStatus;
  paymentStatus: BriefPaymentStatus;
  amountTotal: number | null;
  currency: string | null;
  briefUrl: string;
  promptUrl: string;
  pdfUrl: string;
};

function mapOrderStatusToPaymentStatus(status: string): BriefPaymentStatus {
  if (status === 'paid') {
    return 'paid';
  }

  if (status === 'expired') {
    return 'expired';
  }

  if (status === 'payment_failed') {
    return 'failed';
  }

  return 'pending';
}

export async function getAdminBriefs(): Promise<AdminBriefRow[]> {
  const briefs = await getAllBriefs();

  const mapped = await Promise.all(
    briefs.map(async (brief) => {
      const stripeSessionId = brief.payment.stripeSessionId;
      const order = stripeSessionId ? await getOrderByStripeSessionId(stripeSessionId) : null;

      const paymentStatus = brief.payment.paymentStatus ?? (order ? mapOrderStatusToPaymentStatus(order.status) : 'pending');
      const amountTotal = brief.payment.amountTotal ?? order?.amountTotal ?? null;
      const currency = brief.payment.currency ?? order?.currency ?? null;

      return {
        briefId: brief.id,
        createdAt: brief.createdAt,
        customerName: brief.customer.fullName.trim(),
        customerEmail: brief.customer.email.trim(),
        businessName: brief.business.businessName.trim(),
        briefStatus: brief.status,
        paymentStatus,
        amountTotal,
        currency,
        briefUrl: `/briefs/${brief.id}`,
        promptUrl: `/briefs/${brief.id}/prompt`,
        pdfUrl: `/api/briefs/${brief.id}/pdf`
      } satisfies AdminBriefRow;
    })
  );

  return mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
