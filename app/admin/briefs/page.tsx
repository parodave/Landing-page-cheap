import { BriefsTable } from '@/components/admin/briefs-table';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { getAdminBriefs } from '@/lib/admin/get-admin-briefs';

export default async function AdminBriefsPage() {
  // NOTE: Route interne non protégée pour l'instant.
  // Ajouter une vraie protection (auth middleware / ACL) avant une mise en production publique.
  const briefs = await getAdminBriefs();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Section>
          <Container className="max-w-6xl space-y-8">
            <header className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Admin · Briefs & commandes</h1>
              <p className="max-w-3xl text-sm text-muted md:text-base">
                Vue interne minimaliste pour suivre les briefs créés, le statut de paiement et accéder rapidement aux pages utiles.
              </p>
            </header>

            <BriefsTable briefs={briefs} />
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
