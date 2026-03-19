import { Badge } from '@/components/ui/badge';
import type { BriefPaymentStatus, BriefStatus } from '@/lib/types/brief';
import { cn } from '@/lib/utils/cn';

type StatusBadgeProps = {
  status: BriefStatus | BriefPaymentStatus;
  kind: 'brief' | 'payment';
};

const LABELS: Record<BriefStatus | BriefPaymentStatus, string> = {
  draft: 'draft',
  pending_payment: 'pending_payment',
  paid: 'paid',
  in_production: 'in_production',
  delivered: 'delivered',
  archived: 'archived',
  pending: 'unpaid',
  failed: 'failed',
  expired: 'expired'
};

const BASE_STYLES = 'border text-[11px] font-semibold uppercase tracking-wide';

const BRIEF_STYLES: Record<BriefStatus, string> = {
  draft: 'border-zinc-600/70 bg-zinc-700/25 text-zinc-200',
  pending_payment: 'border-amber-500/70 bg-amber-500/15 text-amber-200',
  paid: 'border-emerald-500/70 bg-emerald-500/15 text-emerald-200',
  in_production: 'border-sky-500/70 bg-sky-500/15 text-sky-200',
  delivered: 'border-indigo-500/70 bg-indigo-500/15 text-indigo-200',
  archived: 'border-zinc-500/70 bg-zinc-800/70 text-zinc-300'
};

const PAYMENT_STYLES: Record<BriefPaymentStatus, string> = {
  pending: 'border-amber-500/70 bg-amber-500/15 text-amber-200',
  paid: 'border-emerald-500/70 bg-emerald-500/15 text-emerald-200',
  failed: 'border-rose-500/70 bg-rose-500/15 text-rose-200',
  expired: 'border-zinc-600/70 bg-zinc-800/70 text-zinc-300'
};

export function StatusBadge({ status, kind }: StatusBadgeProps) {
  const tone = kind === 'brief' ? BRIEF_STYLES[status as BriefStatus] : PAYMENT_STYLES[status as BriefPaymentStatus];

  return <Badge className={cn(BASE_STYLES, tone)}>{LABELS[status] ?? status}</Badge>;
}
