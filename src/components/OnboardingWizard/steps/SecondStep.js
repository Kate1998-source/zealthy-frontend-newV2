// src/components/OnboardingWizard/steps/SecondStep.js
import React, { useState } from 'react';
import { User } from '../../../models/User';
import { AdminConfig } from '../../../models/AdminConfig';
import AboutMeComponent from '../../form-components/AboutMeComponent';
import AddressComponent from '../../form-components/AddressComponent';
import BirthdateComponent from '../../form-components/BirthdateComponent';  // ← ADD THIS
import WizardNavigation from '../navigation/WizardNavigation';

function SecondStep({ userData, adminConfig, onNext, onBack, onDataChange }) {
  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);

  const handleNext = () => {
    setShowValidation(true);
    
    // Get which components are configured for this page
    const config = new AdminConfig(adminConfig);
    const components = config.getComponentsForPage(2);
    
    // Only validate the components that are actually on this page
    const validationErrors = {};
    const user = new User(userData);
    
    // Check each configured component
    if (components.includes('ABOUT_ME')) {
      const aboutMeValidation = user.validateAboutMe();
      if (!aboutMeValidation.isValid) {
        validationErrors.aboutMe = aboutMeValidation.message;
      }
    }
    
    if (components.includes('ADDRESS')) {
      const addressValidation = user.validateAddress();
      if (!addressValidation.isValid) {
        Object.assign(validationErrors, addressValidation.errors);
      }
    }

    
    if (components.includes('BIRTHDATE')) {
      const birthdateValidation = user.validateBirthdate();
      if (!birthdateValidation.isValid) {
        validationErrors.birthdate = birthdateValidation.message;
      }
    }
    
    // If there are validation errors, show them
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
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
      zip: 'ZIP Code',
      birthdate: 'Birthdate'  
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
    
    // Render only the configured components
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
        case 'BIRTHDATE':  
          return (
            <BirthdateComponent
              key="birthdate"
              value={userData.birthdate || ''}
              onChange={handleDataChange}
              error={errors.birthdate}
              required={true}
            />
          );
        default:
          return null;
      }
    });
  };

  const getPageDescription = () => {
    const config = new AdminConfig(adminConfig);
    const components = config.getComponentsForPage(2);
    
    if (components.length > 1) {
      return "All fields are required. Your progress is automatically saved.";
    } else if (components.includes('ABOUT_ME')) {
      return "Tell us about yourself. Your progress is automatically saved.";
    } else if (components.includes('ADDRESS')) {
      return "Please provide your address information. Your progress is automatically saved.";
    } else if (components.includes('BIRTHDATE')) {
      return "Please provide your birthdate. Your progress is automatically saved.";
    } else {
      return "Your progress is automatically saved.";
    }
  };

  return (
    <div>
      <div className="step-header">
        <h2 className="step-title">Tell Us About Yourself</h2>
        <p className="step-subtitle">
          {getPageDescription()}
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

export default SecondStep;