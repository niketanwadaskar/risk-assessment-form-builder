// src/utils/riskCalculation.ts

import { FormValues, FormQuestion, RiskScore, FormSection } from '../types/form.types';
import { FORM_CONSTANTS } from './constants';

export const calculateRiskScore = (
  values: FormValues,
  sections: FormSection[]
): RiskScore => {
  const breakdown: RiskScore['breakdown'] = [];
  const sectionScores: Record<string, number> = {};
  let totalWeightedScore = 0;
  let totalWeight = 0;

  sections.forEach((section) => {
    let sectionScore = 0;
    let sectionWeight = 0;

    section.questions.forEach((question) => {
      const value = values[question.id];
      
      // Skip if no value
      if (value === null || value === undefined || value === '') {
        return;
      }

      const weight = question.riskWeight || 1;
      sectionWeight += weight;

      // Calculate score based on answer
      let questionScore = calculateQuestionScore(value, question);
      let weightedScore = questionScore * weight;

      breakdown.push({
        questionId: question.id,
        weight,
        value: questionScore,
        score: weightedScore,
      });

      sectionScore += weightedScore;
      totalWeightedScore += weightedScore;
      totalWeight += weight;
    });

    if (sectionWeight > 0) {
      sectionScores[section.id] = Math.min(100, (sectionScore / sectionWeight) * 100);
    }
  });

  const totalScore = totalWeight > 0 
    ? Math.min(100, Math.round((totalWeightedScore / totalWeight) * 20)) // Scale to 0-100
    : 0;

  const riskLevel = getRiskLevel(totalScore);

  return {
    totalScore,
    riskLevel,
    sectionScores,
    breakdown,
  };
};

const calculateQuestionScore = (value: any, question: FormQuestion): number => {
  switch (question.type) {
    case 'select':
      return calculateSelectScore(value, question);
    case 'checkbox':
      return calculateCheckboxScore(value, question);
    case 'number':
      return calculateNumberScore(value, question);
    case 'file':
      return value ? 100 : 0;
    case 'date':
      return value ? 100 : 0;
    case 'text':
      return value && value.length > 0 ? 100 : 0;
    default:
      return 0;
  }
};

const calculateSelectScore = (value: string, question: FormQuestion): number => {
  if (!question.options) return 0;

  // Risk-based scoring for select fields
  // Lower index = better (lower risk)
  const index = question.options.indexOf(value);
  if (index === -1) return 0;

  const riskPercentPerOption = 100 / question.options.length;
  return Math.max(0, 100 - riskPercentPerOption * (index + 1));
};

const calculateCheckboxScore = (values: string[], question: FormQuestion): number => {
  if (!Array.isArray(values) || values.length === 0) return 0;

  if (!question.options) return 0;

  // More selections = more risk items identified
  const selectedCount = values.length;
  const totalOptions = question.options.length;

  return Math.min(100, (selectedCount / totalOptions) * 100);
};

const calculateNumberScore = (value: number | string, question: FormQuestion): number => {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return 0;

  const min = question.min || 0;
  const max = question.max || 100;

  // Normalize to 0-100 scale
  const normalized = ((num - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, normalized));
};

export const getRiskLevel = (score: number): 'Low' | 'Medium' | 'High' | 'Critical' => {
  if (score <= 25) return 'Low';
  if (score <= 50) return 'Medium';
  if (score <= 75) return 'High';
  return 'Critical';
};

export const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'Low':
      return FORM_CONSTANTS.RISK_LEVELS.LOW.color;
    case 'Medium':
      return FORM_CONSTANTS.RISK_LEVELS.MEDIUM.color;
    case 'High':
      return FORM_CONSTANTS.RISK_LEVELS.HIGH.color;
    case 'Critical':
      return FORM_CONSTANTS.RISK_LEVELS.CRITICAL.color;
    default:
      return '#999';
  }
};

export const getRiskDescription = (riskLevel: string): string => {
  const descriptions: Record<string, string> = {
    Low: 'Low risk - Strong compliance and controls',
    Medium: 'Medium risk - Some areas need attention',
    High: 'High risk - Multiple concerns identified',
    Critical: 'Critical risk - Immediate action required',
  };
  return descriptions[riskLevel] || 'Unknown risk level';
};