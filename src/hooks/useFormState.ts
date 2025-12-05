// src/hooks/useFormState.ts

import { useState, useCallback, useEffect } from 'react';
import { FormValues, FormQuestion, FormSection, FieldError } from '../types/form.types';
import { validateField, validateForm } from '../utils/validation';
import { loadDraft } from '../utils/localStorage';

interface UseFormStateReturn {
  values: FormValues;
  errors: FieldError;
  touched: Set<string>;
  isDirty: boolean;
  setValue: (fieldId: string, value: any) => void;
  setValues: (values: FormValues) => void;
  setError: (fieldId: string, error: string | null) => void;
  touchField: (fieldId: string) => void;
  resetForm: () => void;
  validateAllFields: () => boolean;
}

export const useFormState = (
  formId: string,
  initialValues: FormValues = {},
  questions: FormQuestion[] = [],
  loadFromStorage = true
): UseFormStateReturn => {
  const [values, setValues] = useState<FormValues>(() => {
    if (loadFromStorage) {
      const draft = loadDraft(formId);
      if (draft) return draft.values;
    }
    return initialValues;
  });

  const [errors, setErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isDirty, setIsDirty] = useState(false);

  // Update field value
  const setValue = useCallback(
    (fieldId: string, value: any) => {
      setValues((prev) => {
        const updated = { ...prev, [fieldId]: value };
        return updated;
      });
      setIsDirty(true);

      // Validate field on change
      const question = questions.find((q) => q.id === fieldId);
      if (question) {
        const error = validateField(value, question);
        setErrors((prev) => {
          const updated = { ...prev };
          if (error) {
            updated[fieldId] = error;
          } else {
            delete updated[fieldId];
          }
          return updated;
        });
      }
    },
    [questions]
  );

  // Update multiple values
  const updateValues = useCallback((newValues: FormValues) => {
    setValues((prev) => ({ ...prev, ...newValues }));
    setIsDirty(true);
  }, []);

  // Mark field as touched
  const touchField = useCallback((fieldId: string) => {
    setTouched((prev) => {
      const newSet = new Set(prev);
      newSet.add(fieldId);
      return newSet;
    });
  }, []);

  // Validate all fields
  const validateAllFields = useCallback((): boolean => {
    const formErrors = validateForm(values, questions);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }, [values, questions]);

  // Set specific error
  const setError = useCallback((fieldId: string, error: string | null) => {
    setErrors((prev) => {
      const updated = { ...prev };
      if (error) {
        updated[fieldId] = error;
      } else {
        delete updated[fieldId];
      }
      return updated;
    });
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched(new Set());
    setIsDirty(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isDirty,
    setValue,
    setValues: updateValues,
    setError,
    touchField,
    resetForm,
    validateAllFields,
  };
};