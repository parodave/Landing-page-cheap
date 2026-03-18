import type { InternalOrderEmailPayload } from '@/lib/types/email';

type InternalOrderEmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 12px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 12px;border:1px solid #e2e8f0;vertical-align:top;">${escapeHtml(value)}</td>
  </tr>`;
}

function linkRow(label: string, href: string) {
  const safeHref = escapeHtml(href);
  return `<tr>
    <td style="padding:8px 12px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 12px;border:1px solid #e2e8f0;vertical-align:top;"><a href="${safeHref}">${safeHref}</a></td>
  </tr>`;
}

function normalizeValue(value: string | null | undefined, fallback = 'Non renseigné') {
  const normalized = (value ?? '').trim();
  return normalized || fallback;
}

export function buildInternalOrderEmailTemplate(payload: InternalOrderEmailPayload): InternalOrderEmailTemplate {
  const { brief, order, links } = payload;

  const paidAt = brief.payment.paidAt || order.paidAt || new Date().toISOString();
  const amount = order.amountTotal > 0 ? `${(order.amountTotal / 100).toFixed(2)} ${(order.currency || 'eur').toUpperCase()}` : 'Non renseigné';
  const warnings = payload.warnings;

  const subject = 'Nouvelle commande payée — Landing Express 10€';

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;line-height:1.5;max-width:760px;margin:0 auto;padding:16px;">
    <h1 style="font-size:20px;margin:0 0 12px;">Nouvelle commande payée ✅</h1>
    <p style="margin:0 0 16px;">Paiement confirmé côté Stripe webhook. Vous pouvez lancer la production.</p>

    <h2 style="font-size:16px;margin:20px 0 8px;">Informations de commande</h2>
    <table style="border-collapse:collapse;width:100%;font-size:14px;">
      ${row('Statut paiement', 'Confirmé')}
      ${row('Montant', amount)}
      ${row('briefId', brief.id)}
      ${row('stripeSessionId', order.stripeSessionId)}
      ${row('Date confirmation', paidAt)}
    </table>

    <h2 style="font-size:16px;margin:20px 0 8px;">Client</h2>
    <table style="border-collapse:collapse;width:100%;font-size:14px;">
      ${row('Nom client', normalizeValue(brief.customer.fullName))}
      ${row('Email client', normalizeValue(brief.customer.email, normalizeValue(order.customerEmail)))}
      ${row('Téléphone / WhatsApp', normalizeValue(brief.customer.phoneOrWhatsapp))}
    </table>

    <h2 style="font-size:16px;margin:20px 0 8px;">Résumé brief</h2>
    <table style="border-collapse:collapse;width:100%;font-size:14px;">
      ${row('Nom activité', normalizeValue(brief.business.businessName))}
      ${row('Type d’activité', normalizeValue(brief.business.activityType))}
      ${row('Objectif principal', normalizeValue(brief.business.mainGoal))}
      ${row('Offre principale', normalizeValue(brief.offer.mainOffer))}
      ${row('CTA principal', normalizeValue(brief.offer.mainCTA))}
      ${row('Style souhaité', normalizeValue(brief.design.desiredStyle))}
      ${row('Logo fourni', brief.design.hasLogo ? 'Oui' : 'Non')}
      ${row('Photos fournies', brief.design.hasPhotos ? 'Oui' : 'Non')}
    </table>

    <h2 style="font-size:16px;margin:20px 0 8px;">Qualité des infos</h2>
    <table style="border-collapse:collapse;width:100%;font-size:14px;">
      ${row('Niveau de complétude', payload.completionLevel)}
      ${row('Warnings principaux', warnings.length > 0 ? warnings.join(' | ') : 'Aucun warning explicite')}
    </table>

    <h2 style="font-size:16px;margin:20px 0 8px;">Liens utiles</h2>
    <table style="border-collapse:collapse;width:100%;font-size:14px;">
      ${linkRow('Brief interne', links.briefUrl)}
      ${linkRow('Prompt de production', links.promptUrl)}
      ${linkRow('PDF brief', links.pdfUrl)}
    </table>
  </div>
  `;

  const textLines = [
    'Nouvelle commande payée - Landing Express 10€',
    '',
    'Statut paiement: Confirmé',
    `Montant: ${amount}`,
    `briefId: ${brief.id}`,
    `stripeSessionId: ${order.stripeSessionId}`,
    `Date confirmation: ${paidAt}`,
    '',
    `Nom client: ${normalizeValue(brief.customer.fullName)}`,
    `Email client: ${normalizeValue(brief.customer.email, normalizeValue(order.customerEmail))}`,
    `Téléphone / WhatsApp: ${normalizeValue(brief.customer.phoneOrWhatsapp)}`,
    '',
    `Nom activité: ${normalizeValue(brief.business.businessName)}`,
    `Type d'activité: ${normalizeValue(brief.business.activityType)}`,
    `Objectif principal: ${normalizeValue(brief.business.mainGoal)}`,
    `Offre principale: ${normalizeValue(brief.offer.mainOffer)}`,
    `CTA principal: ${normalizeValue(brief.offer.mainCTA)}`,
    `Style souhaité: ${normalizeValue(brief.design.desiredStyle)}`,
    `Logo fourni: ${brief.design.hasLogo ? 'Oui' : 'Non'}`,
    `Photos fournies: ${brief.design.hasPhotos ? 'Oui' : 'Non'}`,
    '',
    `Niveau de complétude: ${payload.completionLevel}`,
    `Warnings principaux: ${warnings.length > 0 ? warnings.join(' | ') : 'Aucun warning explicite'}`,
    '',
    `Brief interne: ${links.briefUrl}`,
    `Prompt de production: ${links.promptUrl}`,
    `PDF brief: ${links.pdfUrl}`
  ];

  return {
    subject,
    html,
    text: textLines.join('\n')
  };
}
