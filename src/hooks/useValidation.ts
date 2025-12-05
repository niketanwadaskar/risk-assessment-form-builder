// src/hooks/useValidation.ts

import { useCallback } from 'react';
import { FormQuestion, FormValues, FieldError } from '../types/form.types';
import { validateField, validateForm, isFormValid } from '../utils/validation';

interface UseValidationReturn {
  validateField: (fieldId: string, value: any) => string | null;
  validateAllFields: (values: FormValues) => FieldError;
  getFieldError: (fieldId: string, errors: FieldError) => string | null;
  hasErrors: (errors: FieldError) => boolean;
}

export const useValidation = (questions: FormQuestion[]): UseValidationReturn => {
  // Find question by ID
  const getQuestion = useCallback(
    (fieldId: string): FormQuestion | undefined => {
      return questions.find((q) => q.id === fieldId);
    },
    [questions]
  );

  // Validate single field
  const validateSingleField = useCallback(
    (fieldId: string, value: any): string | null => {
      const question = getQuestion(fieldId);
      if (!question) return null;
      return validateField(value, question);
    },
    [getQuestion]
  );

  // Validate all fields
  const validateAllFields = useCallback(
    (values: FormValues): FieldError => {
      return validateForm(values, questions);
    },
    [questions]
  );

  // Get error for specific field
  const getFieldError = useCallback(
    (fieldId: string, errors: FieldError): string | null => {
      return errors[fieldId] || null;
    },
    []
  );

  // Check if form has any errors
  const hasErrors = useCallback((errors: FieldError): boolean => {
    return !isFormValid(errors);
  }, []);

  return {
    validateField: validateSingleField,
    validateAllFields,
    getFieldError,
    hasErrors,
  };
};