// src/components/FormHeader.tsx

import React from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { formatLastSaved } from '../utils/localStorage';

interface FormHeaderProps {
  title: string;
  description?: string;
  lastSaved?: Date | null;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, description, lastSaved }) => {
  return (
    <Box sx={{ mb: 4, pb: 3, borderBottom: '2px solid #e0e0e0' }}>
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        )}
      </Stack>

      {lastSaved && (
        <Chip
          icon={<SaveIcon />}
          label={`Last saved: ${formatLastSaved(lastSaved)}`}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ mt: 2 }}
        />
      )}
    </Box>
  );
};

export default FormHeader;