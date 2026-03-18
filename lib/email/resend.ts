import type { EmailSendPayload, EmailSendResult } from '@/lib/types/email';

const RESEND_API_URL = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'Landing Express <onboarding@resend.dev>';

type ResendApiResponse = {
  id?: string;
  message?: string;
};

function getResendApiKey() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY environment variable.');
  }

  return apiKey;
}

function getResendFromAddress() {
  return process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
}

export async function sendEmailWithResend(payload: EmailSendPayload): Promise<EmailSendResult> {
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getResendApiKey()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: getResendFromAddress(),
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text
    })
  });

  const data = (await response.json()) as ResendApiResponse;

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send email with Resend API.');
  }

  if (!data.id) {
    throw new Error('Resend API did not return a message id.');
  }

  return {
    provider: 'resend',
    messageId: data.id
  };
}
