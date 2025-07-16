import React, { useState } from 'react';
import { User } from '../../models/User';
import { AdminConfig } from '../../models/AdminConfig';
import AboutMeComponent from '../form-components/AboutMeComponent';
import AddressComponent from '../form-components/AddressComponent';
import WizardNavigation from './WizardNavigation';

function ProfileStep({ userData, adminConfig, onNext, onBack, onDataChange }) {
  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);

  const handleNext = () => {
    setShowValidation(true);
    
    // Validate step 2 data
    const user = new User(userData);
    const validation = user.validateStep(2);

    if (!validation.isValid) {
      setErrors(validation.errors);
      
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If validation passes, proceed
    setErrors({});
    setShowValidation(false);
    onNext();
  };

  const handleDataChange = (field, value) => {
    onDataChange(field, value);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const renderValidationSummary = () => {
    if (!showValidation || Object.keys(errors).length === 0) {
      return null;
    }

    const errorFields = Object.entries(errors).filter(([key, value]) => value !== null);
    
    if (errorFields.length === 0) {
      return null;
    }

    return (
      <div className="validation-summary">
        <h4>⚠️ Please fix the following issues:</h4>
        <ul>
          {errorFields.map(([field, message]) => (
            <li key={field}>
              <strong>{getFieldDisplayName(field)}:</strong> {message}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const getFieldDisplayName = (field) => {
    const displayNames = {
      aboutMe: 'About Me',
      streetAddress: 'Street Address', 
      city: 'City',
      state: 'State',
      zip: 'ZIP Code'
    };
    return displayNames[field] || field;
  };

  const renderComponents = () => {
    const config = new AdminConfig(adminConfig);
    const components = config.getComponentsForPage(2);
    
    // If no config, use default components
    if (components.length === 0) {
      return [
        <AboutMeComponent
          key="about-me"
          value={userData.aboutMe || ''}
          onChange={handleDataChange}
          error={errors.aboutMe}
          required={true}
        />,
        <AddressComponent
          key="address"
          values={userData}
          onChange={handleDataChange}
          errors={errors}
          required={true}
        />
      ];
    }
    
    return components.map(componentType => {
      switch (componentType) {
        case 'ABOUT_ME':
          return (
            <AboutMeComponent
              key="about-me"
              value={userData.aboutMe || ''}
              onChange={handleDataChange}
              error={errors.aboutMe}
              required={true}
            />
          );
        case 'ADDRESS':
          return (
            <AddressComponent
              key="address"
              values={userData}
              onChange={handleDataChange}
              errors={errors}
              required={true}
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <div>
      <div className="step-header">
        <h2 className="step-title">Tell Us About Yourself</h2>
        <p className="step-subtitle">
          All fields are required. Your progress is automatically saved.
        </p>
      </div>

      {/* Validation Summary */}
      {renderValidationSummary()}
      
      <div className="components-container">
        {renderComponents()}
      </div>
      
      <WizardNavigation
        currentStep={2}
        onBack={onBack}
        onNext={handleNext}
        loading={false}
        canProceed={true} // Always allow clicking, but show errors
        isLastStep={false}
      />
    </div>
  );
}

export default ProfileStep;