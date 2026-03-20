'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';

type TrackableCtaProps = {
  href: string;
  children: ReactNode;
  location: string;
  variant?: 'primary' | 'ghost';
  className?: string;
};

export function TrackableCta({ href, children, location, variant, className }: TrackableCtaProps) {
  return (
    <Button
      href={href}
      variant={variant}
      className={className}
      onClick={() => {
        trackEvent('cta_click', { location, href });
      }}
    >
      {children}
    </Button>
  );
}
