import React, { useState } from 'react';
import { registerCompleteUser } from '../../../api';
import { User } from '../../models/User';
import { AdminConfig } from '../../models/AdminConfig';
import { useFormValidation } from '../../hooks/useFormValidation';
import { ValidationSummary } from '../shared/ValidationSummary';
import { DynamicComponentRenderer } from '../shared/DynamicComponentRenderer';
import { validateComponents } from '../../utils/validationUtils';
import WizardNavigation from '../navigation/WizardNavigation';

function ThirdStep({ userData, adminConfig, onBack, onDataChange, onComplete, onError }) {
  const [loading, setLoading] = useState(false);
  const { errors, showValidation, clearError, showErrors, clearAllErrors } = useFormValidation();

  const handleComplete = async () => {
    setLoading(true);
    onError(''); // Clear previous errors

    const config = new AdminConfig(adminConfig);
    const components = config.getComponentsForPage(3);
    
    const validationErrors = validateComponents(components, userData);

    if (Object.keys(validationErrors).length > 0) {
      showErrors(validationErrors);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const user = new User(userData);
      const result = await registerCompleteUser(user.toAPIFormat());
      console.log('Registration successful:', result);
      
      alert(`Registration Complete! User ID: ${result.id}`);
      onComplete();
      
    } catch (error) {
      console.error('Registration error:', error);
      onError(`Registration failed: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (field, value) => {
    onDataChange(field, value);
    clearError(field);
  };

  const config = new AdminConfig(adminConfig);
  const components = config.getComponentsForPage(3);
  
  // If no config, use default
  const componentsToRender = components.length === 0 
    ? ['BIRTHDATE'] 
    : components;

  const getPageDescription = () => {
    if (componentsToRender.length === 1 && componentsToRender.includes('BIRTHDATE')) {
      return "Please provide your birthdate to complete registration";
    } else {
      return "Complete your registration to save all data";
    }
  };

  return (
    <div>
      <div className="step-header">
        <h2 className="step-title">Almost Done!</h2>
        <p className="step-subtitle">
          {getPageDescription()}
        </p>
      </div>

      <ValidationSummary 
        errors={errors} 
        showValidation={showValidation}
        title="Please fix the following issues before completing registration:"
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
      
      {/* Data Preview */}
      <div className="data-preview">
        <h4 className="preview-title">Review Your Information</h4>
        <div className="preview-content">
          <p className="preview-item"><strong>Email:</strong> {userData.email}</p>
          {userData.aboutMe && (
            <p className="preview-item">
              <strong>About Me:</strong> {userData.aboutMe.length > 50 ? userData.aboutMe.substring(0, 50) + '...' : userData.aboutMe}
            </p>
          )}
          {userData.streetAddress && (
            <p className="preview-item">
              <strong>Address:</strong> {userData.streetAddress}
              {userData.city ? `, ${userData.city}` : ''}
              {userData.state ? ` ${userData.state}` : ''}
              {userData.zip ? ` ${userData.zip}` : ''}
            </p>
          )}
          {userData.birthdate && (
            <p className="preview-item">
              <strong>Birthdate:</strong> {userData.birthdate}
            </p>
          )}
        </div>
      </div>
      
      <WizardNavigation
        currentStep={3}
        onBack={onBack}
        onComplete={handleComplete}
        loading={loading}
        canProceed={true}
        isLastStep={true}
      />
    </div>
  );
}

export default ThirdStep;