import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

function getRequiredEnvironmentVariable(name: 'STRIPE_SECRET_KEY' | 'STRIPE_WEBHOOK_SECRET' | 'NEXT_PUBLIC_APP_URL') {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getStripeServerClient() {
  if (stripeClient) {
    return stripeClient;
  }

  stripeClient = new Stripe(getRequiredEnvironmentVariable('STRIPE_SECRET_KEY'));
  return stripeClient;
}

export function getStripeWebhookSecret() {
  return getRequiredEnvironmentVariable('STRIPE_WEBHOOK_SECRET');
}

export function getAppUrl() {
  return getRequiredEnvironmentVariable('NEXT_PUBLIC_APP_URL');
}
