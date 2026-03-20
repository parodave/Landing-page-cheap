'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export function FormOpenTracker() {
  useEffect(() => {
    trackEvent('form_open', { page: '/formulaire' });
  }, []);

  return null;
}
