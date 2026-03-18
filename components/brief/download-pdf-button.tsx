import { cn } from '@/lib/utils/cn';

type DownloadPdfButtonProps = {
  briefId: string;
  className?: string;
  label?: string;
};

export function DownloadPdfButton({ briefId, className, label = 'Ouvrir le PDF' }: DownloadPdfButtonProps) {
  return (
    <a
      href={`/api/briefs/${briefId}/pdf`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex h-11 items-center justify-center rounded-md border border-border bg-transparent px-5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
        className
      )}
    >
      {label}
    </a>
  );
}
