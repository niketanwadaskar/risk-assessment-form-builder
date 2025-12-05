// src/components/FormSection.tsx

import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormSection as FormSectionType, FormQuestion } from '../types/form.types';
import FormField from './FormField';

interface FormSectionProps {
  section: FormSectionType;
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Set<string>;
  onChange: (fieldId: string, value: any) => void;
  onBlur: (fieldId: string) => void;
  isFieldVisible: (question: FormQuestion) => boolean;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  values,
  errors,
  touched,
  onChange,
  onBlur,
  isFieldVisible,
}) => {
  const [expanded, setExpanded] = useState(section.expanded !== false);

  const visibleQuestions = section.questions.filter(isFieldVisible);

  return (
    <Accordion
      expanded={expanded}
      onChange={(e, newExpanded) => setExpanded(newExpanded)}
      sx={{
        '&.MuiAccordion-root': {
          boxShadow: 0,
          border: '1px solid #e0e0e0',
          '&:before': { display: 'none' },
        },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {section.title}
          </Typography>
          {section.description && (
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
              {section.description}
            </Typography>
          )}
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={3}>
          {visibleQuestions.map((question) => (
            <FormField
              key={question.id}
              question={question}
              value={values[question.id] ?? ''}
              error={errors[question.id]}
              touched={touched.has(question.id)}
              onChange={(value) => onChange(question.id, value)}
              onBlur={() => onBlur(question.id)}
            />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default FormSection;