'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { FormProgress } from '@/components/form/form-progress';
import { StepNavigation } from '@/components/form/step-navigation';
import { Button } from '@/components/ui/button';
import { FormStepDefinition, FormStepKey } from '@/lib/types/form';
import { clientFormSchema } from '@/lib/validations/form';
import {
  clearBriefIdFromStorage,
  clearFormDraftFromStorage,
  readBriefIdFromStorage,
  readFormDraftFromStorage,
  saveBriefIdToStorage,
  saveFormDraftToStorage
} from '@/lib/utils/storage';
import { LANDING_EXPRESS_PAYMENT } from '@/lib/constants/payment';
import { ActivityStep } from './steps/activity-step';
import { ContactDeliveryStep } from './steps/contact-delivery-step';
import { ContentStep } from './steps/content-step';
import { DesignStep } from './steps/design-step';
import { IdentityStep } from './steps/identity-step';
import { OfferStep } from './steps/offer-step';
import { ReviewStep } from './steps/review-step';
import { FormData, FormFilesData, INITIAL_FORM_DATA, INITIAL_FORM_FILES } from './steps/types';

type StepDefinition = FormStepDefinition & {
  render: (props: {
    data: FormData;
    files: FormFilesData;
    onSectionChange: <K extends keyof FormData>(
      section: K,
      field: keyof FormData[K],
      value: string
    ) => void;
    onFilesChange: (field: keyof FormFilesData, files: File[]) => void;
    onEditSection: (step: FormStepKey) => void;
  }) => JSX.Element;
};

const STEP_DEFINITIONS: StepDefinition[] = [
  {
    index: 0,
    key: 'identity',
    title: 'Identité',
    description: 'Renseignez vos informations de contact et le nom de votre activité.',
    render: ({ data, files, onSectionChange, onFilesChange }) => (
      <IdentityStep
        data={data}
        files={files}
        onSectionChange={onSectionChange}
        onFilesChange={onFilesChange}
      />
    )
  },
  {
    index: 1,
    key: 'business',
    title: 'Activité',
    description: 'Décrivez votre activité, votre cible et l’objectif principal de votre page.',
    render: ({ data, files, onSectionChange, onFilesChange }) => (
      <ActivityStep
        data={data}
        files={files}
        onSectionChange={onSectionChange}
        onFilesChange={onFilesChange}
      />
    )
  },
  {
    index: 2,
    key: 'offer',
    title: 'Offre',
    description: 'Précisez votre offre principale, vos services et votre appel à l’action.',
    render: ({ data, files, onSectionChange, onFilesChange }) => (
      <OfferStep data={data} files={files} onSectionChange={onSectionChange} onFilesChange={onFilesChange} />
    )
  },
  {
    index: 3,
    key: 'design',
    title: 'Design',
    description: 'Indiquez vos préférences visuelles, inspirations et ressources disponibles.',
    render: ({ data, files, onSectionChange, onFilesChange }) => (
      <DesignStep
        data={data}
        files={files}
        onSectionChange={onSectionChange}
        onFilesChange={onFilesChange}
      />
    )
  },
  {
    index: 4,
    key: 'content',
    title: 'Contenu',
    description: 'Ajoutez les textes, arguments clés et informations à afficher sur la page.',
    render: ({ data, files, onSectionChange, onFilesChange }) => (
      <ContentStep
        data={data}
        files={files}
        onSectionChange={onSectionChange}
        onFilesChange={onFilesChange}
      />
    )
  },
  {
    index: 5,
    key: 'contact',
    title: 'Contact / livraison',
    description: 'Renseignez les coordonnées publiques et les informations liées au domaine.',
    render: ({ data, files, onSectionChange, onFilesChange }) => (
      <ContactDeliveryStep
        data={data}
        files={files}
        onSectionChange={onSectionChange}
        onFilesChange={onFilesChange}
      />
    )
  },
  {
    index: 6,
    key: 'review',
    title: 'Récapitulatif',
    description: 'Vérifiez l’ensemble de vos réponses avant validation.',
    render: ({ data, onEditSection }) => <ReviewStep data={data} onEditSection={onEditSection} />
  }
];

