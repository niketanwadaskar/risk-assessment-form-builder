
export type FormFieldType = 'text' | 'number' | 'select' | 'checkbox' | 'file' | 'date' | 'email';

export interface ConditionalLogic {
  questionId: string;
  answer: string | string[];
  operator?: 'equals' | 'contains' | 'notEquals';
}

export interface FormQuestion {
  id: string;
  type: FormFieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  riskWeight: number; // 1-5 scale
  conditional?: ConditionalLogic | null;
  
  // Text field
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  
  // Number field
  min?: number;
  max?: number;
  
  // Select/Checkbox fields
  options?: string[];
  
  // File field
  accept?: string;
  maxSize?: number; // in MB
  
  // Help text
  helpText?: string;
  errorMessage?: string;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  questions: FormQuestion[];
  collapsible?: boolean;
  expanded?: boolean;
}

export interface FormConfig {
  sections: FormSection[];
  title?: string;
  description?: string;
}

export interface FormValues {
  [key: string]: any;
}

export interface FieldError {
  [key: string]: string;
}

export interface FileUploadState {
  file: File | null;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface RiskScore {
  totalScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  sectionScores: {
    [sectionId: string]: number;
  };
  breakdown: {
    questionId: string;
    weight: number;
    value: number;
    score: number;
  }[];
}

export interface FormDraft {
  id: string;
  formId: string;
  values: FormValues;
  lastSaved: Date;
  riskScore?: RiskScore;
}

export interface FormSubmission {
  id: string;
  formId: string;
  values: FormValues;
  riskScore: RiskScore;
  submittedAt: Date;
  status: 'draft' | 'submitted' | 'reviewed';
}