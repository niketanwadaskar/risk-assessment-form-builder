// src/tests/validation.test.ts

import {
  validateField,
  validateForm,
  isFormValid,
} from '../utils/validation';
import { FormQuestion } from '../types/form.types';

describe('Validation Tests', () => {
  describe('validateField', () => {
    it('should validate required fields', () => {
      const question: FormQuestion = {
        id: 'q1',
        type: 'text',
        label: 'Required Field',
        required: true,
        riskWeight: 1,
      };

      expect(validateField('', question)).toBeTruthy();
      expect(validateField('value', question)).toBeNull();
    });

    it('should validate text field length', () => {
      const question: FormQuestion = {
        id: 'q1',
        type: 'text',
        label: 'Text Field',
        required: false,
        riskWeight: 1,
        minLength: 5,
        maxLength: 20,
      };

      expect(validateField('abc', question)).toBeTruthy(); // Too short
      expect(validateField('12345', question)).toBeNull(); // Valid
      expect(validateField('123456789012345678901', question)).toBeTruthy(); // Too long
    });

    it('should validate number field range', () => {
      const question: FormQuestion = {
        id: 'q1',
        type: 'number',
        label: 'Number Field',
        required: false,
        riskWeight: 1,
        min: 1,
        max: 100,
      };

      expect(validateField(0, question)).toBeTruthy();
      expect(validateField(50, question)).toBeNull();
      expect(validateField(150, question)).toBeTruthy();
    });

    it('should validate optional fields', () => {
      const question: FormQuestion = {
        id: 'q1',
        type: 'text',
        label: 'Optional Field',
        required: false,
        riskWeight: 1,
      };

      expect(validateField('', question)).toBeNull();
      expect(validateField(null, question)).toBeNull();
    });
  });

  describe('validateForm', () => {
    it('should validate entire form', () => {
      const questions: FormQuestion[] = [
        {
          id: 'q1',
          type: 'text',
          label: 'Field 1',
          required: true,
          riskWeight: 1,
        },
        {
          id: 'q2',
          type: 'number',
          label: 'Field 2',
          required: true,
          riskWeight: 1,
          min: 0,
          max: 10,
        },
      ];

      const validValues = { q1: 'value', q2: 5 };
      const invalidValues = { q1: '', q2: 15 };

      expect(Object.keys(validateForm(validValues, questions)).length).toBe(0);
      expect(Object.keys(validateForm(invalidValues, questions)).length).toBeGreaterThan(0);
    });
  });

  describe('isFormValid', () => {
    it('should check if form has no errors', () => {
      expect(isFormValid({})).toBe(true);
      expect(isFormValid({ q1: 'error' })).toBe(false);
    });
  });
});