function mergeFormDataWithInitial(data: Partial<FormData>): FormData {
  return {
    identity: {
      ...INITIAL_FORM_DATA.identity,
      ...data.identity
    },
    business: {
      ...INITIAL_FORM_DATA.business,
      ...data.business
    },
    offer: {
      ...INITIAL_FORM_DATA.offer,
      ...data.offer
    },
    design: {
      ...INITIAL_FORM_DATA.design,
      ...data.design
    },
    content: {
      ...INITIAL_FORM_DATA.content,
      ...data.content
    },
    contact: {
      ...INITIAL_FORM_DATA.contact,
      ...data.contact
    }
  };
}

function getFirstValidationErrorMessage(data: FormData) {
  const validationResult = clientFormSchema.safeParse(data);

  if (validationResult.success) {
    return null;
  }

  return validationResult.error.issues[0]?.message ?? 'Veuillez compléter correctement les champs requis.';
}

function toAssetFileNames(files: File[]): string[] {
  return files.map((file) => file.name).filter((fileName) => fileName.trim().length > 0);
}

export function FormShell() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [formFiles, setFormFiles] = useState<FormFilesData>(INITIAL_FORM_FILES);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [hasHydratedFromStorage, setHasHydratedFromStorage] = useState(false);
  const [briefId, setBriefId] = useState<string | null>(null);

  const totalSteps = STEP_DEFINITIONS.length;
  const currentStepNumber = currentStepIndex + 1;
  const currentStep = STEP_DEFINITIONS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  useEffect(() => {
    const persistedDraft = readFormDraftFromStorage();

    if (persistedDraft) {
      setFormData(mergeFormDataWithInitial(persistedDraft.data));

      setCurrentStepIndex(() => {
        const maxStepIndex = totalSteps - 1;

        if (persistedDraft.currentStepIndex < 0) {
          return 0;
        }

        if (persistedDraft.currentStepIndex > maxStepIndex) {
          return maxStepIndex;
        }

        return persistedDraft.currentStepIndex;
      });
    }

    setBriefId(readBriefIdFromStorage());
    setHasHydratedFromStorage(true);
  }, [totalSteps]);

  useEffect(() => {
    if (!hasHydratedFromStorage) {
      return;
    }

    saveFormDraftToStorage({
      data: formData,
      currentStepIndex
    });
  }, [currentStepIndex, formData, hasHydratedFromStorage]);

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

    setCheckoutError(null);
    setIsSubmitted(false);
  };

  const onFilesChange = (field: keyof FormFilesData, files: File[]) => {
    setFormFiles((previousFiles) => ({
      ...previousFiles,
      [field]: files
    }));
  };

  const handleNext = () => {
    if (isLastStep || isCreatingCheckoutSession) {
      return;
    }

    setCurrentStepIndex((previousIndex) => previousIndex + 1);
  };

  const handlePrevious = () => {
    if (isFirstStep || isCreatingCheckoutSession) {
      return;
    }

    setCurrentStepIndex((previousIndex) => previousIndex - 1);
    setCheckoutError(null);
  };

  const createOrUpdateBrief = async () => {
    const briefResponse = await fetch('/api/briefs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        briefId: briefId ?? undefined,
        formData,
        assets: {
          logoFileNames: toAssetFileNames(formFiles.logo),
          photoFileNames: toAssetFileNames(formFiles.photos)
        }
      })
    });

    const briefPayload = (await briefResponse.json()) as { error?: string; briefId?: string };

    if (!briefResponse.ok || !briefPayload.briefId) {
      throw new Error(briefPayload.error ?? 'Impossible de sauvegarder le brief client.');
    }

    setBriefId(briefPayload.briefId);
    saveBriefIdToStorage(briefPayload.briefId);

    return briefPayload.briefId;
  };

  const handleStartCheckout = async () => {
    if (isCreatingCheckoutSession) {
      return;
    }

    const validationError = getFirstValidationErrorMessage(formData);

    if (validationError) {
      setCheckoutError(validationError);
      return;
    }

    setCheckoutError(null);
    setIsSubmitted(false);
    setIsCreatingCheckoutSession(true);

    try {
      const persistedBriefId = await createOrUpdateBrief();

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerEmail: formData.contact.email,
          businessName: formData.identity.brandName,
          briefId: persistedBriefId
        })
      });

      const payload = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? 'Impossible de créer la session de paiement.');
      }

      window.location.assign(payload.url);
    } catch (error) {
      const fallbackErrorMessage = 'Le paiement n’a pas pu être lancé. Veuillez réessayer dans un instant.';
      setCheckoutError(error instanceof Error ? error.message : fallbackErrorMessage);
      setIsCreatingCheckoutSession(false);
    }
  };

  const handleResetForm = () => {
    if (isCreatingCheckoutSession) {
      return;
    }

    setFormData(INITIAL_FORM_DATA);
    setFormFiles(INITIAL_FORM_FILES);
    setCurrentStepIndex(0);
    setIsSubmitted(false);
    setCheckoutError(null);
    setBriefId(null);
    clearFormDraftFromStorage();
    clearBriefIdFromStorage();
  };

  const handleEditSection = (step: FormStepKey) => {
    if (isCreatingCheckoutSession) {
      return;
    }

    const targetStepIndex = STEP_DEFINITIONS.findIndex((definition) => definition.key === step);

    if (targetStepIndex === -1 || targetStepIndex === currentStepIndex) {
      return;
    }

    setCurrentStepIndex(targetStepIndex);
    setIsSubmitted(false);
    setCheckoutError(null);
  };

  const progressLabel = useMemo(
    () => `${currentStepNumber}/${totalSteps}`,
    [currentStepNumber, totalSteps]
  );

  const [wasPaymentCancelled, setWasPaymentCancelled] = useState(false);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    setWasPaymentCancelled(search.get('payment') === 'cancelled');
  }, []);

  return (
    <Card className="space-y-6 bg-zinc-950 text-zinc-100">
      <FormProgress currentStep={currentStepNumber} totalSteps={totalSteps} />

      <div className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          Étape {progressLabel}
        </p>
        <h2 className="text-xl font-semibold text-zinc-100">{currentStep.title}</h2>
        <p className="text-sm text-zinc-300">{currentStep.description}</p>
      </div>

      <ol className="grid gap-2 text-xs text-zinc-400 sm:grid-cols-2">
        {STEP_DEFINITIONS.map((step) => (
          <li
            key={step.key}
            className={step.index === currentStepIndex ? 'font-semibold text-zinc-100' : ''}
          >
            {step.index + 1}. {step.title}
          </li>
        ))}
      </ol>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          className="h-8 px-3 text-xs text-zinc-400"
          onClick={handleResetForm}
          disabled={isCreatingCheckoutSession}
        >
          Réinitialiser le formulaire
        </Button>
      </div>

      {currentStep.render({
        data: formData,
        files: formFiles,
        onSectionChange,
        onFilesChange,
        onEditSection: handleEditSection
      })}

      {wasPaymentCancelled && (
        <p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
          Paiement annulé. Vous pouvez reprendre votre formulaire et relancer le paiement quand vous êtes prêt.
        </p>
      )}

      {isSubmitted && (
        <p className="rounded-md border border-zinc-800 bg-zinc-900/60 p-3 text-sm text-zinc-100">
          Merci. Vos données ont été validées côté front uniquement.
        </p>
      )}

      {checkoutError && (
        <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
          {checkoutError}
        </p>
      )}

      <StepNavigation
        canGoBack={!isFirstStep}
        isLastStep={isLastStep}
        onBack={handlePrevious}
        onNext={isLastStep ? handleStartCheckout : handleNext}
        isLoading={isCreatingCheckoutSession}
        nextLabel={
          isLastStep
            ? `Payer ${LANDING_EXPRESS_PAYMENT.amountInCents / 100} €`
            : undefined
        }
        loadingLabel="Redirection vers le paiement..."
      />
    </Card>
  );
}
