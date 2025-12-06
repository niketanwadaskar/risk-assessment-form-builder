// src/utils/riskCalculation-IMPROVED.ts

import { FormValues, FormQuestion, RiskScore, FormSection } from '../types/form.types';
import { FORM_CONSTANTS } from './constants';

/**
 * IMPROVED Risk Calculation Algorithm
 * 
 * Key Principle: "Yes" to positive questions = LOWER risk
 *                "No" to positive questions = HIGHER risk
 * 
 * Makes sense to users:
 * - Have SOC2? Yes → Lower risk ✓
 * - Have SOC2? No → Higher risk ✓
 * - Have incidents? No → Lower risk ✓
 * - Have incidents? Yes → Higher risk ✓
 */

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
    let questionsAnswered = 0;

    section.questions.forEach((question) => {
      const value = values[question.id];
      
      // Skip if no value
      if (value === null || value === undefined || value === '') {
        return;
      }

      questionsAnswered++;
      const weight = question.riskWeight || 1;
      sectionWeight += weight;

      // Calculate score INTELLIGENTLY based on question type and answer
      let riskScore = calculateQuestionRisk(value, question);
      let weightedScore = riskScore * weight;

      breakdown.push({
        questionId: question.id,
        weight,
        value: riskScore,
        score: weightedScore,
      });

      sectionScore += weightedScore;
      totalWeightedScore += weightedScore;
      totalWeight += weight;
    });

    // Calculate section score (0-100 where 0 is GOOD, 100 is BAD)
    if (sectionWeight > 0) {
      sectionScores[section.id] = Math.min(100, (sectionScore / sectionWeight));
    }
  });

  // Calculate total score (0-100)
  const totalScore = totalWeight > 0 
    ? Math.min(100, Math.round((totalWeightedScore / totalWeight)))
    : 0;

  const riskLevel = getRiskLevel(totalScore);

  return {
    totalScore,
    riskLevel,
    sectionScores,
    breakdown,
  };
};

/**
 * Smart question risk calculation
 * 
 * Different question types have different "good" answers:
 * 
 * PROTECTIVE questions (lower score = good):
 *   "Do you have SOC2?" → Yes = 0 (good), No = 100 (bad)
 *   "Is financial audited?" → Yes = 0 (good), No = 100 (bad)
 *   "Have incident response?" → Yes = 0 (good), No = 100 (bad)
 * 
 * RISK questions (lower score = good):
 *   "How many incidents?" → 0 incidents = 0 (good), 100+ = 100 (bad)
 *   "Revenue stability?" → Stable = 0 (good), Declining = 100 (bad)
 * 
 * CAPABILITY questions (more is better):
 *   "How many certifications?" → 0 = 100 (bad), 5+ = 0 (good)
 *   "Security controls?" → 0 selected = 100 (bad), All = 0 (good)
 */
const calculateQuestionRisk = (value: any, question: FormQuestion): number => {
  // Map of question IDs to their type for smarter scoring
  const questionTypes = getQuestionType(question.id, question.label);

  switch (question.type) {
    case 'select':
      return calculateSelectRisk(value, question, questionTypes);
    
    case 'checkbox':
      return calculateCheckboxRisk(value, question);
    
    case 'number':
      return calculateNumberRisk(value, question, questionTypes);
    
    case 'file':
      // File uploaded = evidence provided = LOWER risk
      return value ? 0 : 100;
    
    case 'date':
      // Date provided = action taken = LOWER risk
      return value ? 0 : 100;
    
    case 'text':
      // Text provided = awareness/explanation = Neutral (medium)
      return value && value.length > 20 ? 25 : 50;
    
    default:
      return 0;
  }
};

/**
 * SELECT field scoring
 * Context matters - same field type can mean different things
 */
const calculateSelectRisk = (
  value: string,
  question: FormQuestion,
  questionType: string
): number => {
  if (!question.options) return 50;

  const optionIndex = question.options.indexOf(value);
  if (optionIndex === -1) return 50;

  // Protective questions: First option = good (low risk)
  // Examples: "Yes" for "Do you have SOC2?"
  if (
    questionType === 'protective' ||
    question.label.toLowerCase().includes('do you have') ||
    question.label.toLowerCase().includes('have you') ||
    question.label.toLowerCase().includes('is your')
  ) {
    // "Yes" (index 0) = 0 risk
    // "No" (index 1) = 100 risk
    // "In Progress" (index 2) = 50 risk
    const riskMap: Record<number, number> = {
      0: 0,      // Yes/First option = GOOD
      1: 100,    // No/Second option = BAD
      2: 50,     // In Progress/Third = MEDIUM
    };
    return riskMap[optionIndex] ?? 50;
  }

  // Status questions: Higher index = worse
  // Default: distribute risk evenly
  const riskPerOption = 100 / question.options.length;
  return Math.min(100, riskPerOption * optionIndex);
};

/**
 * CHECKBOX field scoring
 * More selections = more awareness/controls = LOWER risk
 */
