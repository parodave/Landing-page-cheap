export type AnalyticsEventName =
  | 'landing_view'
  | 'cta_click'
  | 'form_open'
  | 'payment_success'
  | 'page_view'
  | 'begin_checkout';

type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export function isAnalyticsEnabled() {
  return Boolean(GA_MEASUREMENT_ID);
}

export function trackPageView(path: string) {
  if (!isAnalyticsEnabled() || typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path
  });
}

export function trackEvent(name: AnalyticsEventName, params: AnalyticsEventParams = {}) {
  if (!isAnalyticsEnabled() || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', name, params);
}
