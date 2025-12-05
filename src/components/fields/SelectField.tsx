// src/components/fields/SelectField.tsx

import React from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  disabled?: boolean;
  options: string[];
  error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  value,
  onChange,
  onBlur,
  disabled,
  options,
  error,
}) => {
  return (
    <FormControl fullWidth error={!!error}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
      >
        <MenuItem value="">
          <em>Select an option</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectField;