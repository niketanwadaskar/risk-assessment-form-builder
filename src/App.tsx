import FormBuilder from './components/FormBuilder';
import formConfig from './config/formConfig.ts';

function App() {
  return (
    <FormBuilder
      config={formConfig}
      formId="risk-assessment"
      onSubmit={(values, riskScore) => {
        console.log('Form submitted:', values, riskScore);
      }}
    />
  );
}

export default App;
