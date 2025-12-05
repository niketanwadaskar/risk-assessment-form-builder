// src/utils/localStorage.ts

import { FormValues, FormDraft, RiskScore } from '../types/form.types';
import { FORM_CONSTANTS } from './constants';

export const saveDraft = (
  formId: string,
  values: FormValues,
  riskScore?: RiskScore
): void => {
  const draft: FormDraft = {
    id: `${formId}_${Date.now()}`,
    formId,
    values,
    lastSaved: new Date(),
    riskScore,
  };

  const key = `${FORM_CONSTANTS.STORAGE_KEYS.FORM_DRAFT}${formId}`;
  localStorage.setItem(key, JSON.stringify(draft));
  localStorage.setItem(
    `${FORM_CONSTANTS.STORAGE_KEYS.LAST_SAVED}${formId}`,
    new Date().toISOString()
  );
};

export const loadDraft = (formId: string): FormDraft | null => {
  const key = `${FORM_CONSTANTS.STORAGE_KEYS.FORM_DRAFT}${formId}`;
  const data = localStorage.getItem(key);

  if (!data) return null;

  try {
    const draft = JSON.parse(data) as FormDraft;
    draft.lastSaved = new Date(draft.lastSaved);
    return draft;
  } catch {
    console.error('Failed to parse draft', data);
    return null;
  }
};

export const deleteDraft = (formId: string): void => {
  const key = `${FORM_CONSTANTS.STORAGE_KEYS.FORM_DRAFT}${formId}`;
  localStorage.removeItem(key);
  localStorage.removeItem(`${FORM_CONSTANTS.STORAGE_KEYS.LAST_SAVED}${formId}`);
};

export const getLastSaved = (formId: string): Date | null => {
  const key = `${FORM_CONSTANTS.STORAGE_KEYS.LAST_SAVED}${formId}`;
  const timestamp = localStorage.getItem(key);

  if (!timestamp) return null;

  try {
    return new Date(timestamp);
  } catch {
    return null;
  }
};

export const formatLastSaved = (date: Date | null): string => {
  if (!date) return 'Not saved';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return 'Just now';
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const clearFormData = (formId: string): void => {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.includes(formId)) {
      localStorage.removeItem(key);
    }
  });
};

export const getAllDrafts = (): FormDraft[] => {
  const drafts: FormDraft[] = [];
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    if (key.startsWith(FORM_CONSTANTS.STORAGE_KEYS.FORM_DRAFT)) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const draft = JSON.parse(data) as FormDraft;
          draft.lastSaved = new Date(draft.lastSaved);
          drafts.push(draft);
        }
      } catch {
        console.error('Failed to parse draft', key);
      }
    }
  });

  return drafts;
};