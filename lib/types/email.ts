import type { BriefRecord } from '@/lib/types/brief';
import type { OrderRecord } from '@/lib/types/order';

export type EmailProvider = 'resend';

export type EmailSendPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export type EmailSendResult = {
  provider: EmailProvider;
  messageId: string;
};

export type InternalOrderEmailPayload = {
  brief: BriefRecord;
  order: OrderRecord;
  completionLevel: 'high' | 'medium' | 'low';
  warnings: string[];
  links: {
    briefUrl: string;
    promptUrl: string;
    pdfUrl: string;
  };
};
