'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { FormProgress } from '@/components/form/form-progress';
import { StepNavigation } from '@/components/form/step-navigation';
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
  description: string;
  render: (props: {
    data: FormData;
    onSectionChange: <K extends keyof FormData>(
      section: K,
      field: keyof FormData[K],
      value: string
    ) => void;
  }) => JSX.Element;
};

const STEP_DEFINITIONS: StepDefinition[] = [
  {
    index: 0,
    id: 'identity',
    label: 'Identité',
    description: 'Renseignez vos informations de contact et le nom de votre activité.',
    render: ({ data, onSectionChange }) => (
      <IdentityStep data={data} onSectionChange={onSectionChange} />
    )
  },
  {
    index: 1,
    id: 'activity',
    label: 'Activité',
    description: 'Décrivez votre activité, votre cible et l’objectif principal de votre page.',
    render: ({ data, onSectionChange }) => (
      <ActivityStep data={data} onSectionChange={onSectionChange} />
    )
  },
  {
    index: 2,
    id: 'offer',
    label: 'Offre',
    description: 'Précisez votre offre principale, vos services et votre appel à l’action.',
    render: ({ data, onSectionChange }) => (
      <OfferStep data={data} onSectionChange={onSectionChange} />
    )
  },
  {
    index: 3,
    id: 'design',
    label: 'Design',
    description: 'Indiquez vos préférences visuelles, inspirations et ressources disponibles.',
    render: ({ data, onSectionChange }) => (
      <DesignStep data={data} onSectionChange={onSectionChange} />
    )
  },
  {
    index: 4,
    id: 'content',
    label: 'Contenu',
    description: 'Ajoutez les textes, arguments clés et informations à afficher sur la page.',
    render: ({ data, onSectionChange }) => (
      <ContentStep data={data} onSectionChange={onSectionChange} />
    )
  },
  {
    index: 5,
    id: 'contact-delivery',
    label: 'Contact / livraison',
    description: 'Renseignez les coordonnées publiques et les informations liées au domaine.',
    render: ({ data, onSectionChange }) => (
      <ContactDeliveryStep data={data} onSectionChange={onSectionChange} />
    )
  },
  {
    index: 6,
    id: 'summary',
    label: 'Récapitulatif',
    description: 'Vérifiez l’ensemble de vos réponses avant validation.',
    render: ({ data }) => <SummaryStep data={data} />
  }
];

export function FormShell() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalSteps = STEP_DEFINITIONS.length;
  const currentStepNumber = currentStepIndex + 1;
  const currentStep = STEP_DEFINITIONS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const onSectionChange = <K extends keyof FormData>(
    section: K,
    field: keyof FormData[K],
    value: string
  ) => {
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

  const progressLabel = useMemo(
    () => `${currentStepNumber}/${totalSteps}`,
    [currentStepNumber, totalSteps]
  );

  return (
    <Card className="space-y-6 bg-zinc-950 text-zinc-100">
      <FormProgress currentStep={currentStepNumber} totalSteps={totalSteps} />

      <div className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          Étape {progressLabel}
        </p>
        <h2 className="text-xl font-semibold text-zinc-100">{currentStep.label}</h2>
        <p className="text-sm text-zinc-300">{currentStep.description}</p>
      </div>

      <ol className="grid gap-2 text-xs text-zinc-400 sm:grid-cols-2">
        {STEP_DEFINITIONS.map((step) => (
          <li
            key={step.id}
            className={step.index === currentStepIndex ? 'font-semibold text-zinc-100' : ''}
          >
            {step.index + 1}. {step.label}
          </li>
        ))}
      </ol>

      {currentStep.render({ data: formData, onSectionChange })}

      {isSubmitted && (
        <p className="rounded-md border border-zinc-800 bg-zinc-900/60 p-3 text-sm text-zinc-100">
          Merci. Vos données ont été validées côté front uniquement.
        </p>
      )}

      <StepNavigation
        canGoBack={!isFirstStep}
        isLastStep={isLastStep}
        onBack={handlePrevious}
        onNext={isLastStep ? handleFrontOnlySubmit : handleNext}
      />
    </Card>
  );
}