import { cn } from '@/lib/utils/cn';

type FormProgressProps = {
  currentStep: number;
  totalSteps: number;
  className?: string;
};

export function FormProgress({ currentStep, totalSteps, className }: FormProgressProps) {
  const progress = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
        <span className="font-medium text-zinc-100">Progression</span>
        <span className="text-zinc-400">
          Étape {currentStep} / {totalSteps}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800" aria-hidden="true">
        <div
          className="h-full rounded-full bg-zinc-100 transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-zinc-500">Suivez chaque étape pour finaliser votre formulaire.</p>
    </div>
  );
}
