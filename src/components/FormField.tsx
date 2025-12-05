// src/components/FormField.tsx

import React, { memo } from 'react';
import { Box, FormHelperText, Typography } from '@mui/material';
import { FormQuestion } from '../types/form.types';
import TextField from './fields/TextField';
import NumberField from './fields/NumberField';
import SelectField from './fields/SelectField';
import CheckboxField from './fields/CheckboxField';
import FileField from './fields/FileField';
import DateField from './fields/DateField';

interface FormFieldProps {
  question: FormQuestion;
  value: any;
  error?: string;
  touched?: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = memo(({
  question,
  value,
  error,
  touched,
  onChange,
  onBlur,
  disabled,
}) => {
  const hasError = touched && !!error;

  const renderField = () => {
    switch (question.type) {
      case 'text':
        return (
          <TextField
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            maxLength={question.maxLength}
            placeholder={question.placeholder}
          />
        );
      case 'number':
        return (
          <NumberField
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            min={question.min}
            max={question.max}
            placeholder={question.placeholder}
          />
        );
      case 'select':
        return (
          <SelectField
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            options={question.options || []}
          />
        );
      case 'checkbox':
        return (
          <CheckboxField
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            options={question.options || []}
          />
        );
      case 'file':
        return (
          <FileField
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            accept={question.accept}
            maxSize={question.maxSize}
          />
        );
      case 'date':
        return (
          <DateField
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Label */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
          {question.label}
        </Typography>
        {question.required && (
          <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 600 }}>
            *
          </Typography>
        )}
      </Box>

      {/* Description */}
      {question.description && (
        <Typography variant="caption" color="textSecondary">
          {question.description}
        </Typography>
      )}

      {/* Field */}
      <Box sx={{ mt: 1 }}>
        {renderField()}
      </Box>

      {/* Help Text */}
      {question.helpText && !hasError && (
        <FormHelperText sx={{ color: '#666', fontSize: '0.75rem' }}>
          {question.helpText}
        </FormHelperText>
      )}

      {/* Error Message */}
      {hasError && (
        <FormHelperText error>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
});

FormField.displayName = 'FormField';

export default FormField;