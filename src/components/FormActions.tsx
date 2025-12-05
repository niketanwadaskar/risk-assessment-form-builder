// src/components/FormActions.tsx

import React from 'react';
import { Box, Button, Stack, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SendIcon from '@mui/icons-material/Send';

interface FormActionsProps {
  isDirty: boolean;
  hasErrors: boolean;
  onSave: () => void;
  onReset: () => void;
  onSubmit?: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  isDirty,
  hasErrors,
  onSave,
  onReset,
  onSubmit,
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Stack spacing={2}>
        {hasErrors && (
          <Alert severity="warning">
            Please fix all errors before submitting the form.
          </Alert>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={onReset}
            disabled={!isDirty}
          >
            Reset
          </Button>

          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={onSave}
            disabled={!isDirty}
          >
            Save Draft
          </Button>

          {onSubmit && (
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={onSubmit}
              disabled={hasErrors}
              color="primary"
            >
              Submit Form
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default FormActions;