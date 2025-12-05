// src/components/fields/TextField.tsx

import React from 'react';
import { TextField as MuiTextField, Box } from '@mui/material';

interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
  error?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  value,
  onChange,
  onBlur,
  disabled,
  maxLength,
  placeholder,
  error,
}) => {
  const charCount = value?.length || 0;
  const showCharCount = maxLength && value;

  return (
    <Box>
      <MuiTextField
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        inputProps={{ maxLength }}
        error={!!error}
        multiline
        minRows={3}
        maxRows={6}
      />
      {showCharCount && (
        <Box sx={{ mt: 1, textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: charCount === maxLength ? '#f44336' : '#999' }}>
            {charCount}/{maxLength}
          </span>
        </Box>
      )}
    </Box>
  );
};

export default TextField;