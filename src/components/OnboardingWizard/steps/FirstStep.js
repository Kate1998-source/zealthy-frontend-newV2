// src/components/OnboardingWizard/FirstStep.js
import React, { useState } from 'react';
import { checkEmailExists } from '../../api';
import { User } from '../../models/User';
import WizardNavigation from '../navigation/WizardNavigation';

function FirstStep({ userData, onNext, onError }) {
  const [formData, setFormData] = useState({
    email: userData.email || '',
    password: userData.password || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setShowValidation(true);
    setLoading(true);
    setErrors({});
    onError(''); // Clear previous errors

    // Create User instance for validation
    const user = new User(formData);
    const validation = user.validateStep(1);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        setErrors({ email: 'This email is already registered. Please use a different email.' });
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Pass data to parent
      setShowValidation(false);
      onNext({ ...userData, ...formData });
      
    } catch (error) {
      console.error('Email check error:', error);
      onError('Failed to validate email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      email: 'Email Address',
      password: 'Password'
    };
    return displayNames[field] || field;
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Create Your Account</h2>
        <p className="step-subtitle">
          We'll check if your email is available before proceeding
        </p>
      </div>

      {/* Validation Summary */}
      {renderValidationSummary()}
      
      <form onSubmit={handleSubmit} className="wizard-form">
        <div className="form-field">
          <label className="form-label">
            Email Address <span className="required">*</span>
          </label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email" 
            required 
            className={`wizard-input ${errors.email ? 'error' : ''}`}
          />
          {errors.email && (
            <div className="error-message">
              {errors.email}
            </div>
          )}
        </div>
        
        <div className="form-field">
          <label className="form-label">
            Password <span className="required">*</span>
          </label>
          <input 
            type="password" 
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter your password (min 6 characters)" 
            minLength="6"
            required 
            className={`wizard-input ${errors.password ? 'error' : ''}`}
          />
          {errors.password && (
            <div className="error-message">
              {errors.password}
            </div>
          )}
          <div className="help-text">
            Password must be at least 6 characters long
          </div>
        </div>
        
        <WizardNavigation
          currentStep={1}
          onNext={handleSubmit}
          loading={loading}
          canProceed={true} // Always allow clicking, but show errors
          isLastStep={false}
        />
      </form>
    </div>
  );
}

export default FirstStep;