// src/hooks/useConditionalLogic.ts

import { useMemo, useCallback } from 'react';
import { FormQuestion, FormValues, ConditionalLogic } from '../types/form.types';

interface UseConditionalLogicReturn {
  isFieldVisible: (question: FormQuestion) => boolean;
  getVisibleQuestions: (questions: FormQuestion[]) => FormQuestion[];
  evaluateCondition: (condition: ConditionalLogic, values: FormValues) => boolean;
}

export const useConditionalLogic = (
  values: FormValues
): UseConditionalLogicReturn => {
  // Evaluate a single conditional logic
  const evaluateCondition = useCallback(
    (condition: ConditionalLogic, formValues: FormValues): boolean => {
      if (!condition) return true;

      const { questionId, answer, operator = 'equals' } = condition;
      const fieldValue = formValues[questionId];

      switch (operator) {
        case 'equals':
          if (Array.isArray(answer)) {
            return Array.isArray(fieldValue)
              ? answer.some((a) => fieldValue.includes(a))
              : answer.includes(fieldValue);
          }
          return fieldValue === answer;

        case 'contains':
          if (Array.isArray(fieldValue)) {
            return fieldValue.some((v) =>
              String(v).toLowerCase().includes(String(answer).toLowerCase())
            );
          }
          return String(fieldValue)
            .toLowerCase()
            .includes(String(answer).toLowerCase());

        case 'notEquals':
          return fieldValue !== answer;

        default:
          return true;
      }
    },
    []
  );

  // Check if field should be visible
  const isFieldVisible = useCallback(
    (question: FormQuestion): boolean => {
      if (!question.conditional) {
        return true;
      }
      return evaluateCondition(question.conditional, values);
    },
    [values, evaluateCondition]
  );

  // Get all visible questions
  const getVisibleQuestions = useCallback(
    (questions: FormQuestion[]): FormQuestion[] => {
      return questions.filter((q) => isFieldVisible(q));
    },
    [isFieldVisible]
  );

  // Memoize visibility status for all questions
  const visibilityMap = useMemo(() => {
    const map = new Map<string, boolean>();
    // This will be updated dynamically based on form changes
    return map;
  }, []);

  return {
    isFieldVisible,
    getVisibleQuestions,
    evaluateCondition,
  };
};