import React from 'react';
import { AdminConfig } from '../../../models/AdminConfig';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { ValidationSummary } from '../../shared/ValidationSummary';
import { DynamicComponentRenderer } from '../../shared/DynamicComponentRenderer';
import { validateComponents, getPageDescription } from '../../../utils/validationUtils';
import WizardNavigation from '../navigation/WizardNavigation';

function SecondStep({ userData, adminConfig, onNext, onBack, onDataChange }) {
  const { errors, showValidation, clearError, showErrors, clearAllErrors } = useFormValidation();

  const handleNext = () => {
    const config = new AdminConfig(adminConfig);
    const components = config.getComponentsForPage(2);
    
    const validationErrors = validateComponents(components, userData);
    
    if (Object.keys(validationErrors).length > 0) {
      showErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    clearAllErrors();
    onNext();
  };

  const handleDataChange = (field, value) => {
    onDataChange(field, value);
    clearError(field);
  };

  const config = new AdminConfig(adminConfig);
  const components = config.getComponentsForPage(2);

  // If no config, use default components
  const componentsToRender = components.length === 0 
    ? ['ABOUT_ME', 'ADDRESS'] 
    : components;

  return (
    <div>
      <div className="step-header">
        <h2 className="step-title">Tell Us About Yourself</h2>
        <p className="step-subtitle">
          {getPageDescription(componentsToRender)}
        </p>
      </div>

      <ValidationSummary 
        errors={errors} 
        showValidation={showValidation} 
      />
      
      <div className="components-container">
        <DynamicComponentRenderer
          components={componentsToRender}
          userData={userData}
          errors={errors}
          onChange={handleDataChange}
          required={true}
        />
      </div>
      
      <WizardNavigation
        currentStep={2}
        onBack={onBack}
        onNext={handleNext}
        loading={false}
        canProceed={true}
        isLastStep={false}
      />
    </div>
  );
}

export default SecondStep;