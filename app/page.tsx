import type { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Hero } from '@/components/marketing/hero';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Section } from '@/components/ui/section';
import { BENEFITS, FAQ_ITEMS, HOW_IT_WORKS, OFFER_INCLUDES, SITE_CONFIG } from '@/lib/constants/site';

export const metadata: Metadata = {
  title: 'Landing page pro à 10€',
  description: SITE_CONFIG.description,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Landing page pro à 10€',
    description: SITE_CONFIG.description,
    url: '/'
  }
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />

        <Section>
          <Container className="space-y-8">
            <Heading
              title="Pourquoi choisir Landing Express 10€"
              subtitle="Une offre claire, un prix fixe, une exécution rapide."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {BENEFITS.map((item) => (
                <Card key={item.title}>
                  <h3 className="text-lg font-medium text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted">{item.description}</p>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        <Section className="border-y border-white/10 bg-white/[0.02]">
          <Container className="space-y-8">
            <Heading
              title="Comment ça marche"
              subtitle="Vous répondez au formulaire, on s’occupe du reste."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {HOW_IT_WORKS.map((item) => (
                <Card key={item.title}>
                  <h3 className="text-base font-medium text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted">{item.description}</p>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        <Section>
          <Container className="space-y-8">
            <Heading
              title={`Offre unique à ${SITE_CONFIG.price}`}
              subtitle="Une base solide pour présenter votre activité et convertir vos premiers contacts."
            />
            <Card>
              <ul className="grid gap-3 md:grid-cols-2">
                {OFFER_INCLUDES.map((item) => (
                  <li key={item.title} className="rounded-lg border border-white/10 p-4">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-muted">{item.description}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </Container>
        </Section>

        <Section>
          <Container className="space-y-8">
            <Heading title="FAQ" subtitle="Réponses rapides avant de commencer." />
            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => (
                <Card key={item.question} className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground">{item.question}</h3>
                  <p className="text-sm text-muted">{item.answer}</p>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
