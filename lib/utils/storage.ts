import { FORM_DRAFT_STORAGE_VERSION, FORM_STORAGE_KEYS } from '@/lib/constants/storage';
import { ClientFormData } from '@/lib/types/form';

type PersistedFormDraft = {
  version: number;
  data: ClientFormData;
  currentStepIndex: number;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPersistedFormDraft(value: unknown): value is PersistedFormDraft {
  if (!isObject(value)) {
    return false;
  }

  return (
    value.version === FORM_DRAFT_STORAGE_VERSION &&
    typeof value.currentStepIndex === 'number' &&
    Number.isFinite(value.currentStepIndex) &&
    isObject(value.data)
  );
}

function getLocalStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

function safeParseJson<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function readFormDraftFromStorage(): PersistedFormDraft | null {
  const localStorage = getLocalStorage();

  if (!localStorage) {
    return null;
  }

  try {
    const rawValue = localStorage.getItem(FORM_STORAGE_KEYS.draft);

    if (!rawValue) {
      return null;
    }

    const parsedValue = safeParseJson<unknown>(rawValue);

    if (!isPersistedFormDraft(parsedValue)) {
      return null;
    }

    return parsedValue;
  } catch {
    return null;
  }
}

export function saveFormDraftToStorage(payload: Omit<PersistedFormDraft, 'version'>) {
  const localStorage = getLocalStorage();

  if (!localStorage) {
    return;
  }

  const nextValue: PersistedFormDraft = {
    version: FORM_DRAFT_STORAGE_VERSION,
    ...payload
  };

  try {
    localStorage.setItem(FORM_STORAGE_KEYS.draft, JSON.stringify(nextValue));
  } catch {
    // Intentionally ignore persistence errors (private mode, quota exceeded, blocked storage, etc.)
  }
}

export function clearFormDraftFromStorage() {
  const localStorage = getLocalStorage();

  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(FORM_STORAGE_KEYS.draft);
  } catch {
    // Intentionally ignore cleanup errors.
  }
}

export function readBriefIdFromStorage(): string | null {
  const localStorage = getLocalStorage();

  if (!localStorage) {
    return null;
  }

  try {
    const briefId = localStorage.getItem(FORM_STORAGE_KEYS.briefId)?.trim();
    return briefId ? briefId : null;
  } catch {
    return null;
  }
}

export function saveBriefIdToStorage(briefId: string) {
  const localStorage = getLocalStorage();

  if (!localStorage) {
    return;
  }

  try {
    localStorage.setItem(FORM_STORAGE_KEYS.briefId, briefId);
  } catch {
    // Ignore storage errors.
  }
}

export function clearBriefIdFromStorage() {
  const localStorage = getLocalStorage();

  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(FORM_STORAGE_KEYS.briefId);
  } catch {
    // Ignore storage errors.
  }
}
