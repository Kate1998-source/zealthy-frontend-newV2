// src/components/OnboardingWizard/WizardNavigation.js
import React from 'react';

function WizardNavigation({ 
  currentStep, 
  onBack, 
  onNext, 
  onComplete, 
  loading, 
  canProceed = true,
  isLastStep = false 
}) {
  const getButtonClasses = () => {
    let classes = 'nav-button';
    
    if (currentStep > 1) {
      // Show back button
      if (isLastStep) {
        classes += ' complete-button';
      } else {
        classes += ' next-button';
      }
    } else {
      // First step, only next button
      classes += ' next-button';
    }
    
    if (loading) {
      classes += ' loading';
    }
    
    return classes;
  };

  const getBackButtonClasses = () => {
    let classes = 'nav-button back-button';
    if (loading) classes += ' loading';
    return classes;
  };

  const getButtonText = () => {
    if (loading) {
      return isLastStep ? 'Completing...' : 'Processing...';
    }
    return isLastStep ? 'Complete Registration' : 'Continue';
  };

  return (
    <div className="wizard-navigation">
      {/* Back Button - only show if not on first step */}
      {currentStep > 1 && (
        <button 
          onClick={onBack}
          disabled={loading}
          className={getBackButtonClasses()}
        >
          ← Back
        </button>
      )}

      {/* Next/Complete Button */}
      <button 
        onClick={isLastStep ? onComplete : onNext}
        disabled={loading || !canProceed}
        className={getButtonClasses()}
      >
        {getButtonText()}
      </button>
    </div>
  );
}

export default WizardNavigation;