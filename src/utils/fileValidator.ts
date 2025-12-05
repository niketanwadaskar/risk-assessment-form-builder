// src/utils/fileValidator.ts

import { FORM_CONSTANTS, VALIDATION_MESSAGES } from './constants';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const validateFile = (file: File, maxSizeMB: number = FORM_CONSTANTS.MAX_FILE_SIZE_MB): FileValidationResult => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file type
  if (!isAllowedFileType(file)) {
    return {
      valid: false,
      error: VALIDATION_MESSAGES.INVALID_FILE_TYPE,
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: VALIDATION_MESSAGES.FILE_TOO_LARGE(maxSizeMB),
    };
  }

  return { valid: true };
};

const isAllowedFileType = (file: File): boolean => {
  const allowedTypes = FORM_CONSTANTS.ALLOWED_FILE_TYPES;
  return (
    allowedTypes.includes(file.type) ||
    allowedTypes.some(type => file.name.endsWith(type))
  );
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};