// src/hooks/useRiskCalculation.ts

import { useMemo, useCallback } from 'react';
import { FormValues, RiskScore, FormSection } from '../types/form.types';
import { calculateRiskScore } from '../utils/riskCalculation';

interface UseRiskCalculationReturn {
  riskScore: RiskScore;
  getSectionRisk: (sectionId: string) => number;
  getRiskTrend: () => 'improving' | 'stable' | 'worsening';
}

export const useRiskCalculation = (
  values: FormValues,
  sections: FormSection[],
  previousScore?: RiskScore
): UseRiskCalculationReturn => {
  // Memoize risk calculation to prevent unnecessary recalculations
  const riskScore = useMemo(() => {
    return calculateRiskScore(values, sections);
  }, [values, sections]);

  // Get risk score for specific section
  const getSectionRisk = useCallback(
    (sectionId: string): number => {
      return riskScore.sectionScores[sectionId] || 0;
    },
    [riskScore]
  );

  // Determine if risk is improving, stable, or worsening
  const getRiskTrend = useCallback((): 'improving' | 'stable' | 'worsening' => {
    if (!previousScore) return 'stable';

    const diff = riskScore.totalScore - previousScore.totalScore;
    const threshold = 5; // 5 point threshold

    if (diff < -threshold) return 'improving';
    if (diff > threshold) return 'worsening';
    return 'stable';
  }, [riskScore, previousScore]);

  return {
    riskScore,
    getSectionRisk,
    getRiskTrend,
  };
};