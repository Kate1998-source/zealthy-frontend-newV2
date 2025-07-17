import React, { useState } from 'react';
import { checkEmailExists } from '../../api';
import { User } from '../../models/User';
import { useFormValidation } from '../../hooks/useFormValidation';
import { ValidationSummary } from '../shared/ValidationSummary';
import WizardNavigation from '../navigation/WizardNavigation';

function FirstStep({ userData, onNext, onError }) {
  const [formData, setFormData] = useState({
    email: userData.email || '',
    password: userData.password || ''
  });
  const [loading, setLoading] = useState(false);
  const { errors, showValidation, clearError, showErrors, clearAllErrors } = useFormValidation();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    onError(''); // Clear previous errors

    // Create User instance for validation
    const user = new User(formData);
    const validation = user.validateStep(1);

    if (!validation.isValid) {
      showErrors(validation.errors);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        showErrors({ email: 'This email is already registered. Please use a different email.' });
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Pass data to parent
      clearAllErrors();
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
    clearError(field);
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Create Your Account</h2>
        <p className="step-subtitle">
          We'll check if your email is available before proceeding
        </p>
      </div>

      <ValidationSummary 
        errors={errors} 
        showValidation={showValidation} 
      />
      
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
          canProceed={true}
          isLastStep={false}
        />
      </form>
    </div>
  );
}

export default FirstStep;