import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/admin/status-badge';
import type { AdminBriefRow } from '@/lib/admin/get-admin-briefs';

type BriefsTableProps = {
  briefs: AdminBriefRow[];
};

function valueOrFallback(value: string) {
  return value.trim() || '—';
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date inconnue';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

function formatAmount(amount: number | null, currency: string | null) {
  if (amount === null) {
    return '—';
  }

  const safeCurrency = (currency ?? 'EUR').toUpperCase();

  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: safeCurrency
    }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)} ${safeCurrency}`;
  }
}

function QuickLinks({ row }: { row: AdminBriefRow }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link className="text-xs text-zinc-200 underline-offset-2 hover:underline" href={row.briefUrl}>
        Voir brief
      </Link>
      <span className="text-zinc-700">•</span>
      <Link className="text-xs text-zinc-200 underline-offset-2 hover:underline" href={row.promptUrl}>
        Voir prompt
      </Link>
      <span className="text-zinc-700">•</span>
      <Link className="text-xs text-zinc-200 underline-offset-2 hover:underline" href={row.pdfUrl} target="_blank" rel="noreferrer">
        Ouvrir PDF
      </Link>
    </div>
  );
}

export function BriefsTable({ briefs }: BriefsTableProps) {
  if (briefs.length === 0) {
    return (
      <Card className="space-y-2 bg-zinc-950 text-zinc-100">
        <h2 className="text-lg font-semibold">Aucun brief pour le moment</h2>
        <p className="text-sm text-muted">Les nouveaux briefs et commandes apparaîtront ici dès leur création.</p>
      </Card>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Brief</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Activité</th>
                <th className="px-4 py-3 font-medium">Statut brief</th>
                <th className="px-4 py-3 font-medium">Paiement</th>
                <th className="px-4 py-3 font-medium">Montant</th>
                <th className="px-4 py-3 font-medium">Liens</th>
              </tr>
            </thead>
            <tbody>
              {briefs.map((row) => (
                <tr key={row.briefId} className="border-t border-border/80 align-top">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-300">{row.briefId}</td>
                  <td className="px-4 py-3 text-zinc-300">{formatDate(row.createdAt)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-100">{valueOrFallback(row.customerName)}</p>
                    <p className="text-xs text-zinc-400">{valueOrFallback(row.customerEmail)}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-200">{valueOrFallback(row.businessName)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.briefStatus} kind="brief" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.paymentStatus} kind="payment" />
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{formatAmount(row.amountTotal, row.currency)}</td>
                  <td className="px-4 py-3">
                    <QuickLinks row={row} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {briefs.map((row) => (
          <Card key={row.briefId} className="space-y-4 bg-zinc-950 p-4 text-zinc-100">
            <div className="space-y-1">
              <p className="font-mono text-xs text-zinc-400">{row.briefId}</p>
              <p className="text-xs text-zinc-500">{formatDate(row.createdAt)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">Client</p>
                <p className="font-medium text-zinc-100">{valueOrFallback(row.customerName)}</p>
                <p className="text-xs text-zinc-400">{valueOrFallback(row.customerEmail)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">Activité</p>
                <p className="font-medium text-zinc-100">{valueOrFallback(row.businessName)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">Statut brief</p>
                <StatusBadge status={row.briefStatus} kind="brief" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">Paiement</p>
                <StatusBadge status={row.paymentStatus} kind="payment" />
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Montant</p>
                <p className="text-zinc-200">{formatAmount(row.amountTotal, row.currency)}</p>
              </div>
            </div>

            <QuickLinks row={row} />
          </Card>
        ))}
      </div>
    </>
  );
}
