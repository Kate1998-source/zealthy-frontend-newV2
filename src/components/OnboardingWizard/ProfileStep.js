// src/components/OnboardingWizard/ProfileStep.js - Enhanced with required field validation
import React, { useState } from 'react';
import { User } from '../../models/User';
import { AdminConfig } from '../../models/AdminConfig';
import AboutMeComponent from '../form-components/AboutMeComponent';
import AddressComponent from '../form-components/AddressComponent';
import WizardNavigation from './WizardNavigation';

function ProfileStep({ userData, adminConfig, onNext, onBack, onDataChange }) {
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    // Validate step 2 data
    const user = new User(userData);
    const validation = user.validateStep(2);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    onNext();
  };

  const handleDataChange = (field, value) => {
    onDataChange(field, value);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Check if user can proceed (all required fields filled)
  const canProceed = () => {
    const user = new User(userData);
    return user.hasRequiredDataForStep(2);
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
      
      <div className="components-container">
        {renderComponents()}
      </div>
      
      <WizardNavigation
        currentStep={2}
        onBack={onBack}
        onNext={handleNext}
        loading={false}
        canProceed={canProceed()}
        isLastStep={false}
      />
    </div>
  );
}

export default ProfileStep;