// src/utils/constants.ts

export const FORM_CONSTANTS = {
  MAX_FILE_SIZE_MB: 10,
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  ALLOWED_FILE_TYPES: ['.pdf', 'application/pdf'],
  
  // Risk levels
  RISK_LEVELS: {
    LOW: { min: 0, max: 25, label: 'Low', color: '#4caf50' },
    MEDIUM: { min: 26, max: 50, label: 'Medium', color: '#ff9800' },
    HIGH: { min: 51, max: 75, label: 'High', color: '#ff5722' },
    CRITICAL: { min: 76, max: 100, label: 'Critical', color: '#f44336' },
  },
  
  // Field validations
  TEXT_MAX_LENGTH: 500,
  TEXT_MIN_LENGTH: 1,
  NUMBER_MIN: 0,
  NUMBER_MAX: 999999,
  
  // Storage keys
  STORAGE_KEYS: {
    FORM_DRAFT: 'form_draft_',
    FORM_SUBMISSION: 'form_submission_',
    LAST_SAVED: 'form_last_saved_',
  },
  
  // Animation timings
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  
  // Accessibility
  A11Y: {
    FOCUS_OUTLINE_WIDTH: '2px',
    FOCUS_OUTLINE_OFFSET: '2px',
  },
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  MIN_LENGTH: (min: number) => `Minimum ${min} characters required`,
  MAX_LENGTH: (max: number) => `Maximum ${max} characters allowed`,
  MIN_VALUE: (min: number) => `Value must be at least ${min}`,
  MAX_VALUE: (max: number) => `Value must be at most ${max}`,
  INVALID_FILE_TYPE: 'Only PDF files are allowed',
  FILE_TOO_LARGE: (size: number) => `File size must be less than ${size}MB`,
  INVALID_DATE: 'Please enter a valid date',
  PATTERN_MISMATCH: 'Please enter a valid format',
};

export const RISK_WEIGHT_LABELS: Record<number, string> = {
  1: 'Very Low Impact',
  2: 'Low Impact',
  3: 'Medium Impact',
  4: 'High Impact',
  5: 'Critical Impact',
};