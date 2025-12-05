// src/components/fields/FileField.tsx

import React, { useRef, useState } from 'react';
import { Box, Button, Typography, LinearProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { validateFile, formatFileSize } from '../../utils/fileValidator';

interface FileFieldProps {
  value: File | null;
  onChange: (file: File | null) => void;
  onBlur: () => void;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
  error?: string;
}

const FileField: React.FC<FileFieldProps> = ({
  value,
  onChange,
  onBlur,
  disabled,
  accept = '.pdf',
  maxSize = 10,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    // Validate file
    const validation = validateFile(file, maxSize);
    if (!validation.valid) {
      setUploadError(validation.error || 'File validation failed');
      setUploading(false);
      return;
    }

    // Simulate upload delay
    setTimeout(() => {
      onChange(file);
      setUploading(false);
      onBlur();
    }, 500);
  };

  const handleDelete = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        style={{ display: 'none' }}
      />

      {!value ? (
        <Button
          fullWidth
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          sx={{ py: 2 }}
        >
          Choose File
        </Button>
      ) : (
        <Box sx={{ p: 2, border: '1px solid #4caf50', borderRadius: '4px', bgcolor: '#f1f8e9' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CheckCircleIcon sx={{ color: '#4caf50' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {value.name}
            </Typography>
          </Box>
          <Typography variant="caption" color="textSecondary">
            Size: {formatFileSize(value.size)} / {maxSize}MB
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              color="error"
            >
              Remove
            </Button>
          </Box>
        </Box>
      )}

      {uploading && <LinearProgress sx={{ mt: 2 }} />}
      {uploadError && <Alert severity="error" sx={{ mt: 2 }}>{uploadError}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default FileField;