// src/tests/riskCalculation.test.ts

import { calculateRiskScore, getRiskLevel, getRiskColor } from '../utils/riskCalculation';
import { FormSection, FormValues } from '../types/form.types';

describe('Risk Calculation Tests', () => {
  const mockSections: FormSection[] = [
    {
      id: 'compliance',
      title: 'Compliance',
      questions: [
        {
          id: 'q1',
          type: 'select',
          label: 'Do you have SOC2?',
          options: ['Yes', 'No'],
          required: true,
          riskWeight: 4,
        },
        {
          id: 'q2',
          type: 'number',
          label: 'Certifications',
          required: false,
          riskWeight: 3,
          min: 0,
          max: 5,
        },
      ],
    },
    {
      id: 'financial',
      title: 'Financial',
      questions: [
        {
          id: 'q3',
          type: 'select',
          label: 'Audited financials?',
          options: ['Yes', 'No'],
          required: true,
          riskWeight: 5,
        },
      ],
    },
  ];

  describe('calculateRiskScore', () => {
    it('should calculate risk score from form values', () => {
      const values: FormValues = {
        q1: 'Yes',
        q2: 5,
        q3: 'Yes',
      };

      const score = calculateRiskScore(values, mockSections);

      expect(score).toBeDefined();
      expect(score.totalScore).toBeGreaterThanOrEqual(0);
      expect(score.totalScore).toBeLessThanOrEqual(100);
      expect(score.riskLevel).toMatch(/Low|Medium|High|Critical/);
      expect(score.sectionScores).toBeDefined();
      expect(Object.keys(score.breakdown).length).toBeGreaterThan(0);
    });

    it('should return 0 score for empty values', () => {
      const values: FormValues = {};
      const score = calculateRiskScore(values, mockSections);

      expect(score.totalScore).toBe(0);
      expect(score.riskLevel).toBe('Low');
    });

    it('should calculate section scores', () => {
      const values: FormValues = {
        q1: 'Yes',
        q2: 3,
        q3: 'No',
      };

      const score = calculateRiskScore(values, mockSections);

      expect(score.sectionScores['compliance']).toBeDefined();
      expect(score.sectionScores['financial']).toBeDefined();
    });
  });

  describe('getRiskLevel', () => {
    it('should return correct risk level', () => {
      expect(getRiskLevel(10)).toBe('Low');
      expect(getRiskLevel(35)).toBe('Medium');
      expect(getRiskLevel(60)).toBe('High');
      expect(getRiskLevel(90)).toBe('Critical');
    });
  });

  describe('getRiskColor', () => {
    it('should return correct color for risk level', () => {
      expect(getRiskColor('Low')).toBe('#4caf50');
      expect(getRiskColor('Medium')).toBe('#ff9800');
      expect(getRiskColor('High')).toBe('#ff5722');
      expect(getRiskColor('Critical')).toBe('#f44336');
    });
  });
});