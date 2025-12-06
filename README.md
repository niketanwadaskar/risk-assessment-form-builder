Dynamic Risk Assessment Form Builder
A production-ready React 18+ TypeScript application for building dynamic, accessible risk assessment forms with real-time validation, conditional logic, and risk score calculation.

🎯 Features
Dynamic Form Rendering - JSON-driven form configuration

6 Field Types - Text, Number, Select, Checkbox, File (PDF), Date

Conditional Logic - Show/hide fields based on previous answers

Real-time Risk Scoring - Weighted calculation with section breakdown

Auto-save - Automatic draft saving every 30 seconds

Full Accessibility - WCAG 2.1 AA compliant, keyboard navigation

Responsive Design - Mobile, tablet, desktop optimized

Type Safety - Full TypeScript coverage

Comprehensive Testing - Jest + React Testing Library

📋 Architecture
text
FormBuilder (Main Component)
├── FormHeader (Title, Last Saved)
├── RiskScoreboard (Real-time Risk Display)
├── FormSection[]
│   ├── FormField[]
│   │   ├── TextField
│   │   ├── NumberField
│   │   ├── SelectField
│   │   ├── CheckboxField
│   │   ├── FileField
│   │   └── DateField
│   └── Validation Status
└── FormActions (Save/Submit)

Custom Hooks:
- useFormState: State management
- useRiskCalculation: Risk scoring
- useConditionalLogic: Field visibility
- useAutoSave: Draft persistence
- useValidation: Form validation
🚀 Quick Start
Prerequisites
Node.js 16+

npm or yarn

Installation
bash
# Clone the repository
git clone https://github.com/yourusername/risk-assessment-form-builder.git
cd risk-assessment-form-builder

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
Environment Variables
Create .env file:

text
REACT_APP_AUTO_SAVE_INTERVAL=30000
REACT_APP_MAX_FILE_SIZE=10485760
📁 Project Structure
text
src/
├── components/
│   ├── FormBuilder.tsx           # Main form component
│   ├── FormSection.tsx           # Section wrapper
│   ├── FormField.tsx             # Field wrapper
│   ├── RiskScoreboard.tsx        # Risk display
│   ├── FormHeader.tsx            # Header component
│   ├── FormActions.tsx           # Action buttons
│   └── fields/                   # Field type components
│       ├── TextField.tsx
│       ├── NumberField.tsx
│       ├── SelectField.tsx
│       ├── CheckboxField.tsx
│       ├── FileField.tsx
│       └── DateField.tsx
├── hooks/                        # Custom React hooks
│   ├── useFormState.ts
│   ├── useRiskCalculation.ts
│   ├── useConditionalLogic.ts
│   ├── useAutoSave.ts
│   └── useValidation.ts
├── utils/                        # Utility functions
│   ├── validation.ts
│   ├── riskCalculation.ts
│   ├── fileValidator.ts
│   ├── localStorage.ts
│   └── constants.ts
├── types/
│   └── form.types.ts             # TypeScript types
├── config/
│   └── formConfig.json           # Example form config
├── styles/
│   ├── theme.ts                  # MUI theme
│   └── globals.css
├── tests/                        # Unit tests
├── App.tsx                       # Main app
└── index.tsx                     # Entry point
💡 Key Design Decisions
1. Component Architecture
Single Responsibility: Each field component handles one type only

Composition: FormField wrapper abstracts common logic

Reusability: Custom hooks enable code sharing across components

2. State Management
React Hook Form: Minimal boilerplate, excellent performance

Custom Hooks: Separate concerns (form state, validation, risk)

Context: Optional for large apps (not included in basic version)

3. Conditional Logic
Declarative: Conditions defined in JSON config

Efficient: Only visible fields are validated

Smooth: CSS animations for field transitions

4. Risk Calculation
Weighted Algorithm: Each question has a risk weight (1-5)

Real-time Updates: Calculated on every field change

Section Breakdown: Risk scored by category

Visual Feedback: Color-coded risk levels

5. Auto-save Strategy
30-second Interval: Balance between data loss prevention and performance

localStorage: Works offline, no backend required

Draft Management: Multiple draft versions supported

Last Saved: User-visible timestamp

6. Accessibility
Semantic HTML: Proper use of form elements

ARIA Labels: Screen reader support

Keyboard Navigation: Tab, Enter, Escape support

Focus Management: Visible focus indicators

Error Messages: Associated with form fields

📝 Form Configuration
Example JSON configuration:

json
{
  "sections": [
    {
      "id": "compliance",
      "title": "Compliance Assessment",
      "description": "Evaluate your compliance posture",
      "questions": [
        {
          "id": "q1",
          "type": "select",
          "label": "Do you have SOC2 certification?",
          "description": "ISO/IEC 27001 or SOC2 Type II",
          "options": ["Yes", "No", "In Progress"],
          "required": true,
          "riskWeight": 4,
          "conditional": null
        },
        {
          "id": "q2",
          "type": "file",
          "label": "Upload compliance certificate",
          "accept": ".pdf",
          "maxSize": 10,
          "required": false,
          "riskWeight": 5,
          "conditional": {
            "questionId": "q1",
            "answer": "Yes"
          }
        }
      ]
    }
  ]
}
🧪 Testing
bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test FormBuilder.test.tsx

# Watch mode
npm test -- --watch
Test Coverage
Components: Rendering, user interactions, conditional rendering

Hooks: State management, calculations, side effects

Utilities: Validation, risk scoring, file validation

Integration: Form submission, auto-save, error handling

🎨 Customization
Theme Customization
Edit src/styles/theme.ts:

typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    // ... custom colors
  },
});
Adding New Field Type
Create component in src/components/fields/CustomField.tsx

Add type to FormFieldType in src/types/form.types.ts

Update FormField.tsx to render new type

Add validation rules if needed

🔒 Security Considerations
File Upload: Only PDF files accepted, size limited to 10MB

Input Validation: All inputs sanitized before processing

XSS Prevention: React's built-in escaping used throughout

Type Safety: TypeScript prevents many runtime errors

🚦 Performance Optimization
Memoization: Components memoized to prevent unnecessary re-renders

useCallback: Event handlers memoized

useMemo: Expensive calculations cached

Code Splitting: Dynamic imports for large components

Lazy Loading: Components loaded on demand

📊 Risk Calculation Algorithm
text
Total Risk Score = Σ (Answer Weight × Question Weight) / Total Possible Weight

Risk Levels:
- 0-25: Low (Green)
- 26-50: Medium (Yellow)
- 51-75: High (Orange)
- 76-100: Critical (Red)

Section Score = Sum of weighted answers in section
Overall Score = Average of all section scores
🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing-feature)

Open a Pull Request

Code Standards
Use TypeScript strictly

Follow ESLint configuration

Write tests for new features

Update documentation

Use descriptive commit messages

📚 Additional Resources
React Hook Form Docs

Material-UI Documentation

TypeScript Handbook

WCAG 2.1 Guidelines

📄 License
MIT License - see LICENSE file for details

👤 Author
Developed as a comprehensive UI Developer coding exercise solution.

🐛 Troubleshooting
Form not persisting
Check browser localStorage is enabled

Verify auto-save interval in environment variables

Check browser console for errors

File upload not working
Ensure file is PDF format

Verify file size is under 10MB

Check CORS settings if using backend

Validation not triggering
Ensure field is marked as required in config

Check conditional logic isn't hiding the field

Verify validation rules in src/utils/validation.ts

📞 Support
For issues or questions:

Check existing GitHub issues

Create a new issue with detailed description

Include error messages and reproduction steps

Version: 1.0.0
Last Updated: December 2024
Maintenance: Active