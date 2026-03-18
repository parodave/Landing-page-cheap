export const ORDER_STATUSES = ['paid', 'expired', 'payment_failed'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderMetadata = Record<string, string>;

export type OrderNotifications = {
  internalOrderEmail?: {
    sentAt: string;
    messageId: string;
  };
};

export type OrderRecord = {
  id: string;
  stripeSessionId: string;
  paymentIntentId: string | null;
  status: OrderStatus;
  product: string;
  amountTotal: number;
  currency: string;
  customerEmail: string | null;
  businessName: string | null;
  source: string;
  createdAt: string;
  paidAt: string | null;
  metadata: OrderMetadata;
  notifications?: OrderNotifications;
};

export type CreateOrderInput = Omit<OrderRecord, 'id' | 'createdAt' | 'notifications'> & {
  createdAt?: string;
};
