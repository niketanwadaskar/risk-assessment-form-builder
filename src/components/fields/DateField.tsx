// src/components/fields/DateField.tsx

import React from 'react';
import { TextField as MuiTextField } from '@mui/material';

interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  disabled?: boolean;
  error?: string;
}

const DateField: React.FC<DateFieldProps> = ({
  value,
  onChange,
  onBlur,
  disabled,
  error,
}) => {
  return (
    <MuiTextField
      fullWidth
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      error={!!error}
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        min: '1900-01-01',
        max: new Date().toISOString().split('T')[0],
      }}
    />
  );
};

export default DateField;