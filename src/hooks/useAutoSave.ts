// src/hooks/useAutoSave.ts

import { useEffect, useRef, useCallback } from 'react';
import { FormValues, RiskScore } from '../types/form.types';
import { saveDraft, getLastSaved } from '../utils/localStorage';
import { FORM_CONSTANTS } from '../utils/constants';

interface UseAutoSaveReturn {
  lastSaved: Date | null;
  isSaving: boolean;
  manualSave: () => void;
}

export const useAutoSave = (
  formId: string,
  values: FormValues,
  isDirty: boolean,
  riskScore?: RiskScore,
  interval: number = FORM_CONSTANTS.AUTO_SAVE_INTERVAL
): UseAutoSaveReturn => {
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<Date | null>(null);
  const isSavingRef = useRef(false);

  const manualSave = useCallback(() => {
    if (isDirty && !isSavingRef.current) {
      isSavingRef.current = true;
      saveDraft(formId, values, riskScore);
      lastSaveRef.current = new Date();
      // Reset saving flag after a delay
      setTimeout(() => {
        isSavingRef.current = false;
      }, 500);
    }
  }, [formId, values, isDirty, riskScore]);

  // Auto-save effect
  useEffect(() => {
    // Load last saved time
    const savedTime = getLastSaved(formId);
    if (savedTime) {
      lastSaveRef.current = savedTime;
    }

    // Set up auto-save timer
    if (isDirty) {
      autoSaveTimerRef.current = setInterval(() => {
        manualSave();
      }, interval);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [formId, isDirty, interval, manualSave]);

  return {
    lastSaved: lastSaveRef.current,
    isSaving: isSavingRef.current,
    manualSave,
  };
};