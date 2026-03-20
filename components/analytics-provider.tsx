'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { GA_MEASUREMENT_ID, isAnalyticsEnabled, trackEvent, trackPageView } from '@/lib/analytics';

export function AnalyticsProvider() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastTrackedPath.current) {
      return;
    }

    lastTrackedPath.current = pathname;
    trackPageView(pathname);

    if (pathname === '/') {
      trackEvent('landing_view', { page: pathname });
    }

    if (pathname === '/succes') {
      trackEvent('payment_success', { page: pathname });
    }
  }, [pathname]);

  if (!isAnalyticsEnabled() || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });`}
      </Script>
    </>
  );
}
