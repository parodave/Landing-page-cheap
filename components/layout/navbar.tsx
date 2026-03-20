import Link from 'next/link';
import { MAIN_NAVIGATION, SITE_CONFIG } from '@/lib/constants/site';
import { Container } from '@/components/ui/container';
import { TrackableCta } from '@/components/analytics/trackable-cta';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-wide text-foreground">
          {SITE_CONFIG.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation principale">
          {MAIN_NAVIGATION.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <TrackableCta href="/formulaire" className="h-10 px-4 text-xs sm:text-sm" location="navbar_cta">
          Commencer
        </TrackableCta>
      </Container>
    </header>
  );
}
