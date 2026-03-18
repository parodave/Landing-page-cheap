import { Card } from '@/components/ui/card';
import type { InternalBrief } from '@/lib/types/internal-brief';

type InternalBriefViewProps = {
  internalBrief: InternalBrief;
  internalBriefText: string;
};

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-lg font-semibold text-zinc-100">{children}</h2>;
}

function ListOrFallback({ items, fallback }: { items: string[]; fallback: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-zinc-400">{fallback}</p>;
  }

  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-200">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function InternalBriefView({ internalBrief, internalBriefText }: InternalBriefViewProps) {
  return (
    <div className="space-y-6">
      <Card className="space-y-3 bg-zinc-950 text-zinc-100">
        <SectionTitle>Résumé</SectionTitle>
        <p className="text-sm text-zinc-200">
          <strong>{internalBrief.summary.clientName}</strong> — {internalBrief.summary.businessName} ({internalBrief.summary.activityType})
        </p>
        <p className="text-sm text-zinc-300">Objectif: {internalBrief.summary.mainGoal}</p>
        <p className="text-sm text-zinc-300">
          Paiement: {internalBrief.summary.paymentStatus} · Complétude: {internalBrief.summary.completionLevel}
        </p>
        <p className="text-sm text-zinc-300">Statut interne: {internalBrief.status}</p>
      </Card>

      <Card className="space-y-3 bg-zinc-950 text-zinc-100">
        <SectionTitle>Customer block</SectionTitle>
        <p className="text-sm text-zinc-300">Identité: {internalBrief.customerBlock.identity}</p>
        <p className="text-sm text-zinc-300">Email: {internalBrief.customerBlock.email}</p>
        <p className="text-sm text-zinc-300">Téléphone / WhatsApp: {internalBrief.customerBlock.phoneOrWhatsapp}</p>
      </Card>

      <Card className="space-y-3 bg-zinc-950 text-zinc-100">
        <SectionTitle>Business block</SectionTitle>
        <p className="text-sm text-zinc-300">Activité: {internalBrief.businessBlock.activity}</p>
        <p className="text-sm text-zinc-300">Cible: {internalBrief.businessBlock.targetAudience}</p>
        <p className="text-sm text-zinc-300">Promesse / objectif: {internalBrief.businessBlock.promiseOrObjective}</p>
      </Card>

      <Card className="space-y-3 bg-zinc-950 text-zinc-100">
        <SectionTitle>Offer block</SectionTitle>
        <p className="text-sm text-zinc-300">Offre principale: {internalBrief.offerBlock.mainOffer}</p>
        <p className="text-sm text-zinc-300">CTA principal: {internalBrief.offerBlock.primaryCTA}</p>
        <p className="text-sm text-zinc-300">Prix affiché: {internalBrief.offerBlock.showPrice}</p>
        <ListOrFallback items={internalBrief.offerBlock.secondaryServices} fallback="Aucun service secondaire." />
      </Card>

      <Card className="space-y-3 bg-zinc-950 text-zinc-100">
        <SectionTitle>Design block</SectionTitle>
        <p className="text-sm text-zinc-300">Style: {internalBrief.designBlock.desiredStyle}</p>
        <p className="text-sm text-zinc-300">Couleurs: {internalBrief.designBlock.colors}</p>
        <p className="text-sm text-zinc-300">
          Logo: {internalBrief.designBlock.hasLogo ? 'oui' : 'non'} · Photos: {internalBrief.designBlock.hasPhotos ? 'oui' : 'non'}
        </p>
        <ListOrFallback items={internalBrief.designBlock.inspirations} fallback="Aucune inspiration partagée." />
      </Card>

      <Card className="space-y-3 bg-zinc-950 text-zinc-100">
        <SectionTitle>Content block</SectionTitle>
        <p className="text-sm text-zinc-300">Titre principal: {internalBrief.contentBlock.heroTitle}</p>
        <p className="text-sm text-zinc-300">Sous-titre: {internalBrief.contentBlock.subtitle}</p>
        <ListOrFallback items={internalBrief.contentBlock.keyArguments} fallback="Arguments clés non renseignés." />
        <p className="text-sm text-zinc-300">
          FAQ: {internalBrief.contentBlock.hasFAQ ? 'oui' : 'non'} · Témoignages: {internalBrief.contentBlock.hasTestimonials ? 'oui' : 'non'}
        </p>
        <ListOrFallback items={internalBrief.contentBlock.mandatoryInformation} fallback="Aucune information obligatoire listée." />
      </Card>

      <Card className="space-y-3 bg-zinc-950 text-zinc-100">
        <SectionTitle>Contact & Assets</SectionTitle>
        <p className="text-sm text-zinc-300">Domaine: {internalBrief.contactBlock.domainStatus}</p>
        <ListOrFallback items={internalBrief.contactBlock.publicContacts} fallback="Aucun contact public." />
        <ListOrFallback items={internalBrief.contactBlock.socialLinks} fallback="Aucun réseau social." />
        <p className="text-sm text-zinc-300">État des ressources: {internalBrief.assetsBlock.resourcesStatus}</p>
        <ListOrFallback items={internalBrief.assetsBlock.logoFileNames} fallback="Aucun logo uploadé." />
        <ListOrFallback items={internalBrief.assetsBlock.photoFileNames} fallback="Aucune photo uploadée." />
      </Card>

      <Card className="space-y-3 bg-zinc-950 text-zinc-100">
        <SectionTitle>Production checklist</SectionTitle>
        <ul className="space-y-2 text-sm text-zinc-200">
          {internalBrief.productionChecklist.map((item) => (
            <li key={item.label}>
              {item.isReady ? '✅' : '⚠️'} {item.label} — {item.note}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-3 bg-zinc-950 text-zinc-100">
        <SectionTitle>Warnings & missing elements</SectionTitle>
        <ListOrFallback items={internalBrief.warnings} fallback="Aucun warning." />
        <ListOrFallback items={internalBrief.missingElements} fallback="Aucun élément manquant." />
        <p className="text-sm text-zinc-300">CTA recommandé: {internalBrief.recommendedCTA}</p>
        <ListOrFallback items={internalBrief.recommendedSections} fallback="Aucune section recommandée." />
      </Card>

      <Card className="space-y-3 bg-zinc-950 text-zinc-100">
        <SectionTitle>Sortie texte réutilisable</SectionTitle>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-xs text-zinc-200">
          {internalBriefText}
        </pre>
      </Card>
    </div>
  );
}
