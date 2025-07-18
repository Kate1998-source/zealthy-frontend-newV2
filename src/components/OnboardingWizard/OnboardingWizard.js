
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminConfig } from '../../api';
import { User } from '../../models/User';
import FirstStep from './steps/FirstStep';
import SecondStep from './steps/SecondStep'; 
import ThirdStep from './steps/ThirdStep';
import './OnboardingWizard.css';

function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState(new User());
  const [adminConfig, setAdminConfig] = useState({ 
    2: ['ABOUT_ME', 'ADDRESS'], 
    3: ['BIRTHDATE'] 
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadAdminConfig();
    restoreProgress();
  }, []);

  useEffect(() => {
    // Save progress when userData or step changes
    if (userData.email && currentStep > 1) {
      localStorage.setItem('zealthy_user_data', JSON.stringify(userData));
      localStorage.setItem('zealthy_current_step', currentStep.toString());
    }
  }, [userData, currentStep]);

  const loadAdminConfig = async () => {
    try {
      const config = await getAdminConfig();
      setAdminConfig(config);
    } catch (error) {
      console.error('Admin config failed:', error);
      // Keep default config
    }
  };

  const restoreProgress = () => {
    const savedData = localStorage.getItem('zealthy_user_data');
    const savedStep = localStorage.getItem('zealthy_current_step');
    
    if (savedData && savedStep) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.email) {
          setUserData(new User(parsedData));
          setCurrentStep(parseInt(savedStep));
        }
      } catch (error) {
        console.error('Restore error:', error);
        clearProgress();
      }
    }
  };

  const clearProgress = () => {
    localStorage.removeItem('zealthy_user_data');
    localStorage.removeItem('zealthy_current_step');
    setCurrentStep(1);
    setUserData(new User());
    setError('');
  };

  const handleDataChange = (field, value) => {
    const updatedUser = userData.updateField(field, value);
    setUserData(updatedUser);
  };

  const handleStepNext = (newData) => {
    setUserData(new User(newData));
    setCurrentStep(prev => prev + 1);
  };

  const handleStepBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = () => {
    clearProgress();
    alert('Registration completed successfully!');
  };

  const renderProgressBar = () => {
    return (
      <div className="progress-container">
        {[1, 2, 3].map((step, index) => (
          <div key={step} className="progress-step">
            <div className={`step-circle ${currentStep >= step ? 'active' : 'inactive'}`}>
              {step}
            </div>
            {index < 2 && (
              <div className={`step-connector ${currentStep > step ? 'active' : 'inactive'}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FirstStep
            userData={userData}
            onNext={handleStepNext}
            onError={setError}
          />
        );
      case 2:
        return (
          <SecondStep
            userData={userData}
            adminConfig={adminConfig}
            onNext={() => setCurrentStep(3)}
            onBack={handleStepBack}
            onDataChange={handleDataChange}
          />
        );
      case 3:
        return (
          <ThirdStep
            userData={userData}
            adminConfig={adminConfig}
            onBack={handleStepBack}
            onDataChange={handleDataChange}
            onComplete={handleComplete}
            onError={setError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      {/* Header */}
      <div className="onboarding-header">
        <div className="header-content">
          <h1 className="header-title">Zealthy Onboarding</h1>
        </div>
      </div>

      <div className="wizard-content">
        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}
        
        {/* Current Step */}
        {renderCurrentStep()}

        {/* Footer Navigation */}
        <div className="footer-navigation">
          <nav className="footer-nav">
            <Link to="/admin" className="footer-link">
              Admin Dashboard
            </Link>
            <Link to="/data" className="footer-link">
              View Data
            </Link>
            {currentStep > 1 && (
              <button onClick={clearProgress} className="footer-button">
                Start Over
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default OnboardingWizard;
