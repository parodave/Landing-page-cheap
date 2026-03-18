'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ActivityStep } from './steps/activity-step';
import { ContactDeliveryStep } from './steps/contact-delivery-step';
import { ContentStep } from './steps/content-step';
import { DesignStep } from './steps/design-step';
import { IdentityStep } from './steps/identity-step';
import { OfferStep } from './steps/offer-step';
import { SummaryStep } from './steps/summary-step';
import { FormData, INITIAL_FORM_DATA } from './steps/types';

type StepDefinition = {
  index: number;
  id: string;
  label: string;
  render: (props: {
    data: FormData;
    onSectionChange: <K extends keyof FormData>(section: K, field: keyof FormData[K], value: string) => void;
  }) => JSX.Element;
};

const STEP_DEFINITIONS: StepDefinition[] = [
  { index: 0, id: 'identity', label: 'Identité', render: ({ data, onSectionChange }) => <IdentityStep data={data} onSectionChange={onSectionChange} /> },
  { index: 1, id: 'activity', label: 'Activité', render: ({ data, onSectionChange }) => <ActivityStep data={data} onSectionChange={onSectionChange} /> },
  { index: 2, id: 'offer', label: 'Offre', render: ({ data, onSectionChange }) => <OfferStep data={data} onSectionChange={onSectionChange} /> },
  { index: 3, id: 'design', label: 'Design', render: ({ data, onSectionChange }) => <DesignStep data={data} onSectionChange={onSectionChange} /> },
  { index: 4, id: 'content', label: 'Contenu', render: ({ data, onSectionChange }) => <ContentStep data={data} onSectionChange={onSectionChange} /> },
  {
    index: 5,
    id: 'contact-delivery',
    label: 'Contact / livraison',
    render: ({ data, onSectionChange }) => <ContactDeliveryStep data={data} onSectionChange={onSectionChange} />
  },
  { index: 6, id: 'summary', label: 'Récapitulatif', render: ({ data }) => <SummaryStep data={data} /> }
];

export function FormShell() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentStep = STEP_DEFINITIONS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEP_DEFINITIONS.length - 1;

  const onSectionChange = <K extends keyof FormData>(section: K, field: keyof FormData[K], value: string) => {
    setFormData((previousData) => ({
      ...previousData,
      [section]: {
        ...previousData[section],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (isLastStep) {
      return;
    }

    setCurrentStepIndex((previousIndex) => previousIndex + 1);
  };

  const handlePrevious = () => {
    if (isFirstStep) {
      return;
    }

    setCurrentStepIndex((previousIndex) => previousIndex - 1);
  };

  const handleFrontOnlySubmit = () => {
    setIsSubmitted(true);
  };

  const completionLabel = useMemo(() => `${currentStepIndex + 1}/${STEP_DEFINITIONS.length}`, [currentStepIndex]);

  return (
    <Card className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Étape {completionLabel}</p>
        <h2 className="text-xl font-semibold text-foreground">{currentStep.label}</h2>
      </div>

      <ol className="grid gap-2 text-xs text-muted sm:grid-cols-2">
        {STEP_DEFINITIONS.map((step) => (
          <li key={step.id} className={step.index === currentStepIndex ? 'font-semibold text-foreground' : ''}>
            {step.index + 1}. {step.label}
          </li>
        ))}
      </ol>

      {currentStep.render({ data: formData, onSectionChange })}

      {isSubmitted && (
        <p className="rounded-md border border-border bg-background p-3 text-sm text-foreground">
          ✅ Merci ! Vos données ont été validées côté front uniquement.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isFirstStep}
          className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Précédent
        </button>

        {!isLastStep && (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex h-11 items-center justify-center rounded-md bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
          >
            Suivant
          </button>
        )}

        {isLastStep && (
          <button
            type="button"
            onClick={handleFrontOnlySubmit}
            className="inline-flex h-11 items-center justify-center rounded-md bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
          >
            Envoyer (front-only)
          </button>
        )}
      </div>
    </Card>
  );
}
