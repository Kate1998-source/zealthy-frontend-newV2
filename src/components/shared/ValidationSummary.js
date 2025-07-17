
import React from 'react';
import { getFieldDisplayName } from '../../utils/fieldNames';

export const ValidationSummary = ({ 
  errors, 
  showValidation, 
  title = "Please fix the following issues:" 
}) => {
  if (!showValidation || Object.keys(errors).length === 0) {
    return null;
  }

  const errorFields = Object.entries(errors).filter(([key, value]) => value !== null);
  
  if (errorFields.length === 0) {
    return null;
  }

  return (
    <div className="validation-summary">
      <h4> {title}</h4>
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