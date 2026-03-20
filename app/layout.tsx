import type { Metadata } from 'next';
import './globals.css';
import { AnalyticsProvider } from '@/components/analytics-provider';
import { SITE_CONFIG } from '@/lib/constants/site';

const siteUrl = 'https://landing-express-10e.vercel.app';
const defaultOgImage = '/icon.svg';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`
  },
  description: SITE_CONFIG.description,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: siteUrl,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: defaultOgImage,
        width: 512,
        height: 512,
        alt: `${SITE_CONFIG.name} - aperçu`
      }
    ],
    type: 'website',
    locale: 'fr_FR'
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [defaultOgImage]
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AnalyticsProvider />
        <div className="relative flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
