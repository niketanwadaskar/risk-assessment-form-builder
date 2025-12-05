// src/components/fields/CheckboxField.tsx

import React from 'react';
import { FormGroup, FormControlLabel, Checkbox, Box } from '@mui/material';

interface CheckboxFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur: () => void;
  disabled?: boolean;
  options: string[];
  error?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  value = [],
  onChange,
  onBlur,
  disabled,
  options,
  error,
}) => {
  const handleChange = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter((v) => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <Box
      sx={{
        border: error ? '1px solid #f44336' : '1px solid #ccc',
        borderRadius: '4px',
        p: 2,
      }}
    >
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={option}
            control={
              <Checkbox
                checked={value.includes(option)}
                onChange={() => handleChange(option)}
                onBlur={onBlur}
                disabled={disabled}
              />
            }
            label={option}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default CheckboxField;