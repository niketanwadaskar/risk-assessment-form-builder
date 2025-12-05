// src/components/FormBuilder.tsx

import React, { useMemo, useCallback } from 'react';
import {
  Container,
  Box,
  Paper,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { FormConfig, FormQuestion } from '../types/form.types';
import { useFormState } from '../hooks/useFormState';
import { useRiskCalculation } from '../hooks/useRiskCalculation';
import { useConditionalLogic } from '../hooks/useConditionalLogic';
import { useAutoSave } from '../hooks/useAutoSave';
import FormHeader from './FormHeader';
import FormSection from './FormSection';
import RiskScoreboard from './RiskScoreboard';
import FormActions from './FormActions';

interface FormBuilderProps {
  config: FormConfig;
  formId: string;
  onSubmit?: (values: any, riskScore: any) => void | Promise<void>;
  loadFromStorage?: boolean;
  autoSaveEnabled?: boolean;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  config,
  formId,
  onSubmit,
  loadFromStorage = true,
  autoSaveEnabled = true,
}) => {
  // Flatten all questions for form state management
  const allQuestions = useMemo(
    () => config.sections.flatMap((s) => s.questions),
    [config.sections]
  );

  // Initialize form state
  const formState = useFormState(
    formId,
    {},
    allQuestions,
    loadFromStorage
  );

  // Calculate risk score
  const { riskScore } = useRiskCalculation(
    formState.values,
    config.sections
  );

  // Handle conditional logic
  const { isFieldVisible } = useConditionalLogic(formState.values);

  // Auto-save functionality
  const { lastSaved, manualSave } = useAutoSave(
    formId,
    formState.values,
    formState.isDirty,
    riskScore,
    autoSaveEnabled ? 30000 : undefined
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate all fields
      const isValid = formState.validateAllFields();
      if (!isValid) {
        return;
      }

      if (onSubmit) {
        await onSubmit(formState.values, riskScore);
      }

      // Save final submission
      manualSave();
    },
    [formState, riskScore, onSubmit, manualSave]
  );

  // Handle manual save
  const handleManualSave = useCallback(() => {
    manualSave();
  }, [manualSave]);

  // Accessibility: announce form changes
  React.useEffect(() => {
    const formStatus = `Risk assessment form, risk level ${riskScore.riskLevel}`;
    const announcement = new Intl.ListFormat('en', {
      style: 'long',
      type: 'conjunction',
    });
    // Could announce via ARIA live region
  }, [riskScore.riskLevel]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <FormHeader
          title={config.title || 'Risk Assessment Form'}
          description={config.description}
          lastSaved={lastSaved}
        />

        {/* Risk Scoreboard */}
        <Box sx={{ mb: 4 }}>
          <RiskScoreboard riskScore={riskScore} sections={config.sections} />
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Sections */}
          <Stack spacing={3} sx={{ mb: 4 }}>
            {config.sections.map((section) => (
              <FormSection
                key={section.id}
                section={section}
                values={formState.values}
                errors={formState.errors}
                touched={formState.touched}
                onChange={formState.setValue}
                onBlur={formState.touchField}
                isFieldVisible={isFieldVisible}
              />
            ))}
          </Stack>

          {/* Error Summary */}
          {formState.errors && Object.keys(formState.errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Please fix the errors below before submitting the form.
            </Alert>
          )}

          {/* Action Buttons */}
          <FormActions
            isDirty={formState.isDirty}
            hasErrors={Object.keys(formState.errors).length > 0}
            onSave={handleManualSave}
            onReset={formState.resetForm}
          />
        </form>
      </Paper>
    </Container>
  );
};

export default FormBuilder;