
import React, { useState } from 'react';
import { registerCompleteUser } from '../../api';
import { User } from '../../models/User';
import { AdminConfig } from '../../models/AdminConfig';
import BirthdateComponent from '../../form-components/BirthdateComponent';
import AboutMeComponent from '../../form-components/AboutMeComponent';
import AddressComponent from '../../form-components/AddressComponent';
import WizardNavigation from '../navigation/WizardNavigation';

function ThirdStep({ userData, adminConfig, onBack, onDataChange, onComplete, onError }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);

  const handleComplete = async () => {
    setShowValidation(true);
    setLoading(true);
    setErrors({});
    onError(''); // Clear previous errors

    // Get which components are configured for this page
    const config = new AdminConfig(adminConfig);
    const components = config.getComponentsForPage(3);
    
    // Only validate the components that are actually on this page
    const validationErrors = {};
    const user = new User(userData);
    
    // Check each configured component
    if (components.includes('BIRTHDATE')) {
      const birthdateValidation = user.validateBirthdate();
      if (!birthdateValidation.isValid) {
        validationErrors.birthdate = birthdateValidation.message;
      }
    }
    
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

    // If there are validation errors, show them
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <h4>Please fix the following issues before completing registration:</h4>
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
      birthdate: 'Birthdate',
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
    const components = config.getComponentsForPage(3);
    
    // If no config, use default
    if (components.length === 0) {
      return [
        <BirthdateComponent
          key="birthdate"
          value={userData.birthdate || ''}
          onChange={handleDataChange}
          error={errors.birthdate}
          required={true}
        />
      ];
    }
    
    // Render only the configured components
    return components.map(componentType => {
      switch (componentType) {
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

  const getPageDescription = () => {
    const config = new AdminConfig(adminConfig);
    const components = config.getComponentsForPage(3);
    
    if (components.length === 1 && components.includes('BIRTHDATE')) {
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

      {/* Validation Summary */}
      {renderValidationSummary()}
      
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
        canProceed={true} // Always allow clicking, but show errors
        isLastStep={true}
      />
    </div>
  );
}

export default ThirdStep;