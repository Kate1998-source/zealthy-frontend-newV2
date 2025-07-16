// src/components/OnboardingWizard/EmailPasswordStep.js
import React, { useState } from 'react';
import { checkEmailExists } from '../../api';
import { User } from '../../models/User';
import WizardNavigation from './WizardNavigation';

function EmailPasswordStep({ userData, onNext, onError }) {
  const [formData, setFormData] = useState({
    email: userData.email || '',
    password: userData.password || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrors({});
    onError(''); // Clear previous errors

    // Create User instance for validation
    const user = new User(formData);
    const validation = user.validateStep(1);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        setErrors({ email: 'This email is already registered. Please use a different email.' });
        return;
      }

      // Pass data to parent
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

  const canProceed = formData.email && formData.password && formData.password.length >= 6;

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Create Your Account</h2>
        <p className="step-subtitle">
          We'll check if your email is available before proceeding
        </p>
      </div>
      
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
        </div>
        
        <WizardNavigation
          currentStep={1}
          onNext={handleSubmit}
          loading={loading}
          canProceed={canProceed}
          isLastStep={false}
        />
      </form>
    </div>
  );
}

export default EmailPasswordStep;