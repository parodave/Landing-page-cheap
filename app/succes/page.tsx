import { PageShell } from '@/components/shared/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SuccesPage() {
  return (
    <PageShell
      title="Paiement reçu"
      description="Merci pour votre commande Landing Express 10€. Nous confirmons le paiement côté serveur."
    >
      <Card className="space-y-4 bg-zinc-950 text-zinc-100">
        <p className="text-sm text-zinc-300">
          Nous avons bien reçu votre retour de paiement. La confirmation finale est en cours côté serveur pour sécuriser
          votre commande.
        </p>
        <p className="text-sm text-zinc-300">
          Une fois validée, nous lançons la préparation de votre landing page 1 page. Livraison prévue sous 24h avec
          hébergement inclus.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/">Retour à l’accueil</Button>
          <Button href="/formulaire" variant="ghost">
            Revenir au formulaire
          </Button>
        </div>
      </Card>
    </PageShell>
  );
}
