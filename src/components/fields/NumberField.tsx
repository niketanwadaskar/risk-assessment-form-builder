// src/components/fields/NumberField.tsx

import React from 'react';
import { TextField as MuiTextField } from '@mui/material';

interface NumberFieldProps {
  value: number | string;
  onChange: (value: number) => void;
  onBlur: () => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  error?: string;
}

const NumberField: React.FC<NumberFieldProps> = ({
  value,
  onChange,
  onBlur,
  disabled,
  min,
  max,
  placeholder,
  error,
}) => {
  return (
    <MuiTextField
      fullWidth
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      error={!!error}
      inputProps={{
        min,
        max,
        step: 'any',
      }}
    />
  );
};

export default NumberField;