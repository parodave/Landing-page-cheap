import { mapBriefToInternalBrief } from '@/lib/mappers/brief-to-internal-brief';
import type { BriefRecord } from '@/lib/types/brief';
import type { OrderRecord } from '@/lib/types/order';
import { sendEmailWithResend } from '@/lib/email/resend';
import { buildInternalOrderEmailTemplate } from '@/lib/email/templates/internal-order-email';

function getRequiredEnvironmentVariable(name: 'INTERNAL_NOTIFICATION_EMAIL' | 'NEXT_PUBLIC_APP_URL') {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name} environment variable.`);
  }

  return value;
}

function buildAbsoluteUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, '')}${path}`;
}

export async function sendInternalOrderEmail(params: { brief: BriefRecord; order: OrderRecord }) {
  const { brief, order } = params;
  const baseUrl = getRequiredEnvironmentVariable('NEXT_PUBLIC_APP_URL');
  const to = getRequiredEnvironmentVariable('INTERNAL_NOTIFICATION_EMAIL');

  const internalBrief = mapBriefToInternalBrief(brief);
  const links = {
    briefUrl: buildAbsoluteUrl(baseUrl, `/briefs/${brief.id}`),
    promptUrl: buildAbsoluteUrl(baseUrl, `/briefs/${brief.id}/prompt`),
    pdfUrl: buildAbsoluteUrl(baseUrl, `/api/briefs/${brief.id}/pdf`)
  };

  const template = buildInternalOrderEmailTemplate({
    brief,
    order,
    completionLevel: internalBrief.summary.completionLevel,
    warnings: internalBrief.warnings,
    links
  });

  return sendEmailWithResend({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
}
