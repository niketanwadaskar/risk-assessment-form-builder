// src/utils/validation.ts

import { FormValues, FormQuestion } from '../types/form.types';
import { VALIDATION_MESSAGES, FORM_CONSTANTS } from './constants';

export const validateField = (
  value: any,
  question: FormQuestion
): string | null => {
  // Check required
  if (question.required) {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return question.errorMessage || VALIDATION_MESSAGES.REQUIRED;
    }
  }

  // Skip validation for empty optional fields
  if (!question.required && (value === null || value === undefined || value === '')) {
    return null;
  }

  switch (question.type) {
    case 'text':
      return validateText(value, question);
    case 'number':
      return validateNumber(value, question);
    case 'date':
      return validateDate(value, question);
    case 'email':
      return validateEmail(value);
    default:
      return null;
  }
};

const validateText = (value: string, question: FormQuestion): string | null => {
  if (!value) return null;

  if (question.minLength && value.length < question.minLength) {
    return VALIDATION_MESSAGES.MIN_LENGTH(question.minLength);
  }

  if (question.maxLength && value.length > question.maxLength) {
    return VALIDATION_MESSAGES.MAX_LENGTH(question.maxLength);
  }

  if (question.pattern) {
    const regex = new RegExp(question.pattern);
    if (!regex.test(value)) {
      return VALIDATION_MESSAGES.PATTERN_MISMATCH;
    }
  }

  return null;
};

const validateNumber = (value: number | string, question: FormQuestion): string | null => {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return 'Please enter a valid number';
  }

  if (question.min !== undefined && num < question.min) {
    return VALIDATION_MESSAGES.MIN_VALUE(question.min);
  }

  if (question.max !== undefined && num > question.max) {
    return VALIDATION_MESSAGES.MAX_VALUE(question.max);
  }

  return null;
};

const validateDate = (value: string, question: FormQuestion): string | null => {
  if (!value) return null;

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return VALIDATION_MESSAGES.INVALID_DATE;
  }

  return null;
};

const validateEmail = (value: string): string | null => {
  if (!value) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return VALIDATION_MESSAGES.INVALID_EMAIL;
  }

  return null;
};

export const validateForm = (
  values: FormValues,
  questions: FormQuestion[]
): Record<string, string> => {
  const errors: Record<string, string> = {};

  questions.forEach((question) => {
    const error = validateField(values[question.id], question);
    if (error) {
      errors[question.id] = error;
    }
  });

  return errors;
};

export const isFormValid = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length === 0;
};

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
};

export const formatValue = (value: any, type: string): any => {
  switch (type) {
    case 'number':
      return value ? parseFloat(value) : null;
    case 'date':
      return value ? new Date(value).toISOString().split('T')[0] : null;
    case 'checkbox':
      return Array.isArray(value) ? value : [];
    default:
      return value;
  }
};