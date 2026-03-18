'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { FormProgress } from '@/components/form/form-progress';
import { StepNavigation } from '@/components/form/step-navigation';

type FormStep = {
  title: string;
  description: string;
};

const FORM_STEPS: FormStep[] = [
  {
    title: 'Votre activité',
    description: 'Décrivez votre entreprise, votre cible et votre proposition de valeur.'
  },
  {
    title: 'Votre offre',
    description: 'Précisez vos services, vos tarifs et les éléments clés de conversion.'
  },
  {
    title: 'Objectifs et contenus',
    description: 'Indiquez vos objectifs et les ressources nécessaires pour finaliser votre page.'
  }
];

export function FormShell() {
  const [stepIndex, setStepIndex] = useState(0);

  const totalSteps = FORM_STEPS.length;
  const currentStep = stepIndex + 1;
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;

  const activeStep = useMemo(() => FORM_STEPS[stepIndex], [stepIndex]);

  const goToPrevious = () => {
    if (isFirstStep) return;
    setStepIndex((prev) => prev - 1);
  };

  const goToNext = () => {
    if (isLastStep) {
      return;
    }

    setStepIndex((prev) => prev + 1);
  };

  return (
    <Card className="space-y-6 bg-zinc-950 text-zinc-100">
      <FormProgress currentStep={currentStep} totalSteps={totalSteps} />

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
        <h2 className="text-lg font-semibold">{activeStep.title}</h2>
        <p className="mt-2 text-sm text-zinc-300">{activeStep.description}</p>
      </div>

      <StepNavigation canGoBack={!isFirstStep} isLastStep={isLastStep} onBack={goToPrevious} onNext={goToNext} />
    </Card>
  );
}