const calculateCheckboxRisk = (values: string[], question: FormQuestion): number => {
  if (!Array.isArray(values) || values.length === 0) {
    return 100; // No controls selected = HIGH risk
  }

  if (!question.options) return 50;

  // For security controls: More = better
  const selectedCount = values.length;
  const totalOptions = question.options.length;
  const completeness = (selectedCount / totalOptions) * 100;

  // Convert: 0% selected = 100 risk, 100% selected = 0 risk
  return 100 - completeness;
};

/**
 * NUMBER field scoring
 * Context-dependent
 */
const calculateNumberRisk = (
  value: number | string,
  question: FormQuestion,
  questionType: string
): number => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 50;

  // Incident questions: More incidents = MORE risk
  if (
    questionType === 'incidents' ||
    question.label.toLowerCase().includes('incident') ||
    question.label.toLowerCase().includes('breach') ||
    question.label.toLowerCase().includes('security issue')
  ) {
    const min = question.min || 0;
    const max = question.max || 100;
    // Normalize: 0 incidents = 0 risk, max = 100 risk
    return Math.min(100, ((num - min) / (max - min)) * 100);
  }

  // Certification/capability questions: More = LOWER risk
  if (
    questionType === 'capability' ||
    question.label.toLowerCase().includes('certifications') ||
    question.label.toLowerCase().includes('years of') ||
    question.label.toLowerCase().includes('how many')
  ) {
    const min = question.min || 0;
    const max = question.max || 10;
    // Normalize: 0 = 100 risk, max = 0 risk
    return Math.max(0, 100 - ((num - min) / (max - min)) * 100);
  }

  // Revenue questions: Higher = LOWER risk (more stable)
  if (question.label.toLowerCase().includes('revenue')) {
    const min = question.min || 0;
    const max = question.max || 10000;
    // Normalize: 0 revenue = 100 risk, high revenue = 0 risk
    return Math.max(0, 100 - ((num - min) / (max - min)) * 100);
  }

  // Default: normalize across range
  const min = question.min || 0;
  const max = question.max || 100;
  return Math.min(100, ((num - min) / (max - min)) * 100);
};

/**
 * Determine question type from label/ID for smarter scoring
 */
const getQuestionType = (id: string, label: string): string => {
  const lower = (id + ' ' + label).toLowerCase();

  if (lower.includes('incident') || lower.includes('breach') || lower.includes('security issue')) {
    return 'incidents';
  }
  if (lower.includes('certifications') || lower.includes('controls') || lower.includes('how many')) {
    return 'capability';
  }
  if (lower.includes('revenue') || lower.includes('financial')) {
    return 'financial';
  }
  if (
    lower.includes('do you have') ||
    lower.includes('have you') ||
    lower.includes('is your') ||
    lower.includes('audited')
  ) {
    return 'protective';
  }

  return 'standard';
};

export const getRiskLevel = (score: number): 'Low' | 'Medium' | 'High' | 'Critical' => {
  if (score <= 25) return 'Low';      // 0-25: Good standing
  if (score <= 50) return 'Medium';   // 26-50: Some concerns
  if (score <= 75) return 'High';     // 51-75: Multiple concerns
  return 'Critical';                   // 76-100: Urgent issues
};

export const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'Low':
      return FORM_CONSTANTS.RISK_LEVELS.LOW.color;      // Green
    case 'Medium':
      return FORM_CONSTANTS.RISK_LEVELS.MEDIUM.color;   // Yellow
    case 'High':
      return FORM_CONSTANTS.RISK_LEVELS.HIGH.color;     // Orange
    case 'Critical':
      return FORM_CONSTANTS.RISK_LEVELS.CRITICAL.color; // Red
    default:
      return '#999';
  }
};

export const getRiskDescription = (riskLevel: string): string => {
  const descriptions: Record<string, string> = {
    Low: '✅ Low Risk - Strong controls and good standing',
    Medium: '⚠️ Medium Risk - Some areas need attention',
    High: '❌ High Risk - Multiple concerns identified',
    Critical: '🚨 Critical Risk - Immediate action required',
  };
  return descriptions[riskLevel] || 'Unknown risk level';
};

/**
 * EXAMPLE SCENARIOS with new algorithm:
 * 
 * ✅ GOOD OUTCOMES (Score goes DOWN):
 * - "Have SOC2?" → "Yes" = 0 risk ✓
 * - "Audited financials?" → "Yes" = 0 risk ✓
 * - "Security controls?" → Select all 6 = 0 risk ✓
 * - "Incidents in past year?" → 0 = 0 risk ✓
 * - "Certifications?" → 5 = 0 risk ✓
 * 
 * ❌ BAD OUTCOMES (Score goes UP):
 * - "Have SOC2?" → "No" = 100 risk
 * - "Audited financials?" → "No" = 100 risk
 * - "Security controls?" → None selected = 100 risk
 * - "Incidents in past year?" → 10 = high risk
 * - "Certifications?" → 0 = high risk
 * 
 * Result: Users see DIRECT correlation between answers and risk
 * Incentivizes honest, good security practices
 */