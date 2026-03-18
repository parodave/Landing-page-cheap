import { Button } from '@/components/ui/button';

type StepNavigationProps = {
  canGoBack: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
  className?: string;
};

export function StepNavigation({ canGoBack, isLastStep, onBack, onNext, className }: StepNavigationProps) {
  return (
    <div className={className}>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="ghost" onClick={onBack} disabled={!canGoBack} className="w-full sm:w-auto">
          Précédent
        </Button>

        <Button type="button" onClick={onNext} className="w-full sm:w-auto">
          {isLastStep ? 'Terminer' : 'Suivant'}
        </Button>
      </div>
    </div>
  );
}
