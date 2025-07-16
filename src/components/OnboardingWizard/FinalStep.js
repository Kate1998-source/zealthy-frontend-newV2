// src/components/OnboardingWizard/FinalStep.js
import React, { useState } from 'react';
import { registerCompleteUser } from '../../api';
import { User } from '../../models/User';
import { AdminConfig } from '../../models/AdminConfig';
import BirthdateComponent from '../form-components/BirthdateComponent';
import AboutMeComponent from '../form-components/AboutMeComponent';
import AddressComponent from '../form-components/AddressComponent';
import WizardNavigation from './WizardNavigation';

function FinalStep({ userData, adminConfig, onBack, onDataChange, onComplete, onError }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleComplete = async () => {
    setLoading(true);
    setErrors({});
    onError(''); // Clear previous errors

    // Validate step 3 data
    const user = new User(userData);
    const validation = user.validateStep(3);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const renderComponents = () => {
    const config = new AdminConfig(adminConfig);
    const components = config.getComponentsForPage(3);
    
    // If no config, use default
    if (components.length === 0) {
      return [
        <BirthdateComponent
          key="birthdate"
          value={userData.birthdate || ''}
          onChange={handleDataChange}
          error={errors.birthdate}
        />
      ];
    }
    
    return components.map(componentType => {
      switch (componentType) {
        case 'BIRTHDATE':
          return (
            <BirthdateComponent
              key="birthdate"
              value={userData.birthdate || ''}
              onChange={handleDataChange}
              error={errors.birthdate}
            />
          );
        case 'ABOUT_ME':
          return (
            <AboutMeComponent
              key="about-me"
              value={userData.aboutMe || ''}
              onChange={handleDataChange}
              error={errors.aboutMe}
            />
          );
        case 'ADDRESS':
          return (
            <AddressComponent
              key="address"
              values={userData}
              onChange={handleDataChange}
              errors={errors}
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
        <h2 className="step-title">Almost Done!</h2>
        <p className="step-subtitle">
          Complete your registration to save all data
        </p>
      </div>
      
      <div className="components-container">
        {renderComponents()}
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

export default FinalStep;