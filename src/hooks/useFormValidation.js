
import { useState } from 'react';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);

  const clearError = (field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const setFieldError = (field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const clearAllErrors = () => {
    setErrors({});
    setShowValidation(false);
  };

  const showErrors = (errorObj) => {
    setErrors(errorObj);
    setShowValidation(true);
  };

  const hasErrors = () => {
    return Object.keys(errors).length > 0 && 
           Object.values(errors).some(error => error !== null);
  };

  return {
    errors,
    showValidation,
    clearError,
    setFieldError,
    clearAllErrors,
    showErrors,
    hasErrors
  };
};